import React from "react";

export function PropertyLocation({ locations }) {
  return (
    <section className="bg-gradient-to-b from-pink-600 to-pink-800 py-12 text-white">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {locations.map((loc) => (
          <div key={loc.type} className="bg-pink-700/30 p-6 rounded-lg">
            <h3 className="font-semibold uppercase text-sm">{loc.type}</h3>
            <p className="mt-1 text-white">{loc.address}</p>
            <button className="mt-4 bg-white text-pink-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
              Exibir Mapa
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
