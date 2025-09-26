/**
 * ButtonModel - Gerencia estado e comportamento de botões
 * Controla texto, variantes, tipos e estados
 * Implementa validações e toggles de estado
 */
export class ButtonModel {
  constructor(text = '', variant = 'pink', type = 'button') {
    this.text = text
    this.variant = variant
    this.type = type
    this.active = false
    this.disabled = false
    this.transition = false
  }

  static VARIANTS = ['pink', 'brown', 'white']
  static TYPES = ['button', 'submit', 'reset']

  isValid() {
    return this.isValidVariant() && this.isValidType()
  }

  isValidVariant() {
    return ButtonModel.VARIANTS.includes(this.variant)
  }

  isValidType() {
    return ButtonModel.TYPES.includes(this.type)
  }

  updateVariant(newVariant) {
    if (!ButtonModel.VARIANTS.includes(newVariant)) {
      throw new Error(
        `Invalid variant. Must be one of: ${ButtonModel.VARIANTS.join(', ')}`
      )
    }
    this.variant = newVariant
  }

  toggle() {
    this.active = !this.active
  }

  setDisabled(disabled) {
    this.disabled = disabled
  }
}
