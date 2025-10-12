import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { PropertyCardView } from '@shared/components/ui/PropertyCard/PropertyCardView'
import { EPropertyCardCategory } from '@shared/components/ui/PropertyCard/EPropertyCardCategory.js'
import React from "react";
import { PropertyDetailsCard } from '../PropertyDetails Card/PropertyDetailsCard';

export function PropertyHeroSection({
  title,
  location,
  description,
  image,
  category,
}) {
  const bgMap = {
    [EPropertyCardCategory.LANCAMENTO]: 'bg-brand-pink',
    [EPropertyCardCategory.EM_OBRAS]: 'bg-brand-soft-brown',
    [EPropertyCardCategory.DISPONIVEL]: 'bg-brand-brown',
  }
  const bgClass = bgMap[category] || 'bg-brand-pink'

  return (
    <section className={`w-full ${bgClass}`}>
      <div className="mx-auto flex flex-col md:flex-row items-stretch min-h-[440px]">
        {/* Card de Informações */}
        <div className="flex items-center justify-center md:w-7/20 w-full p-6">
          <PropertyDetailsCard
            hasLabel={true}
            category={category}
            title={title}
            subtitle={location}
            description={description}
            hasDifference={false}
            differences={['2 vagas', '1 suíte', '48m²']}
            hasButton={true}
            hasShadow={true}
            hasImage={false}
            hasHoverEffect={false}
            buttonState="geral"
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
