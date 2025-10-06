import { PropertyCardView } from './PropertyCardView'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { ButtonView } from './ButtonView'
import { ButtonModel } from '../../model/components/ButtonModel'
import { HeadingView } from './HeadingView'

export const PropertiesCarouselView = memo(function PropertiesCarouselView({ properties = [], titleCarousel }) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)

  // Verifica o progresso do scroll e atualiza a barra
  const checkScrollProgress = useCallback(() => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    const maxScroll = scrollWidth - clientWidth
    const shadowOffset = 16 // Mesmo offset usado na navegação

    // Calcula o progresso (0 a 100)
    let progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0

    // Se chegou próximo do fim (considerando a sombra), considera 100%
    if (scrollLeft >= maxScroll - shadowOffset - 10) {
      progress = 100
    }
    // Se está próximo do início, considera 0%
    else if (scrollLeft <= 10) {
      progress = 0
    }

    setScrollProgress(Math.min(100, Math.max(0, progress)))
  }, [])

  // Rola para a esquerda ou volta ao fim se estiver no início
  const scrollToPrev = useCallback(() => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    const cardWidth = 320 // 320px (w-80)
    const shadowOffset = 16 // Espaço para a sombra aparecer

    // Se estiver próximo do início
    if (scrollLeft <= 10) {
      // Se estiver próximo do início, vai para o fim (considerando a sombra)
      containerRef.current.scrollTo({
        left: scrollWidth - clientWidth - shadowOffset,
        behavior: 'smooth'
      })
    } else {
      // Scroll normal para a esquerda
      containerRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      })
    }
  }, [])

  // Rola para a direita ou volta ao início se estiver no fim
  const scrollToNext = useCallback(() => {
    if (!containerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    const maxScroll = scrollWidth - clientWidth
    const cardWidth = 320 // 320px (w-80)
    const shadowOffset = 16 // Espaço para a sombra aparecer

    // Se chegou próximo do fim (considerando a sombra)
    if (scrollLeft >= maxScroll - shadowOffset - 10) {
      // Volta para o início (mas deixa um pouco de espaço para a sombra)
      containerRef.current.scrollTo({
        left: shadowOffset,
        behavior: 'smooth'
      })
    } else {
      // Scroll normal para a direita
      containerRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      })
    }
  }, [])

  // Handlers de mouse drag
  const handleMouseDown = useCallback((e) => {
    if (!containerRef.current) return

    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
    containerRef.current.style.cursor = 'grabbing'
    containerRef.current.classList.add('dragging')
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
      containerRef.current.classList.remove('dragging')
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return

    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Reduzido para movimento mais suave
    containerRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  // Handlers de touch drag (mobile)
  const handleTouchStart = useCallback((e) => {
    if (!containerRef.current) return

    setIsDragging(true)
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
    containerRef.current.classList.add('dragging')
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return

    const x = e.touches[0].pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 1.5 // Reduzido para movimento mais suave
    containerRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.classList.remove('dragging')
    }
  }, [])

  // Event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Mouse events
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // Scroll event para atualizar progresso
    container.addEventListener('scroll', checkScrollProgress)

    // Verifica progresso inicialmente
    checkScrollProgress()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      container.removeEventListener('scroll', checkScrollProgress)
    }
  }, [handleMouseMove, handleMouseUp, checkScrollProgress])

  if (properties.length === 0) {
    return null
  }

  return (
    <div className="relative w-full gap-subsection md:gap-subsection-md flex flex-col h-fit">
      <div className='flex flex-row justify-between items-start'>
        <HeadingView level={2} color='pink' className="text-center mb-4">
          {titleCarousel}
        </HeadingView>

        {/* Botão Ver Mais */}
        <ButtonView
          model={new ButtonModel('Ver Mais' , 'brown', 'button')}
          width='fit'
          aria-label="Slide anterior ou ir para o fim"
        />
      </div>
      {/* Container do Carrossel */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto py-4 cursor-grab select-none carousel-container gap-subsection md:gap-subsection-md"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={handleMouseDown}
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
            className="flex-shrink-0 w-80"
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


      <div className="flex justify-between items-center ">


        {/* Botão Anterior */}
        <ButtonView
          model={new ButtonModel(<ChevronLeft size={20} className="text-brand-white" /> , 'brown', 'button')}
          width='fit'
          onClick={scrollToPrev}
          className=" hover:scale-110"
          aria-label="Slide anterior ou ir para o fim"
        />

        {/* Barra de Progresso */}
        <div className="mt-4 px-12 w-full">
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

        {/* Botão Próximo */}
        <ButtonView
          model={new ButtonModel(<ChevronRight size={20} className="text-brand-white" /> , 'brown', 'button')}
          width='fit'
          onClick={scrollToNext}
          className=" hover:scale-110"
          aria-label="Próximo slide ou voltar ao início"
        />
      </div>



      {/* CSS para animações mais suaves */}
      <style>
        {`
          .carousel-container {
            scroll-behavior: smooth;
            transition: scroll-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .carousel-container::-webkit-scrollbar {
            display: none;
          }

          /* Animação mais suave para drag */
          .carousel-container.dragging {
            scroll-behavior: auto;
          }

          /* Efeito de bounce suave ao final */
          .carousel-container:not(.dragging) {
            scroll-behavior: smooth;
            scroll-snap-type: x proximity;
          }

          .carousel-container > div {
            scroll-snap-align: start;
          }
        `}
      </style>
    </div>
  )
})
