import React from "react";
import { Car, Dumbbell, Dog } from "lucide-react"; // Exemplo de ícones

export function PropertyFeatures({ features }) {
  return (
    <section className="bg-brand-white-secondary py-12">
      <div className="mx-auto px-24">
        <h2 className="text-xl font-medium mb-6 text-brand-pink uppercase">Diferenciais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 max-w-3xl">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-start gap-2 bg-brand-gray border rounded px-3 py-3 text-brand-white font-medium shadow-sm"
            >
              {f.icon && <f.icon className="w-5 h-5 text-brand-white" />}
              <span className="truncate">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
