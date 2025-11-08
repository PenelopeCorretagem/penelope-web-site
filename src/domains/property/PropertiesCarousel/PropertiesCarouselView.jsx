import { PropertyCardView } from '@domains/property/PropertyCard/PropertyCardView'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo } from 'react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { usePropertiesCarouselViewModel } from '@domains/property/PropertiesCarousel/usePropertiesCarouselViewModel'

export const PropertiesCarouselView = memo(function PropertiesCarouselView({ properties = [], titleCarousel }) {
  const {
    containerRef,
    scrollProgress,
    isScrollable,
    scrollToLeft,
    scrollToRight,
  } = usePropertiesCarouselViewModel(properties)

  if (properties.length === 0) {
    return null
  }

  return (
    <div className="relative w-full gap-subsection md:gap-subsection-md flex flex-col h-fit">
      <div className='flex flex-row justify-between items-start'>
        <HeadingView level={2} className="text-center text-distac-primary">
          {titleCarousel}
        </HeadingView>

        <ButtonView
          variant="brown"
          size="medium"
          type="link"
          to='/imoveis'
          width='fit'
          aria-label="Ver mais propriedades"
        >
          Ver Mais
        </ButtonView>
      </div>

      <div className="relative">
        {isScrollable && (
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-2">
            <ButtonView
              color="brown"
              type="button"
              width='fit'
              onClick={scrollToLeft}
              className="hover:scale-110 !p-2 md:!p-3 pointer-events-auto shadow-lg"
              aria-label="Slide anterior"
            >
              <ChevronLeft size={24} />
            </ButtonView>

            <ButtonView
              color="brown"
              type="button"
              width='fit'
              onClick={scrollToRight}
              className="hover:scale-110 !p-2 md:!p-3 pointer-events-auto shadow-lg"
              aria-label="Próximo slide"
            >
              <ChevronRight size={24} />
            </ButtonView>
          </div>
        )}

        <div
          ref={containerRef}
          className="flex overflow-x-auto select-none mx-4
                   scrollbar-hide
                   scroll-smooth
                   [&_.flex-shrink-0>*]:transition-transform
                   [&_.flex-shrink-0>*]:duration-300
                   [&_.flex-shrink-0>*]:ease-out
                   [&_.flex-shrink-0>*]:will-change-transform
                   [&_.flex-shrink-0:hover>*]:scale-105
                   [&_.flex-shrink-0:hover>*]:relative
                   [&_.flex-shrink-0:hover>*]:z-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          role="region"
          aria-label="Carrossel de propriedades"
          tabIndex={0}
        >
          {properties.map((property, index) => (
            <div
              key={`${property.id || index}-${property.title}`}
              className="flex-shrink-0 w-[342px] p-4"
            >
              <PropertyCardView
                id={property.id || index + 1}
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
                hasHoverEffect={true}
                imageUrl={property.imageLink}
              />
            </div>
          ))}
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
