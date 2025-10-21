import React from "react";
import { PropertyCardView } from '@shared/components/ui/PropertyCard/PropertyCardView.jsx'
import { PropertyHeroSectionModel } from './PropertyHeroSectionModel';
import { usePropertyHeroSectionViewModel } from './usePropertyHeroSectionViewModel';

export function PropertyHeroSectionView(props) {
  const model = new PropertyHeroSectionModel(props);
  const { bgClass, title, location, description, image, category } = usePropertyHeroSectionViewModel(model);

  return (
    <section className={`w-full ${bgClass}`}>
      <div className="mx-auto flex flex-col md:flex-row items-stretch min-h-[440px]">
        {/* Card de Informações */}
        <div className="flex items-center justify-center md:w-7/20 w-full p-6">
          <PropertyCardView
            hasLabel={true}
            category={category}
            title={title}
            subtitle={location}
            description={description}
            hasDifference={false}
            hasButton={true}
            hasShadow={true}
            hasImage={false}
            hasHoverEffect={false}
          />
        </div>

        {/* Imagem */}
        <div className="flex items-center justify-center md:w-13/20 w-full">
          <img src={image} alt={title} className="shadow-lg w-full h-full object-cover max-h-[440px]" />
        </div>
      </div>
    </section>
  );
}
