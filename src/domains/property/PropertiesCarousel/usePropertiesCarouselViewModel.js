import { useState, useRef, useEffect, useCallback } from 'react'
import { PropertiesCarouselModel } from '@domains/property/PropertiesCarousel/PropertiesCarouselModel'

/**
 * PropertiesCarouselViewModel - Gerencia a lógica e apresentação do PropertiesCarousel
 * Centraliza a lógica de navegação, drag & drop e animações
 */
class PropertiesCarouselViewModel {
  constructor(model, updateView) {
    this.model = model
    this.updateView = updateView
    this.isAnimating = false
    this.isDragging = false
    this.startX = 0
    this.currentTranslate = 0
    this.prevTranslate = 0
  }

  next() {
    if (this.isAnimating || this.isDragging) return

    const currentIndex = this.model.getCurrentIndex()
    this.model.setCurrentIndex(currentIndex + 1)
    this.updateView()
  }

  previous() {
    if (this.isAnimating || this.isDragging) return

    const currentIndex = this.model.getCurrentIndex()
    this.model.setCurrentIndex(currentIndex - 1)
    this.updateView()
  }

  goToSlide(realIndex) {
    if (this.isAnimating || this.isDragging) return

    const cloneCount = this.model.getCloneCount()
    // Vai para o item real no meio do array
    this.model.setCurrentIndex(cloneCount + realIndex)
    this.updateView()
  }

  // Verifica se precisa reposicionar para criar loop infinito
  checkInfiniteLoop() {
    const currentIndex = this.model.getCurrentIndex()
    const cloneCount = this.model.getCloneCount()
    const _originalLength = this.model.getOriginalLength()

    // Se chegou no final dos clones finais, volta para o início real
    if (currentIndex >= cloneCount * 2) {
      this.model.setCurrentIndex(cloneCount)
      return true
    }

    // Se chegou no início dos clones iniciais, vai para o final real
    if (currentIndex < cloneCount) {
      this.model.setCurrentIndex(cloneCount + _originalLength - 1)
      return true
    }

    return false
  }

  setAnimating(isAnimating) {
    this.isAnimating = isAnimating
  }

  getCurrentRealIndex() {
    return this.model.getRealIndex()
  }

  getTotalOriginalItems() {
    return this.model.getOriginalLength()
  }

  getItems() {
    return this.model.getItems()
  }

  getOriginalItems() {
    return this.model.getOriginalItems()
  }
}

/**
 * Hook para gerenciar estado e interações do PropertiesCarousel
 * Implementa Factory Pattern - cria o modelo internamente
 * @param {Array} properties - Lista de propriedades para exibir
 * @returns {Object} Estado e comandos do carousel
 */
export function usePropertiesCarouselViewModel(properties = []) {
  const [, forceUpdate] = useState(0)
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false) // Novo estado

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // ✅ Factory Pattern - Hook cria o modelo
  const [viewModel] = useState(() => {
    const model = new PropertiesCarouselModel(properties)
    return new PropertiesCarouselViewModel(model, refresh)
  })

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

    setScrollProgress(Math.round(progress))
  }, [])

  // Navegação por botões - move exatamente um card por vez
  const scrollToLeft = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const cards = container.querySelectorAll('.flex-shrink-0')

    if (cards.length === 0) return

    // Pega a posição atual do scroll
    const currentScrollLeft = container.scrollLeft

    // Encontra o card que está mais próximo da posição atual
    let currentCardIndex = 0
    let minDistance = Infinity

    for (let i = 0; i < cards.length; i++) {
      const cardLeft = cards[i].offsetLeft
      const distance = Math.abs(cardLeft - currentScrollLeft)

      if (distance < minDistance) {
        minDistance = distance
        currentCardIndex = i
      }
    }

    // Move para o card anterior
    const targetIndex = Math.max(0, currentCardIndex - 1)
    const targetCard = cards[targetIndex]

    // Calcula a posição exata do card alvo
    const cardLeft = targetCard.offsetLeft
    container.scrollTo({ left: cardLeft, behavior: 'smooth' })
  }, [])

  const scrollToRight = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const cards = container.querySelectorAll('.flex-shrink-0')

    if (cards.length === 0) return

    // Pega a posição atual do scroll
    const currentScrollLeft = container.scrollLeft

    // Encontra o card que está mais próximo da posição atual
    let currentCardIndex = 0
    let minDistance = Infinity

    for (let i = 0; i < cards.length; i++) {
      const cardLeft = cards[i].offsetLeft
      const distance = Math.abs(cardLeft - currentScrollLeft)

      if (distance < minDistance) {
        minDistance = distance
        currentCardIndex = i
      }
    }

    // Move para o próximo card
    const targetIndex = Math.min(cards.length - 1, currentCardIndex + 1)
    const targetCard = cards[targetIndex]

    // Calcula a posição exata do card alvo
    const cardLeft = targetCard.offsetLeft
    container.scrollTo({ left: cardLeft, behavior: 'smooth' })
  }, [])

  // Nova função para verificar se o container tem scroll
  const checkIfScrollable = useCallback(() => {
    if (!containerRef.current) return

    const { scrollWidth, clientWidth } = containerRef.current
    const hasScroll = scrollWidth > clientWidth
    setIsScrollable(hasScroll)
  }, [])

  // Effect para detectar mudanças no scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => checkScrollProgress()
    container.addEventListener('scroll', handleScroll)

    // Check inicial
    checkScrollProgress()
    checkIfScrollable() // Verifica se é scrollable

    return () => container.removeEventListener('scroll', handleScroll)
  }, [checkScrollProgress, checkIfScrollable])

  // Novo effect para detectar mudanças no tamanho da janela
  useEffect(() => {
    const handleResize = () => {
      checkIfScrollable()
      checkScrollProgress()
    }

    window.addEventListener('resize', handleResize)

    // Check inicial após um pequeno delay para garantir que o DOM foi renderizado
    const timeoutId = setTimeout(checkIfScrollable, 100)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [checkIfScrollable, checkScrollProgress, properties.length])

  const commands = {
    next: () => viewModel.next(),
    previous: () => viewModel.previous(),
    goToSlide: (index) => viewModel.goToSlide(index),
    scrollToLeft,
    scrollToRight,
  }

  return {
    // Refs
    containerRef,

    // Estado
    scrollProgress,
    isScrollable, // Novo retorno

    // Dados
    properties: viewModel.getOriginalItems(),
    currentRealIndex: viewModel.getCurrentRealIndex(),
    totalItems: viewModel.getTotalOriginalItems(),

    // Commands
    ...commands,

    // Utilities
    checkScrollProgress,
  }
}

export { PropertiesCarouselViewModel }
