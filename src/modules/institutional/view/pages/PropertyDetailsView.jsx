import { useState, useRef, useEffect } from 'react'
import { PropertyHeroSection } from '@shared/view/components/PropertyHeroSection'
import { PropertyTabs } from '@shared/view/components/PropertyTabs'
import { PropertyOverview } from '@shared/view/components/PropertyOverview'
import { PropertySummaryCard } from '@shared/view/components/PropertySummaryCard'
import { SectionView } from '@shared/view/components/SectionView'
import { ButtonView } from '@shared/view/components/ButtonView'
import { PropertyFeatures } from '@shared/view/components/PropertyFeatures'
import { Car, Dumbbell, Dog } from "lucide-react"
import { PropertyLocation } from '@shared/view/components/PropertyLocation'
import { PropertyRegion } from '@shared/view/components/PropertyRegion'
import { ESectionBackgroundColor } from '@shared/Enum/components/ESectionBackgroundColor'
import { PropertiesCarouselView } from '@shared/view/components/PropertiesCarouselView'
import { PropertyDetailsCard } from '@shared/view/components/PropertyDetailsCard'
import { ECategoryCard } from '@shared/Enum/components/ECategoryCard'

export function PropertyDetailsView() {
  const fakeRequest2 = [
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      regionDescription: 'A região de Interlagos em Guarulhos é conhecida por sua atmosfera tranquila...',
      category: ECategoryCard.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      regionDescription: 'A região de Vila Mariana em São Paulo é conhecida...',
      category: ECategoryCard.EM_OBRAS,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
  ]

  const titles = [
    'Stand de Vendas',
    'Empreendimento'
  ]

  const addresses = [
    'Rua das Flores, 123 - Interlagos, Guarulhos - SP',
    'Av. Domingos de Morais, 456 - Vila Mariana, São Paulo - SP'
  ]

  return (
    <div className="relative">
      <PropertyHeroSection
        title={fakeRequest2[0].title}
        location={fakeRequest2[0].subtitle}
        description={fakeRequest2[0].description}
        image={fakeRequest2[0].imageLink}
      />
      <PropertyTabs
        tabs={["Sobre o Imóvel", "Diferenciais", "Localização", "Sobre a Região"]}
        anchors={["sobre-imovel", "diferenciais", "localizacao", "sobre-regiao"]}
      />

      {/* Seção: Sobre o Imóvel */}
      <section id="sobre-imovel">
        <div className="relative min-h-screen">
          <PropertyOverview description={fakeRequest2[0].description} />

          {/* Card Sticky */}
          <div className="absolute top-16 right-6 z-10 hidden lg:block h-full">
            <div className="sticky top-6">
              <PropertyDetailsCard
                hasLabel={true}
                category={ECategoryCard.LANCAMENTO}
                title={fakeRequest2[0].title}
                subtitle={fakeRequest2[0].subtitle}
                description={fakeRequest2[0].description}
                hasDifference={true}
                differences={fakeRequest2[0].differences}
                hasButton={true}
                buttonState="contato"
                hasShadow={true}
                hasImage={false}
                hasHoverEffect={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Diferenciais */}
      <section id="diferenciais">
        <PropertyFeatures features={[
          { icon: Car, label: '2 Vagas' },
          { icon: Dumbbell, label: 'Academia' },
          { icon: Dog, label: 'Pet Friendly' },
          { icon: Car, label: '2 Vagas' },
          { icon: Dumbbell, label: 'Academia' },
          { icon: Dog, label: 'Pet Friendly' },
          { icon: Car, label: '2 Vagas' },
          { icon: Dumbbell, label: 'Academia' },
          { icon: Dog, label: 'Pet Friendly' },
        ]} />
      </section>

      {/* Seção: Localização */}
      <section id="localizacao">
        <PropertyLocation
          locations={fakeRequest2}
          addresses={addresses}
          titles={titles}
        />
      </section>

      {/* Seção: Sobre a Região */}
      <section id="sobre-regiao">
        <PropertyRegion
          regionDescription={fakeRequest2[0].regionDescription}
          image={fakeRequest2[0].imageLink}
        />

        <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
          <PropertiesCarouselView properties={fakeRequest2} />
        </SectionView>
      </section>
    </div>
  )
}
