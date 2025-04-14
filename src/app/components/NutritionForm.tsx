"use client";

import { useState } from "react";
import { NutritionModal } from "./NutritionModal";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { z } from "zod";
import { FiUser, FiActivity, FiTarget, FiCalendar, FiHash } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { saveNutritionToHistory } from "../lib/nutritionService";
import { toast } from "react-toastify";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  weight: z.string()
    .min(1, "Peso é obrigatório")
    .refine(val => /^\d+(\.\d+)?$/.test(val), "Peso deve ser um número (ex: 70 ou 70.5)"),
  height: z.string()
    .min(1, "Altura é obrigatória")
    .refine(val => /^\d+(\.\d+)?$/.test(val), "Altura deve ser um número (ex: 175 ou 1.75)"),
  age: z.string()
    .min(1, "Idade é obrigatória")
    .refine(val => /^\d+$/.test(val), "Idade deve ser um número inteiro"),
  gender: z.string().refine(val => val !== "" && val !== "Selecione o sexo", "Selecione um sexo"),
  objective: z.string().refine(val => val !== "" && val !== "Selecione o objetivo", "Selecione um objetivo"),
  activityLevel: z.string().refine(val => val !== "" && val !== "Selecione o nível de atividade", "Selecione um nível de atividade"),
});

type FormDataType = z.infer<typeof formSchema>;

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

export function NutritionForm() {
  const { data: session } = useSession();
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    weight: "",
    height: "",
    age: "",
    gender: "",
    objective: "",
    activityLevel: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  async function createNutrition(event: React.FormEvent) {
    event.preventDefault();
    
    // Validate the form
    const validationResult = formSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.errors.forEach(error => {
        if (error.path[0]) {
          formattedErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }
    
    if (!session?.user?.email) {
      toast.error("Você precisa estar logado para gerar uma dieta");
      return;
    }
    
    setErrors({});
    setIsLoading(true);

    try {
      const genIA = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_API_KEY!);
      const model = genIA.getGenerativeModel({ model: "gemini-1.5-flash" });

      const response = await model.generateContent(
        `Crie uma dieta completa para uma pessoa com nome: ${formData.name} do sexo ${formData.gender} com peso atual: ${formData.weight}kg, altura: ${formData.height}, idade: ${formData.age} anos e com foco e objetivo em ${formData.objective}, atualmente nível de atividade: ${formData.activityLevel} e ignore qualquer outro parametro que não seja os passados, retorne em json com as respectivas propriedades, propriedade nome o nome da pessoa, propriedade sexo com sexo, propriedade idade, propriedade altura, propriedade peso, propriedade objetivo com o objetivo atual, propriedade refeições com uma array contendo dentro cada objeto sendo uma refeição da dieta e dentro de cada refeição a propriedade horário com horário da refeição, propriedade nome com nome e a propriedade alimentos com array contendo os alimentos dessa refeição e pode incluir uma propriedade como suplementos contendo array com sugestão de suplemento que é indicado para o sexo dessa pessoa e o objetivo dela e não retorne nenhuma observação alem das passadas no prompt, retorne em json e nenhuma propriedade pode ter acento.`
      );

      console.log(JSON.stringify(response, null, 2));

      if(response.response && response.response.candidates){
        const jsonText = response.response.candidates[0]?.content.parts[0].text as string;
        const jsonString = jsonText.replace(/```\w*\n/g, '').replace(/\n```/g, '').trim();
        const rawData = JSON.parse(jsonString);
        
        const formattedData: NutritionData = {
          name: rawData.nome,
          height: String(rawData.altura),
          weight: String(rawData.peso),
          age: String(rawData.idade),
          gender: String(rawData.sexo),
          objective: rawData.objetivo,
          activityLevel: rawData.niveldeatividade || formData.activityLevel,
          meals: rawData.refeicoes.map((meal: { nome: string; horario: string; alimentos: string[] }) => ({
            name: meal.nome,
            time: meal.horario,
            foods: meal.alimentos,
          })),
          supplements: rawData.suplementos || [],
        };
      
        console.log("Dieta formatada: ", formattedData);
        
        // Salvar no Firebase
        await saveNutritionToHistory(formattedData, session.user.email);
        toast.success("Dieta gerada e salva com sucesso!");

        setNutritionData(formattedData);
        setIsNutritionModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar dieta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Informações Pessoais</h2>
        <p className="text-gray-500 text-sm mt-1">Preencha seus dados para gerar um plano personalizado</p>
      </div>

      <form className="p-6" onSubmit={createNutrition}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nome completo</label>
            <div className="input-icon-container">
              <div className="input-icon">
                <FiUser className="w-5 h-5" />
              </div>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Seu nome"
                className={`with-icon w-full ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Idade</label>
            <div className="input-icon-container">
              <div className="input-icon">
                <FiCalendar className="w-5 h-5" />
              </div>
              <input
                name="age"
                value={formData.age}
                onChange={handleChange}
                type="text"
                placeholder="Sua idade"
                className={`with-icon w-full ${errors.age ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
            <div className="input-icon-container">
              <div className="input-icon">
                <FiHash className="w-5 h-5" />
              </div>
              <input
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                type="text"
                placeholder="Ex: 70.5"
                className={`with-icon w-full ${errors.weight ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
            <div className="input-icon-container">
              <div className="input-icon">
                <FiHash className="w-5 h-5" />
              </div>
              <input
                name="height"
                value={formData.height}
                onChange={handleChange}
                type="text"
                placeholder="Ex: 175"
                className={`with-icon w-full ${errors.height ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sexo</label>
            <div className="input-icon-container">
              <div className="input-icon">
                <FiUser className="w-5 h-5" />
              </div>
              <select
                name="gender"
                className={`with-icon w-full appearance-none bg-white ${errors.gender ? 'border-red-500' : ''}`}
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Selecione o sexo</option>
                <option>Masculino</option>
                <option>Feminino</option>
              </select>
            </div>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Objetivo</label>
            <div className="input-icon-container">
              <div className="input-icon">
                <FiTarget className="w-5 h-5" />
              </div>
              <select
                name="objective"
                className={`with-icon w-full appearance-none bg-white ${errors.objective ? 'border-red-500' : ''}`}
                value={formData.objective}
                onChange={handleChange}
              >
                <option value="">Selecione o objetivo</option>
                <option>Emagrecimento</option>
                <option>Hipertrofia</option>
                <option>Hipertrofia e Definição</option>
                <option>Definição</option>
              </select>
            </div>
            {errors.objective && <p className="text-red-500 text-sm">{errors.objective}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nível de Atividade</label>
            <div className="input-icon-container">
              <div className="input-icon">
                <FiActivity className="w-5 h-5" />
              </div>
              <select
                name="activityLevel"
                className={`with-icon w-full appearance-none bg-white ${errors.activityLevel ? 'border-red-500' : ''}`}
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="">Selecione o nível de atividade</option>
                <option>Sedentário (pouco ou nenhuma atividade física)</option>
                <option>Levemente ativo (exercícios 1 a 3 vezes na semana)</option>
                <option>Moderadamente ativo (exercícios 3 a 5 vezes na semana)</option>
                <option>Altamente ativo (exercícios 5 a 7 vezes por semana)</option>
              </select>
            </div>
            {errors.activityLevel && <p className="text-red-500 text-sm">{errors.activityLevel}</p>}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="btn btn-primary h-12 px-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-white text-xl" />
            ) : (
              "Gerar Plano Nutricional"
            )}
          </button>
        </div>
      </form>

      <NutritionModal
        isOpen={isNutritionModalOpen}
        onRequestClose={() => setIsNutritionModalOpen(false)}
        data={nutritionData}
      />
    </div>
  );
}
