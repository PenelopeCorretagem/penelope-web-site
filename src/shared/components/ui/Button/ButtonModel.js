export class ButtonModel {
  static COLORS = ['pink', 'brown', 'white', 'border-white', 'soft-brown', 'gray', 'transparent']
  static TYPES = ['button', 'submit', 'reset', 'link']

  constructor(text = '', color = 'pink', type = 'button', to = null, action = null, fullWidth = false) {
    this.text = text
    this.color = color
    this.type = type
    this.to = to
    this.action = action     // ✅ adiciona a ação
    this.fullWidth = fullWidth // ✅ adiciona fullWidth
    this.active = false
  }

  /* ===== Validations ===== */

  isValid() {
    return this.isValidColor() && this.isValidType() && this.hasValidRoute()
  }

  isValidColor() {
    return ButtonModel.COLORS.includes(this.color)
  }

  isValidType() {
    return ButtonModel.TYPES.includes(this.type)
  }

  hasValidRoute() {
    return this.isLink() ? !!this.to : true
  }

  isLink() {
    return this.type === 'link'
  }

  /* ===== Mutations ===== */

  updateColor(newColor) {
    if (!ButtonModel.COLORS.includes(newColor)) {
      throw new Error(`Invalid color: ${newColor}`)
    }
    this.color = newColor
  }

  updateText(newText) {
    this.text = newText
  }

  setType(newType) {
    if (!ButtonModel.TYPES.includes(newType)) {
      throw new Error(`Invalid type: ${newType}`)
    }
    this.type = newType
  }

  setTo(newTo) {
    this.to = newTo
  }

  toggle() {
    this.active = !this.active
    return this.active
  }
}
