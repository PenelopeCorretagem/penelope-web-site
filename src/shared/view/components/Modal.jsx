import React from 'react';
import { X } from 'lucide-react'; // 1. Importe o ícone 'X'

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (

    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '820px', height: '384px' }}
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>

        {children}
      </div>
    </div>
  );
}
