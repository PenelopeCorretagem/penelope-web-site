import { useState, useEffect } from 'react'
import { PropertyHeroSectionView } from '@institutional/components/PropertyHeroSection/PropertyHeroSectionView.jsx'
import { PropertyTabsView } from '@institutional/components/PropertyTabs/PropertyTabsView.jsx'
import { PropertyOverview } from '@institutional/components/PropertyOverview/PropertyOverview.jsx'
import { SectionView } from '@shared/components/layout/Section/SectionView.jsx'
import { PropertyFeatures } from '@institutional/components/PropertyFeatures/PropertyFeatures.jsx'
import { PropertyLocation } from '@institutional/components/PropertyLocation/PropertyLocation.jsx'
import { PropertyRegion } from '@institutional/components/PropertyRegion/PropertyRegion.jsx'
import { PropertiesCarouselView } from '@domains/property/PropertiesCarousel/PropertiesCarouselView.jsx'
import { PropertyCardView } from '@domains/property/PropertyCard/PropertyCardView.jsx'
 
import { usePropertyDetailsViewModel } from './usePropertyDetailsViewModel'
import { useNavigate } from 'react-router-dom'
import { generateSlug } from '@shared/utils/generateSlugUtil'

export function PropertyDetailsView() {
  const { property, isLoading } = usePropertyDetailsViewModel()
  const navigate = useNavigate()
  const [headerHeight, setHeaderHeight] = useState(80) // valor padrão
  const [tabsHeight, setTabsHeight] = useState(60) // valor padrão para PropertyTabsView
  const [sectionPadding, setSectionPadding] = useState(20) // valor padrão

  useEffect(() => {
    const calculateHeights = () => {
      // Calcular altura do header
      const header = document.querySelector('header[role="banner"]')
      if (header) {
        setHeaderHeight(header.offsetHeight - 1)
      }

      // Calcular altura das tabs
      const tabs = document.querySelector('[data-tabs-component]')
      if (tabs) {
        setTabsHeight(tabs.offsetHeight - 1)
      }

      // Obter valor da CSS variable para padding
      const rootStyles = getComputedStyle(document.documentElement)
      const paddingValue = rootStyles.getPropertyValue('--padding-section-y').trim()
      if (paddingValue) {
        // Converter rem/px para pixels
        const numericValue = parseFloat(paddingValue)
        if (paddingValue.includes('rem')) {
          const rootFontSize = parseFloat(rootStyles.fontSize) || 16
          setSectionPadding(numericValue * rootFontSize)
        } else {
          setSectionPadding(numericValue)
        }
      }
    }

    // Calcular alturas iniciais
    calculateHeights()

    // Recalcular quando a janela for redimensionada
    window.addEventListener('resize', calculateHeights)

    // Observer para detectar mudanças no DOM
    const observer = new MutationObserver(calculateHeights)
    observer.observe(document.body, { childList: true, subtree: true })

    // Aguardar renderização completa
    const timer = setTimeout(calculateHeights, 200)

    return () => {
      window.removeEventListener('resize', calculateHeights)
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  const handlePropertyCardClick = ({ action, category, title, subtitle, buttonState }) => {
    console.log('Property card action:', { action, category, title, subtitle, buttonState })
    // useNavigate is captured from the component scope

    switch (action) {
      case 'whatsapp':
        console.log('Iniciando contato via WhatsApp para:', title)
        break
      case 'visit':
        console.log('Agendando visita para:', title)
        // Navega para a tela de agenda do imóvel usando slug do título
        try {
          const slug = generateSlug(title || property?.title || '')
          // navegação padrão usando react-router
          if (typeof navigate === 'function') {
            navigate(`/agenda?property=${slug}`, { state: { propertyTitle: title || property?.title, propertyId: property?.id } })
          } else {
            // fallback para caso navigate não esteja definido (raro)
            window.location.href = `/agenda?property=${slug}`
          }
        } catch (err) {
          console.error('Erro ao gerar slug/navegar para agenda:', err)
        }
        break
      default:
        console.log('Ação padrão para:', title)
    }
  }

  if (isLoading || !property) {
    return (
      <div className="p-section-y md:p-section-y-md">
        <h3 className="text-center">{isLoading ? 'Carregando propriedade...' : 'Imóvel não encontrado'}</h3>
      </div>
    )
  }

  return (
    <div className="relative h-fit">
      {/* Hero */}
      <PropertyHeroSectionView
        title={property.title}
        location={property.subtitle}
        description={property.description}
        image={property.imageLink}
        category={property.category}
      />

      {/* Tabs - Sticky */}
      <div
        className="sticky z-40 bg-white shadow-sm"
        style={{ top: `${headerHeight}px` }}
        data-tabs-component
      >
        <PropertyTabsView
          tabs={['Sobre o Imóvel', 'Diferenciais', 'Localização', 'Sobre a Região']}
          anchors={['sobre-imovel', 'diferenciais', 'localizacao', 'sobre-regiao']}
        />
      </div>

      {/* === WRAPPER LIMITADOR === */}
      <div id="property-content-wrapper" className="relative z-10">
        {/* Bloco principal das seções */}
        <div className="relative">
          <SectionView id="sobre-imovel" className="bg-default-light relative !pr-[544px]">
            <PropertyOverview overview={property.overview} />
          </SectionView>

          <SectionView id="diferenciais" className="bg-default-light-alt !pr-[544px]">
            <PropertyFeatures features={property.amenitiesFeatures || []} />
          </SectionView>

          <SectionView id="localizacao" className="bg-distac-gradient !pr-[544px]">
            <PropertyLocation
              locations={[
                { title: property.title, subtitle: property.subtitle },
                { title: property.title, subtitle: property.subtitle }
              ]}
              addresses={property.locationAddresses || []}
              titles={property.locationTitles || []}
            />
          </SectionView>

          <SectionView id="sobre-regiao" className="bg-default-light-alt !pr-[544px]">
            <PropertyRegion
              regionDescription={(() => {
                const list = property.regionList ? `Regiões de SP: ${property.regionList.join(', ')}` : ''
                const selected = property.regionDescription || ''
                return `${list}\n\n${selected}`
              })()}
              image={property.imageLink}
            />
          </SectionView>
        </div>

        {/* Overlay do Card - limitado pelo wrapper */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <div
            className="sticky right-0 z-50 w-fit mr-[var(--padding-section-x)] md:mr-[var(--padding-section-x-md)] ml-auto pointer-events-auto"
            style={{
              top: `${headerHeight + tabsHeight + sectionPadding}px`,
              marginTop: `${sectionPadding}px`
            }}
          >
            <PropertyCardView
              category={property.category}
              title={property.title}
              subtitle={property.subtitle}
              description={property.description}
              buttonState="contato"
              hasLabel
              hasButton
              hasShadow
              hasHoverEffect={false}
              onButtonClick={handlePropertyCardClick}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Card Mobile */}
      <div className="lg:hidden">
        <SectionView className="bg-default-light">
          <PropertyCardView
            category={property.category}
            title={property.title}
            subtitle={property.subtitle}
            description={property.description}
            buttonState="contato"
            hasLabel
            hasButton
            hasShadow
            hasHoverEffect={false}
            onButtonClick={handlePropertyCardClick}
            className="w-full"
          />
        </SectionView>
      </div>

      {/* Carrossel */}
      <SectionView className="">
        <PropertiesCarouselView
          titleCarousel="Imóveis Relacionados"
          properties={property.relatedProperties || []}
        />
      </SectionView>
    </div>
  )
}
