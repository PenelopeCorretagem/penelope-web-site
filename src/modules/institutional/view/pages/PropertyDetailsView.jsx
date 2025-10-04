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
import { CardView } from '@shared/view/components/CardView'
import { ECategoryCard } from '@shared/Enum/components/ECategoryCard'




export function PropertyDetailsView() {

  const fakeRequest2 = [
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      category: ECategoryCard.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      category: ECategoryCard.EM_OBRAS,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'Rio de Janeiro',
      subtitle: 'Copacabana',
      description: '1 dormitório com vista para o mar',
      category: ECategoryCard.DISPONIVEL,
      differences: ['1 vaga', '1 suíte', '38m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
  ]
  return (
    <>
      <PropertyHeroSection
        title={fakeRequest2[0].title}
        location={fakeRequest2[0].subtitle}
        description={fakeRequest2[0].description}
        image={fakeRequest2[0].imageLink}
      />
      <PropertyTabs
        tabs={["Sobre o Imóvel", "Diferenciais", "Localização", "Sobre a Região"]}
      />
      < PropertyOverview description={fakeRequest2[0].description} />
      < PropertyFeatures features={[
        { icon: Car, label: '2 Vagas' },
        { icon: Dumbbell, label: 'Academia' },
        { icon: Dog, label: 'Pet Friendly' },
      ]} />
      < PropertyLocation locations={fakeRequest2} />
      < PropertyRegion description={fakeRequest2[0].description} image={fakeRequest2[0].imageLink} />

            <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
        <div className='w-full overflow-x-auto'>
          <div className='flex flex-row items-center gap-4 md:gap-6 pb-4'>
            {fakeRequest2.map((property, index) => (
              <CardView
                key={index}
                hasLabel={true}
                category={property.category}
                title={property.title}
                subtitle={property.subtitle}
                description={property.description}
                hasDifference={true}
                differences={property.differences}
                hasButton={true}
                hasShadow={true}
                hasImage={true}
                imageUrl={property.imageLink}
              />
            ))}
          </div>
        </div>
      </SectionView>
    </>

  )
}
