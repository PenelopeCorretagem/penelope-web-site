import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { PropertiesCarouselModel } from '@shared/components/ui/PropertiesCarousel/PropertiesCarouselModel'
import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'

/**
 * Hook para gerenciar estado e interações do PropertiesCarousel.
 * Implementa Factory Pattern - cria e encapsula o Model internamente.
 *
 * @param {Array} realEstateAdvertisements Lista de propriedades
 * @param {Object|string} realStateCardMode Modo de exibição dos cards
 * @param {string} initialTitle Título opcional do carrossel
 */
export function usePropertiesCarouselViewModel(
  realEstateAdvertisements = [],
  realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT,
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
  const memoizedAdvertisements = useMemo(() => realEstateAdvertisements, [realEstateAdvertisements])

  // ✅ Factory Pattern — criando o model corretamente
  const [model] = useState(() => {
    return new PropertiesCarouselModel({
      realEstateAdvertisements: memoizedAdvertisements,
      realStateCardMode,
      containerRef,
      titleCarousel: initialTitle
    })
  })

  // 🔄 Sync: Update model when dependencies change, but don't force re-render
  useEffect(() => {
    let hasChanges = false

    if (model.realEstateAdvertisements !== memoizedAdvertisements) {
      model.realEstateAdvertisements = memoizedAdvertisements
      hasChanges = true
    }

    if (model.realStateCardMode !== realStateCardMode) {
      model.realStateCardMode = realStateCardMode
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
  }, [memoizedAdvertisements, realStateCardMode, initialTitle, model])

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
    properties: model.getOriginalItems(),
    currentRealIndex: model.getCurrentRealIndex(),
    totalItems: model.getTotalOriginalItems(),
    titleCarousel: model.titleCarousel,
    callToActionButton: model.callToActionButton,

    // Comandos expostos
    next: () => {
      model.goToNextRealEstateAdvertisement()
      refresh()
    },
    previous: () => {
      model.goToPreviousRealEstateAdvertisement()
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
