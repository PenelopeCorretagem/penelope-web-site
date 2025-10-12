import { useState, useRef, useEffect } from 'react'
import { PropertyHeroSection } from '@institutional/components/PropertyHeroSection/PropertyHeroSection.jsx'
import { PropertyTabs } from '@institutional/components/PropertyTabs/PropertyTabs.jsx'
import { PropertyOverview } from '@institutional/components/PropertyOverview/PropertyOverview.jsx'
import { SectionView } from '@shared/components/layout/Section/SectionView.jsx'
import { PropertyFeatures } from '@institutional/components/PropertyFeatures/PropertyFeatures.jsx'
import { Car, Dumbbell, Dog } from "lucide-react"
import { PropertyLocation } from '@institutional/components/PropertyLocation/PropertyLocation.jsx'
import { PropertyRegion } from '@institutional/components/PropertyRegion/PropertyRegion.jsx'
import { ESectionBackgroundColor } from '@shared/components/layout/Section/ESectionBackgroundColor.js'
import { PropertiesCarouselView } from '@shared/components/ui/PropertiesCarousel/PropertiesCarouselView.jsx'
import { PropertyDetailsCard } from '@institutional/components/PropertyDetails Card/PropertyDetailsCard.jsx'
import { EPropertyCardCategory } from '@shared/components/ui/PropertyCard/EPropertyCardCategory.js'

export function PropertyDetailsView() {
  const fakeRequest2 = [
    {
      title: 'Guarulhos',
      subtitle: 'Interlagos',
      description: '2 dormitórios com opção de terraço',
      overview: 'Apartamento de 2 dormitórios com opção de terraço privativo, localizado em um dos bairros mais valorizados de Guarulhos. O imóvel conta com acabamentos de primeira qualidade, incluindo piso porcelanato, bancadas em granito e armários planejados na cozinha. A sala de estar integrada oferece amplo espaço para convivência familiar, com acesso direto ao terraço que proporciona vista panorâmica da região. O dormitório principal possui suíte completa com box de vidro temperado e ventilação natural. Conta ainda com área de serviço independente, 2 vagas de garagem cobertas e depósito privativo. O condomínio oferece infraestrutura completa com piscina adulto e infantil, academia equipada, salão de festas, playground, quadra poliesportiva e sistema de segurança 24h.',
      regionDescription: 'A região de Interlagos em Guarulhos é conhecida por sua atmosfera tranquila e familiar, oferecendo excelente qualidade de vida. Localizada próxima ao Aeroporto Internacional de Guarulhos, a região conta com fácil acesso às principais rodovias como Dutra e Fernão Dias. O bairro possui infraestrutura completa com supermercados, farmácias, escolas particulares e públicas de qualidade, centros médicos e diversas opções de comércio local. A proximidade com o centro de Guarulhos e São Paulo torna a localização estratégica para quem busca praticidade no dia a dia. A região ainda conta com áreas verdes preservadas, proporcionando um ambiente mais saudável e agradável para toda a família.',
      category: EPropertyCardCategory.EM_OBRAS,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
    {
      title: 'São Paulo',
      subtitle: 'Vila Mariana',
      description: '3 dormitórios com varanda gourmet',
      overview: 'Moderno apartamento de 3 dormitórios com varanda gourmet integrada à sala, perfeito para quem aprecia momentos de convivência e entretenimento. O imóvel possui projeto arquitetônico contemporâneo com ambientes amplos e bem iluminados, proporcionando conforto e sofisticação. A cozinha americana conta com ilha central, cooktop, forno elétrico embutido e exaustor de inox. Todos os dormitórios possuem armários embutidos e o principal conta com closet e banheiro privativo com hidromassagem. A varanda gourmet é equipada com churrasqueira, pia e bancada, ideal para receber amigos e família. O apartamento ainda dispõe de 2 vagas de garagem, lavabo social e área de serviço com tanque e armários. O condomínio oferece portaria 24h, piscina aquecida, sauna, sala de jogos, brinquedoteca e espaço pet.',
      regionDescription: 'Vila Mariana é um dos bairros mais tradicionais e valorizados de São Paulo, conhecido por sua excelente localização e infraestrutura urbana completa. O bairro oferece fácil acesso ao metrô, com estações próximas que conectam rapidamente ao centro da cidade e outras regiões importantes. A região conta com uma das melhores redes de saúde da capital, incluindo hospitais renomados como Hospital do Rim e Beneficência Portuguesa. Para educação, há diversas escolas particulares conceituadas e a proximidade com universidades importantes. O comércio local é diversificado, com shopping centers, restaurantes, cafés, livrarias e todo tipo de serviço. A Vila Mariana também se destaca pelas áreas de lazer, como o Parque Ibirapuera nas proximidades, proporcionando qualidade de vida excepcional para seus moradores.',
      category: EPropertyCardCategory.EM_OBRAS,
      differences: ['2 vagas', '1 suíte', '48m²'],
      imageLink: 'https://admin.mac.com.br/wp-content/uploads/2025/01/Blog-fachada-de-predio-imagem-padrao.webp',
    },
  ]

  const titles = ['Stand de Vendas', 'Empreendimento']
  const addresses = ['Rua das Flores, 123 - Interlagos, Guarulhos - SP', 'Av. Domingos de Morais, 456 - Vila Mariana, São Paulo - SP']

  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const cardRef = useRef(null)
  const [cardStyle, setCardStyle] = useState({ position: 'relative', width: '100%', zIndex: 50 })


useEffect(() => {
  const handleScroll = () => {
    const section = sectionRef.current
    const wrapper = wrapperRef.current
    const card = cardRef.current
    if (!section || !wrapper || !card) return

    const sectionRect = section.getBoundingClientRect()
    const wrapperRect = wrapper.getBoundingClientRect()
    if (sectionRect.top <= 100) {
      setCardStyle({
        position: 'fixed',
        top: 100,
        left: wrapperRect.left,
        width: wrapperRect.width,
        zIndex: 1000, // acima de tudo, sem animação
      })
    } else {
      setCardStyle({
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
      })
    }
  }

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleScroll)
  handleScroll()
  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleScroll)
  }
}, [])



  return (
    <div className="relative h-fit">
      <PropertyHeroSection
        title={fakeRequest2[0].title}
        location={fakeRequest2[0].subtitle}
        description={fakeRequest2[0].description}
        image={fakeRequest2[0].imageLink}
        category={fakeRequest2[0].category} // ou EM_OBRAS ou DISPONIVEL
      />
      <PropertyTabs
        tabs={["Sobre o Imóvel", "Diferenciais", "Localização", "Sobre a Região"]}
        anchors={["sobre-imovel", "diferenciais", "localizacao", "sobre-regiao"]}
      />

      <section id="sobre-imovel" ref={sectionRef} className="relative py-12">
        <div className="container mx-auto">
          <div className="lg:grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <div className="flex-1 lg:px-0">
            <PropertyOverview overview={fakeRequest2[0].overview} />
          </div>


            <div ref={wrapperRef} className="hidden lg:block relative">
              <div ref={cardRef} style={cardStyle}>
                <PropertyDetailsCard
                  hasLabel={true}
                  category={EPropertyCardCategory.EM_OBRAS}
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
        </div>
      </section>

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

      <section id="localizacao">
        <PropertyLocation locations={fakeRequest2} addresses={addresses} titles={titles} />
      </section>

      <section id="sobre-regiao">
        <PropertyRegion regionDescription={fakeRequest2[0].regionDescription} image={fakeRequest2[0].imageLink} />
        <SectionView backgroundColor={ESectionBackgroundColor.WHITE_SECONDARY}>
          <PropertiesCarouselView properties={fakeRequest2} />
        </SectionView>
      </section>
    </div>
  )
}
