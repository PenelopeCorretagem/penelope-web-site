import { PropertyCardView } from '@shared/components/ui/PropertyCard/PropertyCardView'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo } from 'react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { usePropertiesCarouselViewModel } from '@shared/components/ui/PropertiesCarousel/usePropertiesCarouselViewModel'
import { RouterModel } from '@app/routes/RouterModel'
import { ROUTES } from '@constant/routes'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'

export const PropertiesCarouselView = memo(function PropertiesCarouselView({
  // NOTE: agora a prop se chama `properties` (array)
  realEstateAdvertisements = [],
  titleCarousel = '',
  realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT,
  // Props genéricas para customizar o botão de ação
  showActionButton = true,
  actionButtonText = 'Ver Mais',
  actionRoute = 'PROPERTIES', // Nome da rota
  actionRouteParams = {}, // Parâmetros para a rota
  onActionClick = null // Função customizada para o clique (opcional)
}) {
  const {
    containerRef,
    scrollProgress,
    isScrollable,
    scrollToLeft,
    scrollToRight,
    titleCarousel: modelTitle,
    callToActionButton
  } = usePropertiesCarouselViewModel(realEstateAdvertisements, realStateCardMode, titleCarousel)

  // Router fallback usando RouterModel (caso a sua app não use useRouter())
  const router = RouterModel.getInstance()
  const getRouteOrFallback = (routeName, params) => {
    try {
      if (!routeName) return router.generateRoute(ROUTES.PROPERTIES.key, params)
      // Se receber chave como 'PROPERTIES', tenta pegar key no map ROUTES, senão assume que routeName já é chave válida
      const routeKey = ROUTES?.[routeName]?.key || ROUTES?.[routeName] || routeName
      return router.generateRoute(routeKey, params)
    } catch (e) {
      console.error('Erro ao gerar rota:', e)
      return router.generateRoute(ROUTES.PROPERTIES.key, params)
    }
  }

  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick()
      return
    }

    // Se o model expôs um CTA configurado, tenta navegar por ele; senão, usa props
    if (callToActionButton && callToActionButton.getRoute) {
      try {
        const route = callToActionButton.getRoute()
        router.navigateTo(route)
        return
      } catch (e) {
        // fallback para props
      }
    }

    const route = getRouteOrFallback(actionRoute, actionRouteParams)
    try {
      window.history.pushState({}, '', route)
      router.setCurrentRoute(route)
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (e) {
      console.error('Erro ao navegar:', e)
    }

  }

  if (!realEstateAdvertisements || realEstateAdvertisements.length === 0) {
    return null
  }

  return (
    <div className="relative w-full gap-subsection md:gap-subsection-md flex flex-col h-fit">
      <div className="flex flex-row justify-between items-start">
        <HeadingView level={2} className="text-center text-distac-primary">
          {modelTitle || titleCarousel}
        </HeadingView>

        {showActionButton && (
          <ButtonView
            color="brown"
            size="medium"
            type="button"
            width="fit"
            onClick={handleActionClick}
            aria-label={actionButtonText}
          >
            {actionButtonText}
          </ButtonView>
        )}
      </div>

      <div className="relative w-full">
        {isScrollable && (
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-20">
            <div className="pointer-events-auto">
              <ButtonView
                color="brown"
                type="button"
                width="fit"
                onClick={scrollToLeft}
                className="hover:scale-110 shadow-lg"
                aria-label="Slide anterior"
                shape="square"
              >
                <ChevronLeft size={24} />
              </ButtonView>
            </div>

            <div className="pointer-events-auto">
              <ButtonView
                color="brown"
                type="button"
                width="fit"
                onClick={scrollToRight}
                className="hover:scale-110 shadow-lg"
                aria-label="Próximo slide"
                shape="square"
              >
                <ChevronRight size={24} />
              </ButtonView>
            </div>
          </div>
        )}

        <div className="relative px-4 md:px-6">
          <div
            ref={containerRef}
            className="flex overflow-x-auto select-none scrollbar-hide scroll-smooth gap-8 p-4 w-full"
            role="region"
            aria-label="Carrossel de propriedades"
            tabIndex={0}
          >
            {realEstateAdvertisements.map((realEstateAdvertisement, index) => (
              <PropertyCardView
                key={realEstateAdvertisement.id || index}
                realEstateAdvertisement={realEstateAdvertisement}
                realStateCardMode={realStateCardMode}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {isScrollable && (
        <div className="w-full">
          <div className="w-full bg-default-light-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-distac-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${scrollProgress}%`,
                transform: `translateX(0%)`
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
})
