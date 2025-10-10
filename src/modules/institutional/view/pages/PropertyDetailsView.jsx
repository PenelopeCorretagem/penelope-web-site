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
      overview: 'Apartamento de 2 dormitórios com opção de terraço privativo, localizado em um dos bairros mais valorizados de Guarulhos. O imóvel conta com acabamentos de primeira qualidade, incluindo piso porcelanato, bancadas em granito e armários planejados na cozinha. A sala de estar integrada oferece amplo espaço para convivência familiar, com acesso direto ao terraço que proporciona vista panorâmica da região. O dormitório principal possui suíte completa com box de vidro temperado e ventilação natural. Conta ainda com área de serviço independente, 2 vagas de garagem cobertas e depósito privativo. O condomínio oferece infraestrutura completa com piscina adulto e infantil, academia equipada, salão de festas, playground, quadra poliesportiva e sistema de segurança 24h.',
      regionDescription: 'A região de Interlagos em Guarulhos é conhecida por sua atmosfera tranquila e familiar, oferecendo excelente qualidade de vida. Localizada próxima ao Aeroporto Internacional de Guarulhos, a região conta com fácil acesso às principais rodovias como Dutra e Fernão Dias. O bairro possui infraestrutura completa com supermercados, farmácias, escolas particulares e públicas de qualidade, centros médicos e diversas opções de comércio local. A proximidade com o centro de Guarulhos e São Paulo torna a localização estratégica para quem busca praticidade no dia a dia. A região ainda conta com áreas verdes preservadas, proporcionando um ambiente mais saudável e agradável para toda a família.',
      category: ECategoryCard.LANCAMENTO,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      overview: 'Moderno apartamento de 3 dormitórios com varanda gourmet integrada à sala, perfeito para quem aprecia momentos de convivência e entretenimento. O imóvel possui projeto arquitetônico contemporâneo com ambientes amplos e bem iluminados, proporcionando conforto e sofisticação. A cozinha americana conta com ilha central, cooktop, forno elétrico embutido e exaustor de inox. Todos os dormitórios possuem armários embutidos e o principal conta com closet e banheiro privativo com hidromassagem. A varanda gourmet é equipada com churrasqueira, pia e bancada, ideal para receber amigos e família. O apartamento ainda dispõe de 2 vagas de garagem, lavabo social e área de serviço com tanque e armários. O condomínio oferece portaria 24h, piscina aquecida, sauna, sala de jogos, brinquedoteca e espaço pet.',
      regionDescription: 'Vila Mariana é um dos bairros mais tradicionais e valorizados de São Paulo, conhecido por sua excelente localização e infraestrutura urbana completa. O bairro oferece fácil acesso ao metrô, com estações próximas que conectam rapidamente ao centro da cidade e outras regiões importantes. A região conta com uma das melhores redes de saúde da capital, incluindo hospitais renomados como Hospital do Rim e Beneficência Portuguesa. Para educação, há diversas escolas particulares conceituadas e a proximidade com universidades importantes. O comércio local é diversificado, com shopping centers, restaurantes, cafés, livrarias e todo tipo de serviço. A Vila Mariana também se destaca pelas áreas de lazer, como o Parque Ibirapuera nas proximidades, proporcionando qualidade de vida excepcional para seus moradores.',
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
    <div className="relative h-fit">
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
        <div>
          <PropertyOverview overview={fakeRequest2[0].overview} />

          {/* Card Sticky */}
          <div className="absolute top-140 right-6 z-10 hidden lg:block h-full">
            <div className="sticky top-24">
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
