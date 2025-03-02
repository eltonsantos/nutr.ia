"use client"

import { useState } from "react";
import { NutritionModal } from "./NutritionModal";

export function NutritionForm() {
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  
  return (
    <main className="flex-1 p-6">
      
      <p className="text-gray-700">Gerencie sua nutrição com facilidade.</p>
      
      <form className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-bold mb-4">Criar Dieta</h2>
        <input type="text" placeholder="Nome" className="w-full p-2 border rounded mb-2" />
        <input type="text" placeholder="Peso (kg)" className="w-full p-2 border rounded mb-2" />
        <input type="text" placeholder="Altura (cm)" className="w-full p-2 border rounded mb-2" />
        <input type="text" placeholder="Idade" className="w-full p-2 border rounded mb-2" />
        <select className="w-full p-2 border rounded mb-2">
          <option>Masculino</option>
          <option>Feminino</option>
        </select>
        <select className="w-full p-2 border rounded mb-2">
          <option>Emagrecimento</option>
          <option>Hipertrofia</option>
          <option>Hipertrofia e Definição</option>
          <option>Definição</option>
        </select>
        <select className="w-full p-2 border rounded mb-2">
          <option>Sedentário (pouco ou nenhuma atividade física)</option>
          <option>Levemente ativo (exercícios 1 a 3 vezes na semana)</option>
          <option>Moderadamente ativo (exercícios 3 a 5 vezes na semana)</option>
          <option>Altamente ativo (exercícios 5 a 7 vezes por semana)</option>
        </select>
        <button
          className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
          onClick={(event) => {
            event.preventDefault();
            setIsNutritionModalOpen(true);
          }}
        >
          Gerar Dieta
        </button>
      </form>

      <NutritionModal
        isOpen={isNutritionModalOpen}
        onRequestClose={() => setIsNutritionModalOpen(false)}
      />
    </main>
  )
}