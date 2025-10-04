import { ButtonView } from '@shared/view/components/ButtonView'
import React from "react";

export function PropertyHeroSection({ title, location, description, image }) {
  return (
    <section className="w-full bg-pink-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-stretch p-6 gap-6 min-h-[400px]">
        {/* Texto */}
        <div className="flex flex-col justify-center md:w-1/2 w-full p-6 bg-pink-200">
          <div className='flex flex-col gap-2 bg-white p-4 rounded-lg shadow-md'>
            <span className="text-sm font-semibold text-pink-600 uppercase">Lançamento</span>
            <h1 className="text-3xl font-bold mt-2">{title}</h1>
            <p className="text-pink-700 uppercase font-medium">{location}</p>
            <p className="mt-2 text-gray-700">{description}</p>
          </div>
          <div className="flex gap-3 mt-6">
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                Ver Galeria
              </button>
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                Ver Planta
              </button>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900">
              Assistir Vídeo
            </button>
          </div>
        </div>

        {/* Imagem */}
        <div className="flex items-center justify-center md:w-1/2 w-full">
          <img src={image} alt={title} className="rounded-xl shadow-lg w-full h-full object-cover max-h-[400px]" />
        </div>
      </div>
    </section>
    
  );
};
