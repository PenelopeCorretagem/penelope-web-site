import { REAL_STATE_CARD_MODES } from '@constant/realStateCardModes'
import { RouterModel } from '@app/routes/RouterModel'
import { ROUTES } from '@constant/routes'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { ESTATE_TYPES } from '@constant/estateTypes'

const generateRoute = (routeName, param) =>
  RouterModel.getInstance().generateRoute(routeName, param)

/**
 * @summary Model responsável pelo estado e lógica do carrossel de imóveis.
 *
 * - Gerencia anúncios exibidos.
 * - Controla o modo do card, scroll, índice atual e título dinâmico.
 * - Encapsula toda lógica de navegação e cálculo de progresso.
 */
export class PropertiesCarouselModel {
  // Campos privados
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

    // Se não veio título, gera automaticamente
    this.titleCarousel = titleCarousel
  }

  // ========================================================================
  // UTILITÁRIOS PRIVADOS
  // ========================================================================

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

  /**
   * Conta quantos itens possuem um determinado tipo de imóvel.
   */
  #countByEstateType(type) {
    return this.#realEstateAdvertisements.filter(
      ad => ad?.estate?.type === type
    ).length
  }

  /**
   * Gera automaticamente um título baseado no tipo predominante.
   */
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
    // Atualiza título se estiver automático
    if (!this.#titlePassedManually) {
      this.#titleCarousel = this.#generateAutoTitle()
    }
  }

  get realStateCardMode() {
    return this.#realStateCardMode
  }

  set realStateCardMode(value) {
    // aceita string chave ou já o objeto enum; tenta normalizar
    if (!value) {
      this.#realStateCardMode = REAL_STATE_CARD_MODES.DEFAULT
      return
    }

    // se foi passado o objeto (assumindo já mapeado)
    if (Object.values(REAL_STATE_CARD_MODES).includes(value)) {
      this.#realStateCardMode = value
      return
    }

    // se foi passado a chave (string)
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
  // SCROLL E NAVEGAÇÃO
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

  scrollToLeft = () => {
    const container = this.#containerRef?.current
    if (!container) return

    const targetCard = this.#getAdjacentCard(-1)
    if (!targetCard) return

    container.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' })
  }

  scrollToRight = () => {
    const container = this.#containerRef?.current
    if (!container) return

    const targetCard = this.#getAdjacentCard(1)
    if (!targetCard) return

    container.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' })
  }

  // Utilitário central para achar card anterior / próximo
  #getAdjacentCard(direction) {
    const container = this.#containerRef?.current
    if (!container) return null

    const cards = container.querySelectorAll('.flex-shrink-0')
    if (cards.length === 0) return null

    const currentScrollLeft = container.scrollLeft

    let closestIndex = 0
    let minDistance = Infinity

    for (let i = 0; i < cards.length; i++) {
      const distance = Math.abs(cards[i].offsetLeft - currentScrollLeft)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = i
      }
    }

    const targetIndex = Math.min(
      cards.length - 1,
      Math.max(0, closestIndex + direction)
    )

    return cards[targetIndex] || null
  }
}
