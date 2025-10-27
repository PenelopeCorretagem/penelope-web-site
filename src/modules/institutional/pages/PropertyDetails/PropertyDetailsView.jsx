import { PropertyHeroSectionView } from '@institutional/components/PropertyHeroSection/PropertyHeroSectionView.jsx'
import { PropertyTabsView } from '@institutional/components/PropertyTabs/PropertyTabsView.jsx'
import { PropertyOverview } from '@institutional/components/PropertyOverview/PropertyOverview.jsx'
import { SectionView } from '@shared/components/layout/Section/SectionView.jsx'
import { PropertyFeatures } from '@institutional/components/PropertyFeatures/PropertyFeatures.jsx'
import { PropertyLocation } from '@institutional/components/PropertyLocation/PropertyLocation.jsx'
import { PropertyRegion } from '@institutional/components/PropertyRegion/PropertyRegion.jsx'
import { PropertiesCarouselView } from '@domains/property/PropertiesCarousel/PropertiesCarouselView.jsx'
import { PropertyDetailsCardView } from '@institutional/components/PropertyDetails Card/PropertyDetailsCardView.jsx'
import { EPropertyCardCategory } from '@domains/property/PropertyCard/EPropertyCardCategory.js'

import { fakeRequest2, titles, addresses, propertyFeatures } from './PropertyDetailsModel'
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
        tabs={['Sobre o Imóvel', 'Diferenciais', 'Localização', 'Sobre a Região']}
        anchors={['sobre-imovel', 'diferenciais', 'localizacao', 'sobre-regiao']}
      />

      <section id="sobre-imovel" ref={sectionRef} className="relative py-12">
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
      </section>

      <SectionView id="diferenciais" backgroundColor="white-secondary">
        <PropertyFeatures features={propertyFeatures} />
      </SectionView>

      <SectionView id="localizacao" backgroundColor="pinkGradient">
        <PropertyLocation locations={fakeRequest2} addresses={addresses} titles={titles} />
      </SectionView>

      <SectionView id="sobre-regiao" backgroundColor="white-secondary">
        <PropertyRegion regionDescription={fakeRequest2[0].regionDescription} image={fakeRequest2[0].imageLink} />
      </SectionView>

      <SectionView backgroundColor="white-secondary">
        <PropertiesCarouselView titleCarousel="Imóveis Relacionados" properties={fakeRequest2} />
      </SectionView>
    </div>
  )
}
