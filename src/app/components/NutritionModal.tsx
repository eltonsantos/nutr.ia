import Modal from "react-modal";
import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

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
        <IoIosClose size={32} className="cursor-pointer" />
      </button>

      <h2 className="text-2xl font-bold mb-4 text-green-600">Sua Dieta Gerada</h2>
      
      <p className="text-gray-700"><strong>Nome:</strong> {data.name}</p>
      <p className="text-gray-700"><strong>Altura:</strong> {data.height} cm</p>
      <p className="text-gray-700"><strong>Peso:</strong> {data.weight} kg</p>
      <p className="text-gray-700"><strong>Idade:</strong> {data.age} anos</p>
      <p className="text-gray-700"><strong>Sexo:</strong> {data.gender}</p>
      <p className="text-gray-700"><strong>Foco:</strong> {data.objective}</p>
      <p className="text-gray-700"><strong>Nível de atividade:</strong> {data.activityLevel}</p>

      <h3 className="text-xl font-semibold mt-4">🍽️ Refeições</h3>
      <div className="mt-2 space-y-3">
        {data.meals.map((meal, index) => (
          <div key={index} className="p-3 border rounded-lg bg-gray-100">
            <h4 className="font-semibold">{meal.name} - ⏰ {meal.time}</h4>
            <p className="text-sm text-gray-600">{meal.foods.join(", ")}</p>
          </div>
        ))}
      </div>

      {data.supplements.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mt-4">💊 Dicas de Suplementos</h3>
          <p className="text-gray-700">{data.supplements.join(", ")}</p>
        </>
      )}
    </Modal>
  )
}