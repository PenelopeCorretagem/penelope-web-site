import { ButtonModel } from '../../model/components/ButtonModel'

/**
 * ButtonViewModel - Gerencia a lógica e apresentação de botões
 * Estende BaseElementViewModel para funcionalidades base de UI
 */
export class ButtonViewModel {
  constructor(model = new ButtonModel(), { onClick } = {}) {
    this.model = model
    this.onClick = onClick
    this.errors = []
  }

  // ✅ Getters de dados (sem CSS)
  get text() {
    return this.model.text
  }

  get variant() {
    return this.model.variant
  }

  get type() {
    return this.model.type
  }

  get active() {
    return this.model.active
  }

  get disabled() {
    return this.model.disabled
  }

  get transition() {
    return this.model.transition
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  get isValid() {
    return this.model.isValid()
  }

  get canClick() {
    return !this.disabled && !this.hasErrors
  }

  handleClick = event => {
    if (!this.canClick) return

    if (this.onClick) {
      this.onClick(event, this.model)
    }
  }

  toggle = () => {
    if (!this.canClick) return false

    this.model.toggle()
    return true
  }

  updateVariant = newVariant => {
    try {
      this.model.updateVariant(newVariant)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  updateText = newText => {
    try {
      this.model.updateText(newText)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  setDisabled = disabled => {
    this.model.setDisabled(disabled)
  }

  setType = newType => {
    try {
      this.model.setType(newType)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }
}
