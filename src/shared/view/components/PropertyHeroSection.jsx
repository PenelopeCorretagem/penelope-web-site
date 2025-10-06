import { ButtonView } from '@shared/view/components/ButtonView'
import { PropertyCardView } from '@shared/view/components/PropertyDetailsCard'
import { ECategoryCard } from '@shared/Enum/components/ECategoryCard'
import React from "react";

export function PropertyHeroSection({ title, location, description, image }) {
  return (
    <section className="w-full bg-brand-pink">
      <div className="mx-auto flex flex-col md:flex-row items-stretch min-h-[440px]">
        {/* Card de Informações */}
        <div className="flex items-center justify-center md:w-7/20 w-full p-6">
          <PropertyCardView
            hasLabel={true}
            category={ECategoryCard.LANCAMENTO}
            title={title}
            subtitle={location}
            description={description}
            hasDifference={true}
            differences={['2 vagas', '1 suíte', '48m²']}
            hasButton={true}
            hasShadow={true}
            hasImage={false}
            hasHoverEffect={false}
          />
        </div>

        {/* Imagem */}
        <div className="flex items-center justify-center md:w-13/20 w-full">
          <img src={image} alt={title} className=" shadow-lg w-full h-full object-cover max-h-[440px]" />
        </div>
      </div>
    </section>

  );
};
