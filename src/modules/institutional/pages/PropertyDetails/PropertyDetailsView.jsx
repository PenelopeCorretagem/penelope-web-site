import { useState, useEffect, useRef, useCallback } from 'react'
import { PropertyTabsView } from '@institutional/components/PropertyTabs/PropertyTabsView.jsx'
import { SectionView } from '@shared/components/layout/Section/SectionView.jsx'
import { PropertyLocation } from '@institutional/components/PropertyLocation/PropertyLocation.jsx'
import { PropertyFeatureView } from '@shared/components/ui/PropertyFeature/PropertyFeatureView.jsx'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { ImageView } from '@shared/components/ui/Image/ImageView.jsx'
import { PropertiesCarouselView } from '@shared/components/ui/PropertiesCarousel/PropertiesCarouselView.jsx'
import { PropertyCardView } from '@shared/components/ui/PropertyCard/PropertyCardView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { useRouter } from '@app/routes/useRouterViewModel'
import { ScreeningFormView } from '@shared/components/ui/ScreeningForm/ScreeningFormView.jsx'
import { X } from 'lucide-react'

import { usePropertyDetailsViewModel } from './usePropertyDetailsViewModel'

export function PropertyDetailsView() {
  const {
    realEstateAdvertisement,
    relatedRealEstateAdvertisements,
    region,
    isLoading,
    error
  } = usePropertyDetailsViewModel()

  const { navigateTo, getAllRoutes } = useRouter()
  const routes = getAllRoutes()

  const [headerHeight, setHeaderHeight] = useState(80)
  const [tabsHeight, setTabsHeight] = useState(60)
  const [sectionPadding, setSectionPadding] = useState(20)
  const [isScreeningFormOpen, setIsScreeningFormOpen] = useState(false)

  const diferenciaisRef = useRef(null)
  const [diferenciaisProgress, setDiferenciaisProgress] = useState(0)
  const [isDiferenciaisScrollable, setIsDiferenciaisScrollable] = useState(false)

  const updateDiferenciaisProgress = useCallback(() => {
    const el = diferenciaisRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setIsDiferenciaisScrollable(maxScroll > 1)
    if (maxScroll <= 1) { setDiferenciaisProgress(0); return }
    const progress = (el.scrollLeft / maxScroll) * 100
    setDiferenciaisProgress(Math.min(100, Math.max(0, progress)))
  }, [])

  useEffect(() => {
    const el = diferenciaisRef.current
    if (!el) return
    el.addEventListener('scroll', updateDiferenciaisProgress)
    const observer = new ResizeObserver(() => updateDiferenciaisProgress())
    observer.observe(el)
    updateDiferenciaisProgress()
    return () => {
      el.removeEventListener('scroll', updateDiferenciaisProgress)
      observer.disconnect()
    }
  }, [updateDiferenciaisProgress, realEstateAdvertisement])

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
        const numericValue = parseFloat(paddingValue)
        if (paddingValue.includes('rem')) {
          const rootFontSize = parseFloat(rootStyles.fontSize) || 16
          setSectionPadding(numericValue * rootFontSize)
        } else {
          setSectionPadding(numericValue)
        }
      }
    }

    calculateHeights()
    window.addEventListener('resize', calculateHeights)

    const observer = new MutationObserver(calculateHeights)
    observer.observe(document.body, { childList: true, subtree: true })

    const timer = setTimeout(calculateHeights, 200)

    return () => {
      window.removeEventListener('resize', calculateHeights)
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <SectionView className="flex items-center justify-center min-h-[50vh]">
        <TextView className="text-center">Carregando detalhes da propriedade...</TextView>
      </SectionView>
    )
  }

  // Error state
  if (error) {
    return (
      <SectionView className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <TextView className="text-center text-red-500">
          Erro: {error}
        </TextView>
        <ButtonView
          color="brown"
          onClick={() => navigateTo(routes.PROPERTIES)}
        >
          Voltar para Propriedades
        </ButtonView>
      </SectionView>
    )
  }

  // Property not found
  if (!realEstateAdvertisement) {
    return (
      <SectionView className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <TextView className="text-center">Propriedade não encontrada</TextView>
        <ButtonView
          color="brown"
          onClick={() => navigateTo(routes.PROPERTIES)}
        >
          Voltar para Propriedades
        </ButtonView>
      </SectionView>
    )
  }

  return (
    <div className="relative h-fit">
      {/* Hero */}
      <SectionView className="!p-0">
        <PropertyCardView
          realEstateAdvertisement={realEstateAdvertisement}
          realStateCardMode={REAL_STATE_CARD_MODES.DETAILS}
        />
      </SectionView>

      {/* Tabs - Sticky */}
      <div
        className="bg-white shadow-sm"
      >
        <PropertyTabsView
          tabs={['Sobre o Imóvel', 'Diferenciais', 'Localização', 'Sobre a Região']}
          anchors={['sobre-imovel', 'diferenciais', 'localizacao', 'sobre-regiao']}
        />
      </div>

      {/* === WRAPPER LIMITADOR === */}
      <div id="property-content-wrapper" className="relative z-10">
        <div className="relative">
          <SectionView id="sobre-imovel" className="bg-default-light relative flex-col !gap-subsection md:!gap-subsection-md lg:!pr-[544px]">
            <HeadingView level={2} className="mb-8 text-distac-primary text-center md:text-left max-md:!w-full">
              Sobre o Imóvel
            </HeadingView>
            <TextView className="text-default-dark-muted leading-relaxed text-center md:text-left">
              {realEstateAdvertisement.estate?.description}
            </TextView>
          </SectionView>

          <SectionView id="diferenciais" className="bg-default-light-alt lg:!pr-[544px] !flex-col !items-center md:!items-start">
            <HeadingView level={2} className="text-distac-primary mb-10 text-center md:text-left max-md:!w-full">
              Diferenciais
            </HeadingView>
            <div
              ref={diferenciaisRef}
              className="w-full grid grid-flow-col grid-rows-5 auto-cols-[100%] overflow-x-auto scrollbar-hide gap-3 pb-2 scroll-smooth snap-x snap-mandatory md:grid-flow-row md:grid-cols-3 md:auto-cols-auto md:grid-rows-none md:gap-6 md:auto-rows-fr md:max-w-4xl md:overflow-visible md:snap-none"
            >
              {realEstateAdvertisement.estate?.features?.map((feature, index) => (
                <div key={feature.id} className="snap-start md:h-full">
                  <PropertyFeatureView feature={feature} />
                </div>
              ))}
            </div>
            {realEstateAdvertisement.estate?.features?.length > 5 && (
              <div className="w-full mt-4 md:hidden">
                <div className="w-full bg-default-light-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-distac-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${diferenciaisProgress}%` }}
                  />
                </div>
              </div>
            )}
          </SectionView>

          <SectionView id="localizacao" className="bg-distac-gradient flex-col !gap-subsection md:!gap-subsection-md lg:!pr-[544px]">
            <HeadingView level={2} className="text-default-light mb-10 text-center md:text-left max-md:!w-full">
              Localização
            </HeadingView>
            <div className={`grid gap-8 auto-rows-fr ${realEstateAdvertisement.estate?.address && realEstateAdvertisement.estate?.standAddress ? 'grid-cols-1 md:grid-cols-2' : realEstateAdvertisement.estate?.address || realEstateAdvertisement.estate?.standAddress ? 'grid-cols-1' : ''}`}>

              {realEstateAdvertisement.estate?.address && (
              <PropertyLocation
                address={realEstateAdvertisement.estate?.address}
                type="building"
              />
              )}

              {realEstateAdvertisement.estate?.hasStandAddress() && (
              <PropertyLocation
                address={realEstateAdvertisement.estate?.standAddress}
                type="stand"
              />
              )}
            </div>
          </SectionView>

          <SectionView id="sobre-regiao" className="bg-default-light-alt flex-col !gap-subsection md:!gap-subsection-md lg:!pr-[544px]">
            <HeadingView level={2} className="mb-10 text-distac-primary text-center md:text-left max-md:!w-full">
              Sobre a Região
            </HeadingView>
            <TextView className="text-default-dark-muted leading-relaxed text-center md:text-left">
              {region.description}
            </TextView>
            <ImageView src={region.imageUrl} alt="Região" description={region.description} className="max-h-96" />
          </SectionView>
        </div>

        {realEstateAdvertisement && (
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <div
            className="sticky right-0 z-50 w-fit mr-[var(--padding-section-x)] md:mr-[var(--padding-section-x-md)] ml-auto pointer-events-auto"
            style={{
              top: `${headerHeight + tabsHeight + sectionPadding}px`,
              marginTop: `${sectionPadding}px`
            }}
          >
            <PropertyCardView
              realEstateAdvertisement={realEstateAdvertisement}
              realStateCardMode={REAL_STATE_CARD_MODES.REDIRECTION}
              className="!w-full"
              onWhatsAppClick={() => setIsScreeningFormOpen(true)}
            />
          </div>
        </div>
        )}
      </div>

      {/* Carrossel de Imóveis Relacionados */}
      {relatedRealEstateAdvertisements.length > 0 && (
        <SectionView>
          <PropertiesCarouselView
            titleCarousel="Imóveis Relacionados"
            realEstateAdvertisements={relatedRealEstateAdvertisements}
            showActionButton={true}
            actionButtonText="Ver Todas"
            actionRoute="PROPERTIES"
          />
        </SectionView>
      )}

      {isScreeningFormOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-4">
              <HeadingView level={3}>Formulário de Triagem</HeadingView>
              <button
                onClick={() => setIsScreeningFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <ScreeningFormView realEstateAdvertisement={realEstateAdvertisement} onClose={() => setIsScreeningFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
