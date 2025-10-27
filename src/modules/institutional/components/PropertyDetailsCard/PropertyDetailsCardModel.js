import { EPropertyCardCategory } from '@domains/property/PropertyCard/EPropertyCardCategory.js'

/**
 * PropertyDetailsCardModel - Modelo de dados para o card de detalhes da propriedade
 * Gerencia estado e validação dos dados do card
 */
export class PropertyDetailsCardModel {
  static DEFAULTS = {
    hasLabel: true,
    category: EPropertyCardCategory.LANCAMENTO,
    title: '',
    subtitle: '',
    description: '',
    hasDifference: false,
    hasButton: false,
    hasShadow: false,
    hasImage: false,
    hasHoverEffect: false,
    imageUrl: '',
    buttonState: 'contato',
  }

  static VALID_BUTTON_STATES = ['contato', 'geral']

  constructor({
    hasLabel = PropertyDetailsCardModel.DEFAULTS.hasLabel,
    category = PropertyDetailsCardModel.DEFAULTS.category,
    title = PropertyDetailsCardModel.DEFAULTS.title,
    subtitle = PropertyDetailsCardModel.DEFAULTS.subtitle,
    description = PropertyDetailsCardModel.DEFAULTS.description,
    hasDifference = PropertyDetailsCardModel.DEFAULTS.hasDifference,
    hasButton = PropertyDetailsCardModel.DEFAULTS.hasButton,
    hasShadow = PropertyDetailsCardModel.DEFAULTS.hasShadow,
    hasImage = PropertyDetailsCardModel.DEFAULTS.hasImage,
    hasHoverEffect = PropertyDetailsCardModel.DEFAULTS.hasHoverEffect,
    imageUrl = PropertyDetailsCardModel.DEFAULTS.imageUrl,
    buttonState = PropertyDetailsCardModel.DEFAULTS.buttonState,
  } = {}) {
    this.hasLabel = Boolean(hasLabel)
    this.category = this.validateCategory(category)
    this.title = String(title || '')
    this.subtitle = String(subtitle || '')
    this.description = String(description || '')
    this.hasDifference = Boolean(hasDifference)
    this.hasButton = Boolean(hasButton)
    this.hasShadow = Boolean(hasShadow)
    this.hasImage = Boolean(hasImage)
    this.hasHoverEffect = Boolean(hasHoverEffect)
    this.imageUrl = String(imageUrl || '')
    this.buttonState = this.validateButtonState(buttonState)
  }

  // Validações
  validateCategory(category) {
    const validCategories = Object.values(EPropertyCardCategory)
    return validCategories.includes(category) ? category : EPropertyCardCategory.LANCAMENTO
  }

  validateButtonState(state) {
    return PropertyDetailsCardModel.VALID_BUTTON_STATES.includes(state)
      ? state
      : PropertyDetailsCardModel.DEFAULTS.buttonState
  }

  // Getters
  get isValid() {
    return (
      this.title.trim().length > 0 &&
      this.subtitle.trim().length > 0 &&
      this.description.trim().length > 0
    )
  }

  get hasValidImage() {
    return this.hasImage && this.imageUrl.trim().length > 0
  }

  get categoryLabel() {
    const labelMap = {
      [EPropertyCardCategory.LANCAMENTO]: {
        text: 'LANÇAMENTO',
        variant: 'pink'
      },
      [EPropertyCardCategory.EM_OBRAS]: {
        text: 'EM OBRAS',
        variant: 'softBrown'
      },
      [EPropertyCardCategory.DISPONIVEL]: {
        text: 'DISPONÍVEL',
        variant: 'brown'
      }
    }
    return labelMap[this.category] || labelMap[EPropertyCardCategory.LANCAMENTO]
  }

  get buttonColor() {
    const colorMap = {
      [EPropertyCardCategory.LANCAMENTO]: 'pink',
      [EPropertyCardCategory.EM_OBRAS]: 'soft-brown',
      [EPropertyCardCategory.DISPONIVEL]: 'brown',
    }
    return colorMap[this.category] || 'pink'
  }

  // Métodos de atualização
  updateTitle(newTitle) {
    const cleanTitle = String(newTitle || '').trim()
    if (cleanTitle !== this.title) {
      this.title = cleanTitle
      return true
    }
    return false
  }

  updateSubtitle(newSubtitle) {
    const cleanSubtitle = String(newSubtitle || '').trim()
    if (cleanSubtitle !== this.subtitle) {
      this.subtitle = cleanSubtitle
      return true
    }
    return false
  }

  updateDescription(newDescription) {
    const cleanDescription = String(newDescription || '').trim()
    if (cleanDescription !== this.description) {
      this.description = cleanDescription
      return true
    }
    return false
  }

  updateCategory(newCategory) {
    const validatedCategory = this.validateCategory(newCategory)
    if (validatedCategory !== this.category) {
      this.category = validatedCategory
      return true
    }
    return false
  }

  updateImageUrl(newImageUrl) {
    const cleanImageUrl = String(newImageUrl || '').trim()
    if (cleanImageUrl !== this.imageUrl) {
      this.imageUrl = cleanImageUrl
      return true
    }
    return false
  }

  updateButtonState(newButtonState) {
    const validatedButtonState = this.validateButtonState(newButtonState)
    if (validatedButtonState !== this.buttonState) {
      this.buttonState = validatedButtonState
      return true
    }
    return false
  }

  // Métodos utilitários
  toJSON() {
    return {
      hasLabel: this.hasLabel,
      category: this.category,
      title: this.title,
      subtitle: this.subtitle,
      description: this.description,
      hasDifference: this.hasDifference,
      hasButton: this.hasButton,
      hasShadow: this.hasShadow,
      hasImage: this.hasImage,
      hasHoverEffect: this.hasHoverEffect,
      imageUrl: this.imageUrl,
      buttonState: this.buttonState,
      isValid: this.isValid,
      hasValidImage: this.hasValidImage,
      categoryLabel: this.categoryLabel,
      buttonColor: this.buttonColor,
    }
  }

  clone() {
    return new PropertyDetailsCardModel({
      hasLabel: this.hasLabel,
      category: this.category,
      title: this.title,
      subtitle: this.subtitle,
      description: this.description,
      hasDifference: this.hasDifference,
      hasButton: this.hasButton,
      hasShadow: this.hasShadow,
      hasImage: this.hasImage,
      hasHoverEffect: this.hasHoverEffect,
      imageUrl: this.imageUrl,
      buttonState: this.buttonState,
    })
  }

  equals(other) {
    if (!(other instanceof PropertyDetailsCardModel)) return false

    return (
      this.hasLabel === other.hasLabel &&
      this.category === other.category &&
      this.title === other.title &&
      this.subtitle === other.subtitle &&
      this.description === other.description &&
      this.hasDifference === other.hasDifference &&
      this.hasButton === other.hasButton &&
      this.hasShadow === other.hasShadow &&
      this.hasImage === other.hasImage &&
      this.hasHoverEffect === other.hasHoverEffect &&
      this.imageUrl === other.imageUrl &&
      this.buttonState === other.buttonState
    )
  }
}
