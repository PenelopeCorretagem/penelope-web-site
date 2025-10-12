import React from "react";
import { Store, Building } from "lucide-react";

export function PropertyLocation({ locations, addresses = [], titles = [] }) {
  return (
    <section className="bg-gradient-to-b from-brand-pink to-brand-brown py-12 text-white">
      <div className="mx-auto px-24 grid md:grid-cols-2 gap-8">
        {locations.map((loc, index) => (
          <div key={loc.type || index} className="flex flex-col h-full">
            {/* Título e endereço juntos */}
            <div className="flex items-start gap-3">
              <div className="bg-brand-white rounded-lg p-4">
                {index === 0 ?
                  <Store size={34} className="text-brand-pink" /> :
                  <Building size={34} className="text-brand-pink" />
                }
              </div>
              <div>
                {titles[index] && (
                  <h3 className="text-brand-white font-bold text-xl mb-0">{titles[index]}</h3>
                )}
                {addresses[index] && (
                  <p className="text-brand-white font-medium text-lg mt-3">{addresses[index]}</p>
                )}
              </div>
            </div>
            <div className="flex-grow mt-8"></div>
            <p className="text-brand-white text-base font-semibold mb-4">Veja como chegar</p>
            <div className="bg-brand-pink p-6 rounded-lg min-h-[440px] flex flex-col items-center justify-center">
              <h3 className="font-semibold uppercase text-sm">{loc.type}</h3>
              <p className="mt-1 text-brand-white">{loc.address}</p>
              <button className="mt-4 bg-white text-pink-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
                Exibir Mapa
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
