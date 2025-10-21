import React from "react";
import { HeadingView } from "@shared/components/ui/Heading/HeadingView.jsx";
import { TextView } from "@shared/components/ui/Text/TextView.jsx";
import { EFeatureIcon } from "./EFeatureIcon.js";

export function PropertyFeatures({ features }) {
  return (
    <div>
      <HeadingView level={3} className="text-brand-pink mb-10">Diferenciais</HeadingView>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10 max-w-3xl">
        {features.map((f) => {
          const IconComponent = EFeatureIcon[f.icon];
          return (
            <div
              key={f.label}
              className="flex items-center justify-start gap-2 bg-brand-gray border rounded px-3 py-3 text-brand-white font-medium"
            >
              {IconComponent ? <IconComponent className="w-5 h-5 text-brand-white" /> : null}
              <TextView className="text-brand-white truncate">{f.label}</TextView>
            </div>
          );
        })}
      </div>
    </div>
  );
}
