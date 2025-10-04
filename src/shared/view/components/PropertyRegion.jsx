import React from "react";

export function PropertyRegion({ description, image }) {
  return (
    <section className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-8 py-12">
      <div>
        <h2 className="text-xl font-bold mb-4 text-pink-700 uppercase">Sobre a Região</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
      <img src={image} alt="Região" className="rounded-lg shadow-lg" />
    </section>
  );
};
