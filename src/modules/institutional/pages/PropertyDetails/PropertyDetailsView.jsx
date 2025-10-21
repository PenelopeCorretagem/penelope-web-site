import { PropertyHeroSectionView } from '@institutional/components/PropertyHeroSection/PropertyHeroSectionView.jsx'
import { PropertyTabsView } from '@institutional/components/PropertyTabs/PropertyTabsView.jsx'
import { PropertyOverview } from '@institutional/components/PropertyOverview/PropertyOverview.jsx'
import { SectionView } from '@shared/components/layout/Section/SectionView.jsx'
import { PropertyFeatures } from '@institutional/components/PropertyFeatures/PropertyFeatures.jsx'
import { Car, Dumbbell, Dog } from "lucide-react"
import { PropertyLocation } from '@institutional/components/PropertyLocation/PropertyLocation.jsx'
import { PropertyRegion } from '@institutional/components/PropertyRegion/PropertyRegion.jsx'
import { ESectionBackgroundColor } from '@shared/components/layout/Section/ESectionBackgroundColor.js'
import { PropertiesCarouselView } from '@shared/components/ui/PropertiesCarousel/PropertiesCarouselView.jsx'
import { PropertyDetailsCardView } from '@institutional/components/PropertyDetails Card/PropertyDetailsCardView.jsx'
import { EPropertyCardCategory } from '@shared/components/ui/PropertyCard/EPropertyCardCategory.js'
import { EFeatureIcon } from '@institutional/components/PropertyFeatures/EFeatureIcon.js'

import { fakeRequest2, titles, addresses } from './PropertyDetailsModel'
import { usePropertyDetailsViewModel } from './usePropertyDetailsViewModel'

export function PropertyDetailsView() {
  const {
    sectionRef,
    wrapperRef,
    cardRef,
    cardStyle,
  } = usePropertyDetailsViewModel()

  return (
    <div className="relative h-fit">
      <PropertyHeroSectionView
        title={fakeRequest2[0].title}
        location={fakeRequest2[0].subtitle}
        description={fakeRequest2[0].description}
        image={fakeRequest2[0].imageLink}
        category={fakeRequest2[0].category}
      />
      <PropertyTabsView
        tabs={["Sobre o Imóvel", "Diferenciais", "Localização", "Sobre a Região"]}
        anchors={["sobre-imovel", "diferenciais", "localizacao", "sobre-regiao"]}
      />

      <SectionView id="sobre-imovel" ref={sectionRef} className="relative py-12">
        <div className="container mx-auto">
          <div className="lg:grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            <div className="flex-1 lg:px-0">
              <PropertyOverview overview={fakeRequest2[0].overview} />
            </div>
            <div ref={wrapperRef} className="hidden lg:block relative">
              <div ref={cardRef} style={cardStyle}>
                <PropertyDetailsCardView
                  hasLabel={true}
                  category={EPropertyCardCategory.EM_OBRAS}
                  title={fakeRequest2[0].title}
                  subtitle={fakeRequest2[0].subtitle}
                  description={fakeRequest2[0].description}
                  hasButton={true}
                  hasShadow={true}
                  hasImage={false}
                  hasHoverEffect={false}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionView>

      <SectionView id="diferenciais" backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
        <PropertyFeatures features={[
          { icon: "SPA", label: "Spa Relaxante" },
          { icon: "CINEMA", label: "Cinema 3D" },
          { icon: "HALTER", label: "Academia" },
          { icon: "PET", label: "Espaço Pet" },
          { icon: "POMAR", label: "Pomar" },
          { icon: "LOUNGE", label: "Lounge Panorâmico" },
          { icon: "CESTA_MERCADO", label: "Cesta Mercado" },
          { icon: "BEACH_TENIS", label: "Beach Tennis" },
          { icon: "FORNO_PIZZA", label: "Forno de Pizza" },
        ]} />
      </SectionView>

      <SectionView id="localizacao" backgroundColor={ESectionBackgroundColor.PINK_GRADIENT}>
        <PropertyLocation locations={fakeRequest2} addresses={addresses} titles={titles} />
      </SectionView>

      <SectionView id="sobre-regiao" backgroundColor={ESectionBackgroundColor.WHITE_TERTIARY}>
        <PropertyRegion regionDescription={fakeRequest2[0].regionDescription} image={fakeRequest2[0].imageLink} />
      </SectionView>
      <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
        <PropertiesCarouselView properties={fakeRequest2} />
      </SectionView>
    </div>
  )
}
