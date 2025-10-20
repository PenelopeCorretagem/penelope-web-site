/**
 * ButtonModel - Gerencia estado e comportamento de botões
 */
export class ButtonModel {
  constructor(text = '', color = 'pink', type = 'button', to = null) {
    this.text = text
    this.color = color
    this.type = type
    this.to = to
    this.active = false
    this.disabled = false
  }

  static COLORS = ['pink', 'brown', 'white', 'black']

  isLink() {
    return this.type === 'link'
  }

  isValidColor() {
    return ButtonModel.COLORS.includes(this.color)
  }

  updateColor(newColor) {
    if (!ButtonModel.COLORS.includes(newColor)) {
      throw new Error(`Invalid color. Must be one of: ${ButtonModel.COLORS.join(', ')}`)
    }
    this.color = newColor
  }

  toggle() {
    this.active = !this.active
  }

  setDisabled(disabled) {
    this.disabled = disabled
  }
}
