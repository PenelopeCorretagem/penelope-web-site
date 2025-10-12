import React from "react";

export function PropertyOverview({ overview }) {
  return (
    <section className="mx-auto">
      <div className="pr-8 py-8">
        <h2 className="text-xl font-medium mb-4 text-brand-pink uppercase">Sobre o Imóvel</h2>
        <p className="text-gray-700 leading-relaxed">{overview}</p>
      </div>
    </section>
  );
};
