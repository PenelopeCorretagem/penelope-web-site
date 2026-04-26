import { useState, useEffect, useRef, useCallback } from 'react'
import { AdvertisementTabsView } from '@institutional/components/AdvertisementTabs/AdvertisementTabsView.jsx'
import { SectionView } from '@shared/components/layout/Section/SectionView.jsx'
import { AdvertisementLocation } from '@institutional/components/AdvertisementLocation/AdvertisementLocation.jsx'
import * as LucideIcons from 'lucide-react'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'
import { ImageView } from '@shared/components/ui/Image/ImageView.jsx'
import { AdvertisementsCarouselView } from '@shared/components/ui/AdvertisementsCarousel/AdvertisementsCarouselView.jsx'
import { AdvertisementCardView } from '@shared/components/ui/AdvertisementCard/AdvertisementCardView.jsx'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView.jsx'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { useRouter } from '@app/routes/useRouterViewModel'
import { ScreeningFormView } from '@shared/components/ui/ScreeningForm/ScreeningFormView.jsx'
import { AlertView } from '@shared/components/feedback/Alert/AlertView.jsx'

import { useAdvertisementDetailsViewModel } from './useAdvertisementDetailsViewModel'

export function AdvertisementDetailsView() {
  const {
    advertisement,
    relatedAdvertisements,
    region,
    isLoading,
    error,
    refresh
  } = useAdvertisementDetailsViewModel()

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
  }, [updateDiferenciaisProgress, advertisement])

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
        <AlertView
          isVisible={true}
          type="error"
          message={error}
          hasCloseButton={false}
          buttonsLayout="col"
          actions={[
            {
              label: 'Tentar novamente',
              onClick: refresh,
              color: 'distac-primary',
            },
            {
              label: 'Voltar',
              onClick: () => navigateTo(routes.PROPERTIES),
              color: 'distac-primary',
            },
          ]}
        />
      </SectionView>
    )
  }

  return (
    <div className="relative h-fit pb-24 lg:pb-0">
      {/* Hero */}
      <SectionView className="!p-0">
        <AdvertisementCardView
          advertisement={advertisement}
          advertisementCardMode={ADVERTISEMENT_CARD_MODES.DETAILS}
        />
      </SectionView>

      {/* Tabs - Sticky */}
      <div
        className="sticky top-0 z-40 bg-white shadow-sm"
      >
        <AdvertisementTabsView
          tabs={['Sobre o Imóvel', 'Diferenciais', 'Localização', 'Sobre a Região', 'Imóveis Relacionados']}
          anchors={['sobre-imovel', 'diferenciais', 'localizacao', 'sobre-regiao', 'imoveis-relacionados']}
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
              {advertisement.estate?.description}
            </TextView>
          </SectionView>

          <SectionView id="diferenciais" className="bg-default-light-alt lg:!pr-[544px] !flex-col !items-center md:!items-start w-full">
            <HeadingView level={2} className="text-distac-primary mb-10 text-center md:text-left max-md:!w-full">
              Diferenciais
            </HeadingView>
            <div
              ref={diferenciaisRef}
              className="w-full grid grid-flow-col grid-rows-5 auto-cols-[100%] overflow-x-auto scrollbar-hide gap-3 pb-2 scroll-smooth snap-x snap-mandatory md:grid-flow-row md:grid-cols-4 md:auto-cols-auto md:grid-rows-none md:gap-4 md:auto-rows-fr md:overflow-visible md:snap-none"
            >
              {advertisement.estate?.amenities?.map((feature) => {
                const iconName = feature?.icon
                const IconComponent = iconName ? LucideIcons[iconName] : null
                
                return (
                  <div key={feature.id} className="snap-start md:h-full flex items-center w-full justify-center gap-3 bg-default-dark-light rounded-sm p-3">
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-default-light flex-shrink-0" />
                    )}
                    <span className="text-default-light text-sm font-medium">
                      {feature?.description}
                    </span>
                  </div>
                )
              })}
            </div>
            {isDiferenciaisScrollable && (
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
            <div className="grid gap-8 auto-rows-fr">
              {advertisement.estate?.address && (
                <AdvertisementLocation
                  address={advertisement.estate?.address}
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

        {advertisement && (
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <div
            className="sticky right-0 z-50 w-fit mr-[var(--padding-section-x)] md:mr-[var(--padding-section-x-md)] ml-auto pointer-events-auto"
            style={{
              top: `${headerHeight + tabsHeight + sectionPadding}px`,
              marginTop: `${sectionPadding}px`,
              marginBottom: `${sectionPadding}px`
            }}
          >
            <AdvertisementCardView
              advertisement={advertisement}
              advertisementCardMode={ADVERTISEMENT_CARD_MODES.REDIRECTION}
              className="!w-full"
              onWhatsAppClick={() => setIsScreeningFormOpen(true)}
            />
          </div>
        </div>
        )}
      </div>

      {/* Carrossel de Imóveis Relacionados */}
      {relatedAdvertisements.length > 0 && (
        <SectionView id="imoveis-relacionados">
          <AdvertisementsCarouselView
            titleCarousel="Imóveis Relacionados"
            advertisements={relatedAdvertisements}
            showActionButton={true}
            actionButtonText="Ver Todas"
            actionRoute="PROPERTIES"
          />
        </SectionView>
      )}

      {advertisement && !isScreeningFormOpen && (
        <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-default-light/95 backdrop-blur border-t border-default-light-muted p-3">
          <ButtonView
            width="full"
            color="pink"
            onClick={() => setIsScreeningFormOpen(true)}
          >
            Falar com corretor
          </ButtonView>
        </div>
      )}

      {isScreeningFormOpen && (
        <ScreeningFormView advertisement={advertisement} onClose={() => setIsScreeningFormOpen(false)} />
      )}
    </div>
  )
}
