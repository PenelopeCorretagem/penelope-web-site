/**
 * LabelModel - Gerencia texto e variante do label
 */
export class LabelModel {
  constructor(text = '', variant = 'pink') {
    this.text = text
    this.variant = variant
  }

  static VARIANTS = ['pink', 'softPink', 'brown', 'softBrown', 'gray']

  hasText() {
    return typeof this.text === 'string' && this.text.trim().length > 0
  }

  isValidVariant() {
    return LabelModel.VARIANTS.includes(this.variant)
  }

  updateText(newText) {
    this.text = String(newText || '')
  }

  updateVariant(newVariant) {
    if (LabelModel.VARIANTS.includes(newVariant)) {
      this.variant = newVariant
    }
  }
}
