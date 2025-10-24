import React from "react";
import { Store, Building } from "lucide-react";
import { HeadingView } from "@shared/components/ui/Heading/HeadingView.jsx";
import { TextView } from "@shared/components/ui/Text/TextView.jsx";

export function PropertyLocation({ locations, addresses = [], titles = [] }) {
  return (
    <>
      <HeadingView level={3} className="text-brand-white mb-10">
        Localização
      </HeadingView>
      <div className={`grid gap-8 ${locations.length === 1 ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {locations.map((loc, index) => (
          <div key={loc.type || index} className="flex flex-col h-full">
            <div className="flex items-start gap-3">
              <div className="bg-brand-white rounded-lg p-4">
                {index === 0 ?
                  <Store size={34} className="text-brand-pink" /> :
                  <Building size={34} className="text-brand-pink" />
                }
              </div>
              <div>
                {titles[index] && (
                  <HeadingView level={4} className="text-brand-white mb-0">
                    {titles[index]}
                  </HeadingView>
                )}
                {addresses[index] && (
                  <TextView className="text-brand-white font-medium text-lg mt-3">
                    {addresses[index]}
                  </TextView>
                )}
              </div>
            </div>
            <div className="flex-grow mt-8"></div>
            <TextView className="text-brand-white text-base font-semibold mb-4">
              Veja como chegar
            </TextView>
            <div className="bg-brand-pink p-6 rounded-lg min-h-[440px] flex flex-col items-center justify-center">
              <HeadingView level={5} className="font-semibold uppercase text-sm">
                {loc.type}
              </HeadingView>
              <TextView className="mt-1 text-brand-white">
                {loc.address}
              </TextView>
              <button className="mt-4 bg-white text-brand-pink px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
                Exibir Mapa
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
