import { PropertyCardView } from '@domains/property/PropertyCard/PropertyCardView'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo } from 'react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { usePropertiesCarouselViewModel } from '@domains/property/PropertiesCarousel/usePropertiesCarouselViewModel'
import { useRouter } from '@app/routes/useRouterViewModel'

export const PropertiesCarouselView = memo(function PropertiesCarouselView({
  properties = [],
  titleCarousel,
  supportMode = false,
  onEdit,
  onDelete,
  // Props genéricas para customizar o botão de ação
  showActionButton = true,
  actionButtonText = 'Ver Mais',
  actionRoute = 'PROPERTIES', // Nome da rota no RouterModel
  actionRouteParams = {}, // Parâmetros para a rota
  onActionClick = null // Função customizada para o clique (opcional)
}) {
  const {
    containerRef,
    scrollProgress,
    isScrollable,
    scrollToLeft,
    scrollToRight,
  } = usePropertiesCarouselViewModel(properties)

  const { navigateTo, generateRoute, getAllRoutes } = useRouter()
  const routes = getAllRoutes()

  const handleActionClick = () => {
    if (onActionClick) {
      // Se foi passada uma função customizada, usa ela
      onActionClick()
    } else {
      // Senão, navega usando o router
      try {
        const route = Object.keys(routes).includes(actionRoute)
          ? generateRoute(actionRoute, actionRouteParams)
          : routes[actionRoute] || routes.PROPERTIES
        navigateTo(route)
      } catch (error) {
        console.error('Erro ao navegar:', error)
        navigateTo(routes.PROPERTIES) // Fallback
      }
    }
  }

  if (properties.length === 0) {
    return null
  }

  return (
    <div className="relative w-full gap-subsection md:gap-subsection-md flex flex-col h-fit">
      <div className='flex flex-row justify-between items-start'>
        <HeadingView level={2} className="text-center text-distac-primary">
          {titleCarousel}
        </HeadingView>

        {showActionButton && (
          <ButtonView
            color="brown"
            size="medium"
            type="button"
            width='fit'
            onClick={handleActionClick}
            aria-label={actionButtonText}
          >
            {actionButtonText}
          </ButtonView>
        )}
      </div>

      <div className="relative w-full">
        {isScrollable && (
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-2">
            <ButtonView
              color="brown"
              type="button"
              width='fit'
              onClick={scrollToLeft}
              className="hover:scale-110 pointer-events-auto shadow-lg"
              aria-label="Slide anterior"
              shape='square'
            >
              <ChevronLeft size={24} />
            </ButtonView>

            <ButtonView
              color="brown"
              type="button"
              width='fit'
              onClick={scrollToRight}
              className="hover:scale-110 pointer-events-auto shadow-lg"
              aria-label="Próximo slide"
              shape='square'
            >
              <ChevronRight size={24} />
            </ButtonView>
          </div>
        )}

        <div className="relative px-4 md:px-6">
          <div
            ref={containerRef}
            className="flex overflow-x-auto select-none scrollbar-hide scroll-smooth gap-8 p-2 w-full"
            role="region"
            aria-label="Carrossel de propriedades"
            tabIndex={0}
          >
            {properties.map((property, index) => (
              <PropertyCardView
                key={`${property.id || index}-${property.title}`}
                id={property.id || index + 1}
                hasLabel={true}
                category={property.category}
                title={property.title}
                subtitle={property.subtitle}
                description={property.description}
                hasDifference={true}
                differences={property.differences}
                hasButton={!supportMode}
                hasShadow={true}
                hasImage={true}
                hasHoverEffect={!supportMode}
                imageUrl={property.imageLink}
                className="flex-shrink-0"
                supportMode={supportMode}
                onEdit={onEdit}
                onDelete={onDelete}
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
                transform: `translateX(0%)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
})
