import { LabelModel } from '../../model/components/LabelModel'

/**
 * LabelViewModel - Gerencia a lógica e apresentação de labels
 * Estende BaseElementViewModel para funcionalidades base de UI
 */
export class LabelViewModel {
  constructor(model = new LabelModel()) {
    this.model = model
    this.errors = []
  }

  get displayText() {
    return this.model.text || 'Label'
  }

  get variant() {
    return this.model.variant
  }

  get size() {
    return this.model.size
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

  get isEmpty() {
    return !this.model.hasText()
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

  updateSize = newSize => {
    try {
      this.model.updateSize(newSize)
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
