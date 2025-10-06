import React from "react";
import { Car, Dumbbell, Dog } from "lucide-react"; // Exemplo de ícones

export function PropertyFeatures({ features }) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-pink-700 uppercase">Diferenciais</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 bg-brand-gray border rounded-lg px-4 py-3 text-brand-white font-medium shadow-sm"
            >
              {f.icon && <f.icon className="w-5 h-5 text-brand-white" />}
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
