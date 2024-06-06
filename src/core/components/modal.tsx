import { XIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  imageUrl: string;
}

const Modal: React.FC<ModalProps> = ({ showModal, setShowModal, imageUrl }) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative">
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setShowModal(false)}
        >
          <XIcon className="w-6 h-6" />
        </button>
        <Image
          width={900}
          height={800}
          src={imageUrl}
          alt="Full Screen"
          className="max-w-full max-h-full"
        />
      </div>
    </div>
  );
};

export default Modal;
