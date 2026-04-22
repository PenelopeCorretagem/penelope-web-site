import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { AdvertisementsCarouselModel } from '@shared/components/ui/AdvertisementsCarousel/AdvertisementsCarouselModel'
import { ADVERTISEMENT_CARD_MODES } from '@constant/advertisementCardModes'

/**
 * Hook para gerenciar estado e interações do AdvertisementsCarousel.
 * Implementa Factory Pattern - cria e encapsula o Model internamente.
 *
 * @param {Array} Advertisements Lista de propriedades
 * @param {Object|string} advertisementCardMode Modo de exibição dos cards
 * @param {string} initialTitle Título opcional do carrossel
 */
export function useAdvertisementsCarouselViewModel(
  advertisements = [],
  advertisementCardMode = ADVERTISEMENT_CARD_MODES.DEFAULT,
  initialTitle = ''
) {
  const [, forceUpdate] = useState(0)
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // Memoize the array to avoid recreating on every render
  const memoizedAdvertisements = useMemo(() => advertisements, [advertisements])

  // ✅ Factory Pattern — criando o model corretamente
  const [model] = useState(() => {
    return new AdvertisementsCarouselModel({
      advertisements: memoizedAdvertisements,
      advertisementCardMode,
      containerRef,
      titleCarousel: initialTitle
    })
  })

  // 🔄 Sync: Update model when dependencies change, but don't force re-render
  useEffect(() => {
    let hasChanges = false

    if (model.advertisements !== memoizedAdvertisements) {
      model.advertisements = memoizedAdvertisements
      hasChanges = true
    }

    if (model.advertisementCardMode !== advertisementCardMode) {
      model.advertisementCardMode = advertisementCardMode
      hasChanges = true
    }

    if (initialTitle !== undefined && model.titleCarousel !== initialTitle) {
      model.titleCarousel = initialTitle
      hasChanges = true
    }

    // Only refresh if there were actual changes
    if (hasChanges) {
      refresh()
    }
  }, [memoizedAdvertisements, advertisementCardMode, initialTitle, model])

  // ------------------------------------------------------------------------------------
  // Delegações: Scroll e Navegação agora são chamadas diretas ao Model
  // ------------------------------------------------------------------------------------

  const checkScrollProgress = useCallback(() => {
    model.checkScrollProgress()
    setScrollProgress(model.scrollProgress)
  }, [model])

  const scrollToLeft = useCallback(() => {
    model.scrollToLeft()
  }, [model])

  const scrollToRight = useCallback(() => {
    model.scrollToRight()
  }, [model])

  // Verifica se o container possui scroll horizontal
  const checkIfScrollable = useCallback(() => {
    if (!containerRef.current) {
      setIsScrollable(false)
      return
    }
    const { scrollWidth, clientWidth } = containerRef.current
    setIsScrollable(scrollWidth > clientWidth)
  }, [])

  // Listener de scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => checkScrollProgress()

    container.addEventListener('scroll', handleScroll)

    // Check inicial
    checkScrollProgress()
    checkIfScrollable()

    return () => container.removeEventListener('scroll', handleScroll)
  }, [checkScrollProgress, checkIfScrollable])

  // Listener de resize
  useEffect(() => {
    const handleResize = () => {
      checkIfScrollable()
      checkScrollProgress()
    }

    window.addEventListener('resize', handleResize)

    const timeoutId = setTimeout(checkIfScrollable, 100)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [checkIfScrollable, checkScrollProgress])

  // ------------------------------------------------------------------------------------
  // API exposta pela ViewModel para a View
  // ------------------------------------------------------------------------------------

  return {
    // Refs
    containerRef,

    // Estado
    scrollProgress,
    isScrollable,

    // Dados derivados do Model
    advertisements: model.getOriginalItems(),
    currentRealIndex: model.getCurrentRealIndex(),
    totalItems: model.getTotalOriginalItems(),
    titleCarousel: model.titleCarousel,
    callToActionButton: model.callToActionButton,

    // Comandos expostos
    next: () => {
      model.goToNextAdvertisement()
      refresh()
    },
    previous: () => {
      model.goToPreviousAdvertisement()
      refresh()
    },
    goToSlide: (index) => {
      model.goToSlide(index)
      refresh()
    },
    scrollToLeft,
    scrollToRight,

    // Utils
    checkScrollProgress
  }
}
