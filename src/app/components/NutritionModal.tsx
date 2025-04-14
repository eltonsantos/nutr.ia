"use client";

import Modal from "react-modal";
import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { FiClock, FiUsers, FiTarget, FiActivity, FiDownload } from "react-icons/fi";
import { jsPDF } from "jspdf";

interface NutritionData {
  name: string;
  height: string;
  weight: string;
  age: string;
  gender: string;
  objective: string;
  activityLevel: string;
  meals: { name: string; time: string; foods: string[] }[];
  supplements: string[];
}

interface NutritionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  data: NutritionData | null;
}

export function NutritionModal({ isOpen, onRequestClose, data }: NutritionModalProps) {
  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  if (!data) return null;

  const generatePDF = () => {
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
    doc.text(`Plano personalizado para ${data.name}`, doc.internal.pageSize.width / 2, y, { align: "center" });
    y += 15;
    
    // User info
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Nome: ${data.name}`, margin, y);
    y += 7;
    doc.text(`Sexo: ${data.gender}`, margin, y);
    y += 7;
    doc.text(`Idade: ${data.age} anos`, margin, y);
    y += 7;
    doc.text(`Altura: ${data.height} cm`, margin, y);
    y += 7;
    doc.text(`Peso: ${data.weight} kg`, margin, y);
    y += 7;
    doc.text(`Objetivo: ${data.objective}`, margin, y);
    y += 7;
    doc.text(`Nível de Atividade: ${data.activityLevel}`, margin, y);
    y += 15;
    
    // Meals
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0);
    doc.text("Refeições", margin, y);
    y += 10;
    
    // Each meal
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    data.meals.forEach((meal) => {
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
    if (data.supplements && data.supplements.length > 0) {
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
      
      data.supplements.forEach((supplement) => {
        if (y > doc.internal.pageSize.height - 20) {
          doc.addPage();
          y = margin;
        }
        doc.text(`• ${supplement}`, margin + 5, y);
        y += 6;
      });
    }
    
    // Save
    doc.save(`Plano_Nutricional_${data.name.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
      >
        <IoIosClose size={32} />
      </button>

      <div className="space-y-6">
        <div className="text-center pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-green-600">Plano Nutricional</h2>
          <p className="text-gray-600 mt-1">
            Plano personalizado para {data.name}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <FiUsers className="w-5 h-5 mx-auto text-green-600 mb-1" />
            <p className="text-xs uppercase font-medium text-gray-500">Sexo</p>
            <p className="font-medium">{data.gender}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{data.age}</p>
            <p className="text-xs uppercase font-medium text-gray-500">Idade</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{data.height} cm</p>
            <p className="text-xs uppercase font-medium text-gray-500">Altura</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{data.weight} kg</p>
            <p className="text-xs uppercase font-medium text-gray-500">Peso</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 flex-1">
            <FiTarget className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase font-medium text-gray-500">Objetivo</p>
              <p className="font-medium">{data.objective}</p>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3 flex-1">
            <FiActivity className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase font-medium text-gray-500">Nível de Atividade</p>
              <p className="font-medium">{data.activityLevel}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-green-600">🍽️</span> Refeições
          </h3>
          <div className="space-y-4">
            {data.meals.map((meal, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-800">{meal.name}</h4>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <FiClock className="w-4 h-4" />
                    <span>{meal.time}</span>
                  </div>
                </div>
                <ul className="text-gray-600 space-y-1">
                  {meal.foods.map((food, foodIndex) => (
                    <li key={foodIndex} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-green-500">
                      {food}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {data.supplements.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-green-600">💊</span> Suplementos Recomendados
            </h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <ul className="space-y-2">
                {data.supplements.map((supplement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>{supplement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button 
            onClick={generatePDF}
            className="btn btn-outline flex items-center gap-2"
          >
            <FiDownload size={18} />
            <span>Baixar PDF</span>
          </button>
          <button 
            onClick={onRequestClose}
            className="btn btn-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  )
}