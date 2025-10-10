import { ButtonView } from '@shared/view/components/ButtonView'
import { PropertyCardView } from '@shared/view/components/PropertyDetailsCard'
import { ECategoryCard } from '@shared/Enum/components/ECategoryCard'
import React from "react";

export function PropertyHeroSection({ title, location, description, image, propertyType = ECategoryCard.EM_OBRAS }) {
  const getBackgroundColor = (category) => {
    switch (category) {
      case ECategoryCard.LANCAMENTO:
        return 'bg-brand-pink';
      case ECategoryCard.EM_OBRAS:
        return 'bg-brand-soft-brown';
      case ECategoryCard.DISPONIVEL:
        return 'bg-brand-brown';
      default:
        return 'bg-brand-pink';
    }
  };

  return (
    <section className={`w-full ${getBackgroundColor(propertyType)}`}>
      <div className="mx-auto flex flex-col md:flex-row items-stretch min-h-[440px]">
        {/* Card de Informações */}
        <div className="flex items-center justify-center md:w-7/20 w-full p-6">
          <PropertyCardView
            hasLabel={true}
            category={propertyType}
            title={title}
            subtitle={location}
            description={description}
            hasDifference={true}
            differences={['2 vagas', '1 suíte', '48m²']}
            hasButton={true}
            hasShadow={true}
            hasImage={false}
            hasHoverEffect={false}
            propertyType={propertyType}
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
