import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { RouterModel } from '@app/routes/RouterModel'
import { ROUTES } from '@constant/routes'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { ESTATE_TYPES } from '@constant/estateTypes'

const generateRoute = (routeName, param) =>
  RouterModel.getInstance().generateRoute(routeName, param)

export class PropertiesCarouselModel {
  #realEstateAdvertisements = []
  #realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT
  #currentIndex = 0
  #containerRef = null
  #scrollProgress = 0
  #callToActionButton = null
  #titleCarousel = ''
  #titlePassedManually = false

  constructor({
    realEstateAdvertisements = [],
    realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT,
    containerRef = null,
    titleCarousel = ''
  } = {}) {
    this.realEstateAdvertisements = realEstateAdvertisements
    this.realStateCardMode = realStateCardMode
    this.containerRef = containerRef
    this.#callToActionButton = this.#createDefaultCTAButton()
    this.titleCarousel = titleCarousel
  }

  #createDefaultCTAButton() {
    return new ButtonModel(
      'Ver Mais',
      'brown',
      'link',
      generateRoute(ROUTES.PROPERTIES.key, {}),
      'rectangle',
      'Ver Mais'
    )
  }

  #countByEstateType(type) {
    return this.#realEstateAdvertisements.filter(
      ad => ad?.estate?.type === type
    ).length
  }

  #generateAutoTitle() {
    const total = this.#realEstateAdvertisements.length
    if (total === 0) return ''

    const types = [
      ESTATE_TYPES.DISPONIVEL,
      ESTATE_TYPES.LANCAMENTO,
      ESTATE_TYPES.EM_OBRAS
    ]

    for (const type of types) {
      if (this.#countByEstateType(type) === total) return type.friendlyName
    }

    return ''
  }

  // ========================================================================
  // GETTERS E SETTERS
  // ========================================================================

  get realEstateAdvertisements() {
    return this.#realEstateAdvertisements
  }

  set realEstateAdvertisements(value) {
    this.#realEstateAdvertisements = Array.isArray(value) ? value : []
    if (!this.#titlePassedManually) {
      this.#titleCarousel = this.#generateAutoTitle()
    }
  }

  get realStateCardMode() {
    return this.#realStateCardMode
  }

  set realStateCardMode(value) {
    if (!value) {
      this.#realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT
      return
    }

    if (Object.values(REAL_STATE_CARD_MODES).includes(value)) {
      this.#realStateCardMode = value
      return
    }

    this.#realStateCardMode =
      REAL_STATE_CARD_MODES[value] || REAL_STATE_CARD_MODES.DEFAULT
  }

  get containerRef() {
    return this.#containerRef
  }

  set containerRef(value) {
    this.#containerRef = value
  }

  get currentIndex() {
    return this.#currentIndex
  }

  set currentIndex(value) {
    const index = Number(value)
    this.#currentIndex = isNaN(index)
      ? 0
      : Math.min(Math.max(0, index), Math.max(0, this.getRealEstateAdvertisementsLength() - 1))
  }

  get scrollProgress() {
    return this.#scrollProgress
  }

  set scrollProgress(value) {
    const parsed = Number(value)
    this.#scrollProgress = isNaN(parsed)
      ? 0
      : Math.min(100, Math.max(0, parsed))
  }

  get titleCarousel() {
    return this.#titleCarousel
  }

  set titleCarousel(value) {
    const hasValue =
      value !== null &&
      value !== undefined &&
      value !== '' &&
      typeof value === 'string'

    this.#titlePassedManually = hasValue
    this.#titleCarousel = hasValue ? value : this.#generateAutoTitle()
  }

  get callToActionButton() {
    return this.#callToActionButton
  }

  // ========================================================================
  // MÉTODOS AUXILIARES
  // ========================================================================

  getRealEstateAdvertisementsLength() {
    return this.#realEstateAdvertisements.length
  }

  goToNextRealEstateAdvertisement() {
    if (this.#currentIndex < this.getRealEstateAdvertisementsLength() - 1) {
      this.#currentIndex++
    }
  }

  goToPreviousRealEstateAdvertisement() {
    if (this.#currentIndex > 0) {
      this.#currentIndex--
    }
  }

  goToSlide(index) {
    const idx = Number(index)
    if (isNaN(idx)) return
    this.currentIndex = idx
  }

  getCurrentRealIndex() {
    return this.#currentIndex
  }

  getTotalOriginalItems() {
    return this.getRealEstateAdvertisementsLength()
  }

  getOriginalItems() {
    return this.#realEstateAdvertisements
  }

  // ========================================================================
  // SCROLL E NAVEGAÇÃO - VERSÃO CORRIGIDA
  // ========================================================================

  checkScrollProgress = () => {
    const container = this.#containerRef?.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth
    const shadowOffset = 16

    let progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0

    if (scrollLeft >= maxScroll - shadowOffset - 10) progress = 100
    if (scrollLeft <= 10) progress = 0

    this.#scrollProgress = Math.round(progress)
  }

  // ✅ CORREÇÃO 1: Scroll baseado em largura calculada ao invés de buscar elementos
  scrollToLeft = () => {
    const container = this.#containerRef?.current
    if (!container) return

    const { scrollLeft, clientWidth } = container

    // Calcula quanto scrollar (aproximadamente 1 card + gap)
    const scrollAmount = clientWidth * 0.8 // 80% da largura visível

    const targetScroll = Math.max(0, scrollLeft - scrollAmount)

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  scrollToRight = () => {
    const container = this.#containerRef?.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const maxScroll = scrollWidth - clientWidth

    // Calcula quanto scrollar (aproximadamente 1 card + gap)
    const scrollAmount = clientWidth * 0.8 // 80% da largura visível

    const targetScroll = Math.min(maxScroll, scrollLeft + scrollAmount)

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    })
  }

  // ✅ CORREÇÃO 2: Método alternativo que tenta encontrar cards reais
  // Use este se preferir scroll baseado em cards específicos
  scrollToLeftByCard = () => {
    const container = this.#containerRef?.current
    if (!container) return

    const cards = this.#getAllCards()
    if (cards.length === 0) {
      // Fallback para scroll fixo
      this.scrollToLeft()
      return
    }

    const targetCard = this.#getAdjacentCard(-1, cards)
    if (!targetCard) return

    container.scrollTo({
      left: targetCard.offsetLeft - 32, // 32px de padding/margem
      behavior: 'smooth'
    })
  }

  scrollToRightByCard = () => {
    const container = this.#containerRef?.current
    if (!container) return

    const cards = this.#getAllCards()
    if (cards.length === 0) {
      // Fallback para scroll fixo
      this.scrollToRight()
      return
    }

    const targetCard = this.#getAdjacentCard(1, cards)
    if (!targetCard) return

    container.scrollTo({
      left: targetCard.offsetLeft - 32, // 32px de padding/margem
      behavior: 'smooth'
    })
  }

  // ✅ CORREÇÃO 3: Método robusto para encontrar todos os cards
  #getAllCards() {
    const container = this.#containerRef?.current
    if (!container) return []

    // Tenta múltiplos seletores para encontrar os cards
    const selectors = [
      '.flex-shrink-0',
      '[role="group"]',
      '[data-card]',
      '> div > *' // Filhos diretos do container interno
    ]

    for (const selector of selectors) {
      const cards = container.querySelectorAll(selector)
      if (cards.length > 0) {
        return Array.from(cards)
      }
    }

    // Último recurso: pega todos os filhos diretos
    const innerContainer = container.querySelector('div')
    if (innerContainer) {
      return Array.from(innerContainer.children)
    }

    return []
  }

  // ✅ CORREÇÃO 4: Método melhorado para achar card adjacente
  #getAdjacentCard(direction, cards = null) {
    const container = this.#containerRef?.current
    if (!container) return null

    const allCards = cards || this.#getAllCards()
    if (allCards.length === 0) return null

    const currentScrollLeft = container.scrollLeft
    const containerCenter = currentScrollLeft + (container.clientWidth / 2)

    let closestIndex = 0
    let minDistance = Infinity

    // Encontra o card mais próximo do centro da viewport
    for (let i = 0; i < allCards.length; i++) {
      const cardCenter = allCards[i].offsetLeft + (allCards[i].offsetWidth / 2)
      const distance = Math.abs(cardCenter - containerCenter)

      if (distance < minDistance) {
        minDistance = distance
        closestIndex = i
      }
    }

    // Calcula o índice alvo
    const targetIndex = Math.min(
      allCards.length - 1,
      Math.max(0, closestIndex + direction)
    )

    return allCards[targetIndex] || null
  }
}
