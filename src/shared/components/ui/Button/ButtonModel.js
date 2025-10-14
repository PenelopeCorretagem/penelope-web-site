/**
 * ButtonModel - Gerencia estado e comportamento de botões
 * Controla texto, variantes, tipos e estados
 * Implementa validações e toggles de estado
 */
export class ButtonModel {
  constructor(text = '', variant = 'pink', type = 'button', to = null) {
    this.text = text
    this.variant = variant
    this.type = type
    this.to = to // URL para navegação quando type é 'link'
    this.active = false
    this.disabled = false
    this.transition = false
  }

  static VARIANTS = ['pink', 'brown', 'white', 'gray', 'border-white', 'soft-brown']
  static TYPES = ['button', 'submit', 'reset', 'link']


  isValid() {
    return this.isValidVariant() && this.isValidType() && this.hasValidRoute()
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

  updateText(newText) {
    this.text = newText
  }

  setType(newType) {
    if (!ButtonModel.TYPES.includes(newType)) {
      throw new Error(
        `Invalid type. Must be one of: ${ButtonModel.TYPES.join(', ')}`
      )
    }
    this.type = newType
  }

  setTo(newTo) {
    this.to = newTo
  }

  isLink() {
    return this.type === 'link'
  }

  hasValidRoute() {
    return this.isLink() ? Boolean(this.to) : true
  }

  toggle() {
    this.active = !this.active
  }

  setDisabled(disabled) {
    this.disabled = disabled
  }
}
