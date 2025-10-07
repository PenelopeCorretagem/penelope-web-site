import React from "react";

export function PropertyRegion({ regionDescription, image }) {
  return (
    <section className="mx-auto grid md:grid-cols-2 items-center gap-16 py-12 px-24 bg-brand-white">
      <div>
        <h2 className="text-xl font-medium mb-8 text-brand-pink uppercase">Sobre a Região</h2>
        <p className="text-brand-gray leading-relaxed">{regionDescription}</p>
      </div>
      <img src={image} alt="Região" className="rounded shadow-lg" />
    </section>
  );
};
