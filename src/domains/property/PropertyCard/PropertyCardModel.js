export const PROPERTY_CARD_CATEGORIES = {
  LANCAMENTO: 'LANÇAMENTO',
  DISPONIVEL: 'CONCLUÍDOS',
  EM_OBRAS: 'EM OBRAS',
}

export const PROPERTY_CARD_CATEGORY_CONFIG = {
  [PROPERTY_CARD_CATEGORIES.LANCAMENTO]: {
    label: 'Lançamento',
    variant: 'pink',
    priority: 1
  },
  [PROPERTY_CARD_CATEGORIES.DISPONIVEL]: {
    label: 'Concluído',
    variant: 'brown',
    priority: 2
  },
  [PROPERTY_CARD_CATEGORIES.EM_OBRAS]: {
    label: 'Em Obras',
    variant: 'softBrown',
    priority: 3
  }
}

export const BUTTON_STATES = {
  CONTATO: 'contato',
  GERAL: 'geral',
  SIMPLE: 'simple'
}

export const BUTTON_STATE_CONFIG = {
  [BUTTON_STATES.CONTATO]: {
    buttons: [
      { text: 'Conversar pelo WhatsApp', action: 'whatsapp', variant: 'primary' },
      { text: 'Agendar Visita', action: 'visit', variant: 'brown' }
    ]
  },
  [BUTTON_STATES.GERAL]: {
    buttons: [
      { text: 'Ver Galeria', action: 'gallery', variant: 'primary' },
      { text: 'Ver Planta', action: 'floorplan', variant: 'primary' },
      { text: 'Assistir Vídeo', action: 'video', variant: 'primary', fullWidth: true }
    ]
  },
  [BUTTON_STATES.SIMPLE]: {
    buttons: [
      { text: 'SABER MAIS', action: 'default', variant: 'primary' }
    ]
  }
}

export class PropertyCardModel {
  constructor({
    category,
    title,
    subtitle,
    description,
    differences = [],
    buttonState = 'simple',
    hasLabel = true,
    hasButton = false,
    hasShadow = false,
    hasImage = false,
    hasHoverEffect = false,
    imageUrl = ''
  }) {
    this.validateInputs(category, title, subtitle, description)

    this.category = this.normalizeCategory(category)
    this.title = String(title).trim()
    this.subtitle = String(subtitle).trim()
    this.description = String(description).trim()
    this.differences = this.validateDifferences(differences)
    this.buttonState = this.normalizeButtonState(buttonState)
    this.hasLabel = Boolean(hasLabel)
    this.hasButton = Boolean(hasButton)
    this.hasShadow = Boolean(hasShadow)
    this.hasImage = Boolean(hasImage)
    this.hasHoverEffect = Boolean(hasHoverEffect)
    this.imageUrl = String(imageUrl).trim()
  }

  validateInputs(category, title, subtitle, description) {
    if (!category) throw new Error('Category é obrigatório')
    if (!title) throw new Error('Title é obrigatório')
    if (!subtitle) throw new Error('Subtitle é obrigatório')
    if (!description) throw new Error('Description é obrigatório')
  }

  normalizeCategory(category) {
    const categoryMap = {
      'lancamento': PROPERTY_CARD_CATEGORIES.LANCAMENTO,
      'lançamento': PROPERTY_CARD_CATEGORIES.LANCAMENTO,
      'disponivel': PROPERTY_CARD_CATEGORIES.DISPONIVEL,
      'disponível': PROPERTY_CARD_CATEGORIES.DISPONIVEL,
      'concluido': PROPERTY_CARD_CATEGORIES.DISPONIVEL,
      'concluído': PROPERTY_CARD_CATEGORIES.DISPONIVEL,
      'concluidos': PROPERTY_CARD_CATEGORIES.DISPONIVEL,
      'concluídos': PROPERTY_CARD_CATEGORIES.DISPONIVEL,
      'em_obras': PROPERTY_CARD_CATEGORIES.EM_OBRAS,
      'em obras': PROPERTY_CARD_CATEGORIES.EM_OBRAS,
      'obras': PROPERTY_CARD_CATEGORIES.EM_OBRAS
    }

    const normalizedInput = String(category).toLowerCase().trim()
    const mappedCategory = categoryMap[normalizedInput]

    if (mappedCategory) {
      return mappedCategory
    }

    // Try direct match with constants
    const directMatch = Object.values(PROPERTY_CARD_CATEGORIES).find(
      cat => cat.toLowerCase() === normalizedInput
    )

    if (directMatch) {
      return directMatch
    }

    throw new Error(`Categoria inválida: ${category}. Categorias válidas: lancamento, disponivel, em_obras`)
  }

  normalizeButtonState(buttonState) {
    const stateMap = {
      'contato': BUTTON_STATES.CONTATO,
      'geral': BUTTON_STATES.GERAL,
      'simple': BUTTON_STATES.SIMPLE,
      'simples': BUTTON_STATES.SIMPLE
    }

    const normalizedInput = String(buttonState).toLowerCase().trim()
    const mappedState = stateMap[normalizedInput]

    if (mappedState) {
      return mappedState
    }

    // Try direct match with constants
    const directMatch = Object.values(BUTTON_STATES).find(
      state => state.toLowerCase() === normalizedInput
    )

    return directMatch || BUTTON_STATES.SIMPLE
  }

  validateButtonState(buttonState) {
    return this.normalizeButtonState(buttonState)
  }

  validateDifferences(differences) {
    if (!Array.isArray(differences)) {
      throw new Error('Differences deve ser um array')
    }

    return differences
      .filter(diff => diff && String(diff).trim())
      .map(diff => String(diff).trim())
  }

  get isValid() {
    return this.title.trim().length > 0 &&
           this.subtitle.trim().length > 0 &&
           this.description.trim().length > 0
  }

  get hasValidImage() {
    return this.hasImage && this.imageUrl.trim().length > 0
  }

  get hasValidCategory() {
    return Object.values(PROPERTY_CARD_CATEGORIES).includes(this.category)
  }

  get hasDifferences() {
    return this.differences.length > 0
  }
}
