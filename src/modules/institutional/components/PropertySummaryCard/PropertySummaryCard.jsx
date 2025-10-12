import React from "react";

export function PropertySummaryCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <span className="text-xs uppercase text-pink-600 font-semibold">Lançamento</span>
      <h3 className="text-lg font-bold mt-2">Next Guarulhos</h3>
      <p className="text-pink-700 font-semibold uppercase">Interlagos</p>
      <p className="text-gray-600 mt-1">2 dormitórios, com opção de terraço</p>
      <div className="flex flex-col gap-2 mt-6">
        <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
          Conversar pelo WhatsApp
        </button>
        <button className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700">
          Agendar visita
        </button>
      </div>
    </div>
  );
};
