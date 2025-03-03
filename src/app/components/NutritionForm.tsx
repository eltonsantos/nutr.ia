"use client";

import { useState } from "react";
import { NutritionModal } from "./NutritionModal";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

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
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    height: "",
    age: "",
    gender: "Masculino",
    objective: "Emagrecimento",
    activityLevel: "Sedentário (pouco ou nenhuma atividade física)",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function createNutrition() {
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

        setNutritionData(formattedData);
        setIsNutritionModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex-1 p-6">
      <p className="text-gray-700">Gerencie sua nutrição com facilidade.</p>

      <form className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-4">Criar Dieta</h2>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          type="text"
          placeholder="Nome"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          type="text"
          placeholder="Peso (kg)"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          name="height"
          value={formData.height}
          onChange={handleChange}
          type="text"
          placeholder="Altura (cm)"
          className="w-full p-2 border rounded mb-2"
        />
        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
          type="text"
          placeholder="Idade"
          className="w-full p-2 border rounded mb-2"
        />
        <select
          name="gender"
          className="w-full p-2 border rounded mb-2"
          value={formData.gender}
          onChange={handleChange}
        >
          <option>Masculino</option>
          <option>Feminino</option>
        </select>
        <select
          name="objective"
          className="w-full p-2 border rounded mb-2"
          value={formData.objective}
          onChange={handleChange}
        >
          <option>Emagrecimento</option>
          <option>Hipertrofia</option>
          <option>Hipertrofia e Definição</option>
          <option>Definição</option>
        </select>
        <select
          name="activityLevel"
          className="w-full p-2 border rounded mb-2"
          value={formData.activityLevel}
          onChange={handleChange}
        >
          <option>Sedentário (pouco ou nenhuma atividade física)</option>
          <option>Levemente ativo (exercícios 1 a 3 vezes na semana)</option>
          <option>
            Moderadamente ativo (exercícios 3 a 5 vezes na semana)
          </option>
          <option>Altamente ativo (exercícios 5 a 7 vezes por semana)</option>
        </select>
        <button
          className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer justify-center align-middle items-center justify-items-center"
          style={{ minWidth: "140px", height: "40px" }}
          onClick={(event) => {
            event.preventDefault();
            createNutrition();
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-white text-xl" />
          ) : (
            "Gerar Dieta"
          )}
        </button>
      </form>

      <NutritionModal
        isOpen={isNutritionModalOpen}
        onRequestClose={() => setIsNutritionModalOpen(false)}
        data={nutritionData}
      />
    </main>
  );
}
