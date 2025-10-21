import React from "react";
import { HeadingView } from "@shared/components/ui/Heading/HeadingView.jsx";
import { TextView } from "@shared/components/ui/Text/TextView.jsx";
import { EColors } from "@shared/Enum/EColors.js";

export function PropertyRegion({ regionDescription, image }) {
  return (
    <div className="grid md:grid-cols-2 items-center gap-16">
      <div>
        <HeadingView level={3} className="mb-10 uppercase text-brand-pink">
          Sobre a Região
        </HeadingView>
        <TextView className="text-brand-gray leading-relaxed">
          {regionDescription}
        </TextView>
      </div>
      <img src={image} alt="Região" className="rounded shadow-lg" />
    </div>
  );
}
