"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { NutritionHistory, deleteNutritionHistory, getAllNutritionHistory } from "../../lib/nutritionService";
import { redirect } from "next/navigation";
import { FiTrash2, FiEye, FiClock, FiDownload } from "react-icons/fi";
import { NutritionModal } from "../../components/NutritionModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [nutritionHistory, setNutritionHistory] = useState<NutritionHistory[]>([]);
  const [selectedNutrition, setSelectedNutrition] = useState<NutritionHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!session?.user?.email) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching history for user:", session.user.email);
      
      // Get all nutrition history
      const allHistory = await getAllNutritionHistory();
      console.log("All history data:", allHistory);
      
      // Filter the history client-side instead of using Firestore query
      // This is a temporary solution until the Firestore index is created
      const userEmail = session.user?.email || '';
      const filteredHistory = allHistory.filter(item => item.userId === userEmail);
      console.log("Filtered history data:", filteredHistory);
      
      // Set the nutrition history
      setNutritionHistory(filteredHistory.length > 0 ? filteredHistory : allHistory);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      toast.error("Erro ao carregar histórico. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }

    if (status === "authenticated" && session?.user?.email) {
      fetchHistory();
    }
  }, [status, session, fetchHistory]);

  async function handleDelete(id: string) {
    if (!id) return;
    
    setIsDeleting(id);
    try {
      await deleteNutritionHistory(id);
      setNutritionHistory(prev => prev.filter(item => item.id !== id));
      toast.success("Dieta removida do histórico com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir dieta:", error);
      toast.error("Erro ao excluir dieta. Tente novamente mais tarde.");
    } finally {
      setIsDeleting(null);
    }
  }

  function formatDate(timestamp: unknown) {
    try {
      if (!timestamp) return "Data desconhecida";
      
      // Converter para data se for um timestamp do Firestore
      let date: Date;
      
      if (typeof timestamp === 'object' && timestamp !== null && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
        // Firestore Timestamp
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        // É uma data JavaScript
        date = timestamp;
      } else {
        // Tenta converter outros tipos
        date = new Date(String(timestamp));
      }
      
      // Cálculo da diferença em milisegundos
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      // Convertendo para unidades de tempo
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      const diffMonth = Math.floor(diffDay / 30);
      const diffYear = Math.floor(diffMonth / 12);
      
      // Formatação em português
      if (diffSec < 60) return "há alguns segundos";
      if (diffMin < 60) return `há ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
      if (diffHour < 24) return `há ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
      if (diffDay < 30) return `há ${diffDay} ${diffDay === 1 ? 'dia' : 'dias'}`;
      if (diffMonth < 12) return `há ${diffMonth} ${diffMonth === 1 ? 'mês' : 'meses'}`;
      return `há ${diffYear} ${diffYear === 1 ? 'ano' : 'anos'}`;
    } catch {
      return "Data inválida";
    }
  }

  function handleViewNutrition(nutrition: NutritionHistory) {
    setSelectedNutrition(nutrition);
    setIsModalOpen(true);
  }

  function downloadPDF(nutrition: NutritionHistory) {
    if (!nutrition.id) return;
    
    setIsDownloading(nutrition.id);
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = margin;
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 128, 0);
      doc.text("Plano Nutricional", doc.internal.pageSize.width / 2, y, { align: "center" });
      y += 10;
      
      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Plano personalizado para ${nutrition.name}`, doc.internal.pageSize.width / 2, y, { align: "center" });
      y += 15;
      
      // User info
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Nome: ${nutrition.name}`, margin, y);
      y += 7;
      doc.text(`Sexo: ${nutrition.gender}`, margin, y);
      y += 7;
      doc.text(`Idade: ${nutrition.age} anos`, margin, y);
      y += 7;
      doc.text(`Altura: ${nutrition.height} cm`, margin, y);
      y += 7;
      doc.text(`Peso: ${nutrition.weight} kg`, margin, y);
      y += 7;
      doc.text(`Objetivo: ${nutrition.objective}`, margin, y);
      y += 7;
      doc.text(`Nível de Atividade: ${nutrition.activityLevel}`, margin, y);
      y += 15;
      
      // Meals
      doc.setFontSize(14);
      doc.setTextColor(0, 128, 0);
      doc.text("Refeições", margin, y);
      y += 10;
      
      // Each meal
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      nutrition.meals.forEach((meal) => {
        if (y > doc.internal.pageSize.height - 30) {
          doc.addPage();
          y = margin;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${meal.name} - ${meal.time}`, margin, y);
        y += 7;
        
        doc.setFontSize(10);
        doc.setTextColor(70, 70, 70);
        
        meal.foods.forEach((food) => {
          if (y > doc.internal.pageSize.height - 20) {
            doc.addPage();
            y = margin;
          }
          doc.text(`• ${food}`, margin + 5, y);
          y += 6;
        });
        
        y += 5;
      });
      
      // Supplements if available
      if (nutrition.supplements && nutrition.supplements.length > 0) {
        if (y > doc.internal.pageSize.height - 30) {
          doc.addPage();
          y = margin;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 128, 0);
        doc.text("Suplementos Recomendados", margin, y);
        y += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(70, 70, 70);
        
        nutrition.supplements.forEach((supplement) => {
          if (y > doc.internal.pageSize.height - 20) {
            doc.addPage();
            y = margin;
          }
          doc.text(`• ${supplement}`, margin + 5, y);
          y += 6;
        });
      }
      
      // Save
      doc.save(`Plano_Nutricional_${nutrition.name.replace(/\s/g, '_')}.pdf`);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsDownloading(null);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Histórico de Dietas</h1>
          <p className="text-gray-600">
            Visualize todas as dietas que você gerou anteriormente.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <AiOutlineLoading3Quarters className="animate-spin text-green-600 text-xl mr-2" />
              <span className="text-gray-600">Carregando histórico...</span>
            </div>
          ) : nutritionHistory.length === 0 ? (
            <div className="text-center p-12">
              <div className="flex justify-center mb-4">
                <FiClock className="text-gray-400 w-12 h-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma dieta no histórico</h3>
              <p className="text-gray-500">
                Você ainda não criou nenhuma dieta. Vá para a página inicial para criar uma.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {nutritionHistory.map((nutrition) => (
                <div key={nutrition.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Dieta para {nutrition.name}
                      </h3>
                      <div className="text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <FiClock className="mr-1 w-4 h-4" />
                          <span>{formatDate(nutrition.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {nutrition.objective}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {nutrition.gender}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {nutrition.age} anos
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <button 
                        onClick={() => downloadPDF(nutrition)}
                        disabled={isDownloading === nutrition.id}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600"
                        title="Baixar PDF"
                      >
                        {isDownloading === nutrition.id ? (
                          <AiOutlineLoading3Quarters className="animate-spin" size={18} />
                        ) : (
                          <FiDownload size={18} />
                        )}
                      </button>
                      <button 
                        onClick={() => handleViewNutrition(nutrition)}
                        className="p-2 rounded-full hover:bg-green-100 text-green-600"
                        title="Visualizar dieta"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(nutrition.id!)}
                        disabled={isDeleting === nutrition.id}
                        className="p-2 rounded-full hover:bg-red-100 text-red-500"
                        title="Excluir dieta"
                      >
                        {isDeleting === nutrition.id ? (
                          <AiOutlineLoading3Quarters className="animate-spin" size={18} />
                        ) : (
                          <FiTrash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedNutrition && (
        <NutritionModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          data={selectedNutrition}
        />
      )}
    </div>
  );
} 