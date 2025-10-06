// MenuItemViewModel.js
import { MenuItemModel } from '@shared/model/components/MenuItemModel'

/**
 * MenuItemViewModel - Gerencia a lógica e apresentação de itens do menu
 * Estende BaseElementViewModel para funcionalidades base de elementos UI
 */
export class MenuItemViewModel {
  constructor(model = new MenuItemModel(), { onClick } = {}) {
    this.model = model
    this.onClick = onClick
    this.errors = []
  }

  // Getters de dados
  get text() {
    return this.model.text
  }

  get variant() {
    return this.model.variant
  }

  get active() {
    return this.model.active
  }

  get href() {
    return this.model.href
  }

  get icon() {
    return this.model.icon
  }

  get iconOnly() {
    return this.model.iconOnly
  }

  get to() {
    return this.model.to
  }

  get external() {
    return this.model.external
  }

  get disabled() {
    return this.model.disabled
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

  get componentType() {
    if (this.model.isInternalLink()) return 'router-link'
    if (this.model.href) return 'a'
    return 'button'
  }

  // Métodos de lógica
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

  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }
}
