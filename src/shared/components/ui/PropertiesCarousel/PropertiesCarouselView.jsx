import { PropertyCardView } from '@shared/components/ui/PropertyCard/PropertyCardView'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo } from 'react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { usePropertiesCarouselViewModel } from '@shared/components/ui/PropertiesCarousel/usePropertiesCarouselViewModel'

export const PropertiesCarouselView = memo(function PropertiesCarouselView({ properties = [] }) {
  const {
    containerRef,
    scrollProgress,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    scrollToLeft,
    scrollToRight,
  } = usePropertiesCarouselViewModel(properties)

  if (properties.length === 0) {
    return null
  }

  return (
    <div className="relative w-full gap-subsection md:gap-subsection-md flex flex-col h-fit">
      <div className='flex flex-row justify-between items-start'>
        <HeadingView level={2} color='pink' className="text-center">
          Nossos Lançamentos
        </HeadingView>

        <ButtonView
          text="Ver Mais"
          variant="brown"
          type="button"
          width='fit'
          aria-label="Ver mais propriedades"
        />
      </div>

      <div className="relative">
        {/* Botões de navegação - nos cantos do carrossel */}
        <div className="absolute inset-0 flex justify-between items-center pointer-events-none z-2">
          <ButtonView
            variant="brown"
            type="button"
            width='fit'
            onClick={scrollToLeft}
            className="hover:scale-110 py-3 px-3 pointer-events-auto shadow-lg"
            aria-label="Slide anterior"
          >
            <ChevronLeft size={24} className="text-brand-white" />
          </ButtonView>

          <ButtonView
            variant="brown"
            type="button"
            width='fit'
            onClick={scrollToRight}
            className="hover:scale-110 py-3 px-3 pointer-events-auto shadow-lg"
            aria-label="Próximo slide"
          >
            <ChevronRight size={24} className="text-brand-white" />
          </ButtonView>
        </div>

        <div
          ref={containerRef}
          className="flex overflow-x-auto cursor-grab select-none mx-4
                   scrollbar-hide touch-pan-x
                   active:cursor-grabbing
                   [&:not(:active)]:scroll-smooth
                   [&:active_*]:pointer-events-none
                   [&_button]:pointer-events-auto
                   [&_a]:pointer-events-auto
                   [&_[role='button']]:pointer-events-auto
                   [&:not(:active)_.flex-shrink-0]:pointer-events-auto
                   [&_.flex-shrink-0>*]:transition-transform
                   [&_.flex-shrink-0>*]:duration-300
                   [&_.flex-shrink-0>*]:ease-out
                   [&_.flex-shrink-0>*]:will-change-transform
                   [&_.flex-shrink-0:hover>*]:scale-105
                   [&_.flex-shrink-0:hover>*]:relative
                   [&_.flex-shrink-0:hover>*]:z-1
                   [&:active_.flex-shrink-0>*]:transition-none
                   [&:active_.flex-shrink-0>*]:transform-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            WebkitTapHighlightColor: 'transparent',
            tapHighlightColor: 'transparent'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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

      <div className="w-full">
        <div className="w-full bg-brand-white-tertiary rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-brand-pink h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${scrollProgress}%`,
              transform: `translateX(0%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
})
