import React from "react";

export function PropertyOverview({ description }) {
  return (
    <section className="mx-auto py-12 px-24 bg-brand-white-tertiary">
      <div className="pr-8">
        <h2 className="text-xl font-medium mb-4 text-brand-pink uppercase">Sobre o Imóvel</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
    </section>

  );
};
