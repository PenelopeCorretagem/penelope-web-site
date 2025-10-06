import React from "react";

export function PropertyOverview({ description }) {
  return (
    <section className="max-w-6xl mx-auto py-12">
      <div className="max-w-2xl pr-8">
        <h2 className="text-xl font-bold mb-4 text-pink-700 uppercase">Sobre o Imóvel</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </section>

  );
};
