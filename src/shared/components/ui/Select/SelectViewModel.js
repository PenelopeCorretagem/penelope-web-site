import { SelectModel } from './SelectModel'

/**
 * SelectViewModel - Gerencia lógica de negócio e estado do Select
 */
export class SelectViewModel {
  constructor(initialProps = {}) {
    this.model = new SelectModel(initialProps)
    this.isOpen = false
  }

  // Getters que delegam para o model
  get value() { return this.model.value }
  get name() { return this.model.name }
  get id() { return this.model.id }
  get options() { return this.model.options }
  get width() { return this.model.width }
  get variant() { return this.model.variant }
  get shape() { return this.model.shape }
  get disabled() { return this.model.disabled }
  get required() { return this.model.required }
  get placeholder() { return this.model.placeholder }
  get hasValue() { return this.model.hasValue }
  get isEmpty() { return this.model.isEmpty }
  get selectedOption() { return this.model.selectedOption }
  get displayValue() { return this.model.displayValue }
  get hasErrors() { return this.model.hasErrors }
  get errorMessages() { return this.model.errorMessages }
  get isValid() { return this.model.isValid }
  get isEditable() { return !this.model.disabled }

  // Métodos de controle de estado
  setOpen(open) {
    if (this.disabled) return false
    const boolOpen = Boolean(open)
    if (boolOpen !== this.isOpen) {
      this.isOpen = boolOpen
      return true
    }
    return false
  }

  toggleOpen() {
    return this.setOpen(!this.isOpen)
  }

  // Métodos que delegam para o model
  updateValue(newValue) {
    return this.model.updateValue(newValue)
  }

  updateOptions(newOptions) {
    return this.model.updateOptions(newOptions)
  }

  clear() {
    return this.model.clear()
  }

  validate() {
    return this.model.validate()
  }

  // Handlers de eventos
  handleToggle() {
    if (this.isEditable) {
      return this.toggleOpen()
    }
    return false
  }

  handleOptionClick(optionValue) {
    const updated = this.updateValue(optionValue)
    const closed = this.setOpen(false)
    return updated || closed
  }

  handleKeyDown(event) {
    if (!this.isEditable) return false

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        return this.toggleOpen()
      case 'Escape':
        return this.setOpen(false)
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        return this.isOpen ? false : this.setOpen(true)
      default:
        return false
    }
  }

  // Utilitários
  getState() {
    return {
      ...this.model.toJSON(),
      isOpen: this.isOpen,
    }
  }
}
