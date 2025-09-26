/**
 * LabelModel - Gerencia estado e validações de labels
 * Controla texto, variantes visuais e tamanhos
 * Implementa validações de estado
 */
export class LabelModel {
  constructor(text = '', variant = 'pink', size = 'medium') {
    this.text = text
    this.variant = variant
    this.size = size
  }

  static VARIANTS = ['pink', 'softPink', 'brown', 'softBrown', 'gray']
  static SIZES = ['small', 'medium', 'large']

  isValid() {
    return this.isValidVariant() && this.isValidSize() && this.hasText()
  }

  isValidVariant() {
    return LabelModel.VARIANTS.includes(this.variant)
  }

  isValidSize() {
    return LabelModel.SIZES.includes(this.size)
  }

  hasText() {
    return typeof this.text === 'string' && this.text.trim().length > 0
  }

  updateText(newText) {
    if (typeof newText !== 'string') {
      throw new Error('Text must be a string')
    }
    this.text = newText
  }

  updateVariant(newVariant) {
    if (!LabelModel.VARIANTS.includes(newVariant)) {
      throw new Error(
        `Invalid variant. Must be one of: ${LabelModel.VARIANTS.join(', ')}`
      )
    }
    this.variant = newVariant
  }
}
