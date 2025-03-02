import Modal from "react-modal";
import { useEffect } from "react";
import { IoIosClose } from "react-icons/io";

interface NutritionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function NutritionModal({ isOpen, onRequestClose }: NutritionModalProps) {
  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

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

      <h2 className="text-2xl font-bold">Sua Dieta Gerada</h2>
      <p>Aqui ficará a sua recomendação nutricional.</p>

    </Modal>
  )
}