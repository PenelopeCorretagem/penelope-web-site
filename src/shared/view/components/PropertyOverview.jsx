import React from "react";
import { PropertySummaryCard } from '@shared/view/components/PropertySummaryCard'

export function PropertyOverview({ description }) {
  return (
    <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 py-12">
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4 text-pink-700 uppercase">Sobre o Imóvel</h2>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>
      <PropertySummaryCard />
    </section>
    
  );
};
