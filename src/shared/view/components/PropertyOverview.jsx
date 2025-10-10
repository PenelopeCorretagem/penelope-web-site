import React from "react";

export function PropertyOverview({ overview }) {
  return (
    <section className="mx-auto px-24">
      <div className="pr-8 py-12 max-w-2xl">
        <h2 className="text-xl font-medium mb-4 text-brand-pink uppercase">Sobre o Imóvel</h2>
        <p className="text-gray-700 leading-relaxed">{overview}</p>
      </div>
    </section>

  );
};
