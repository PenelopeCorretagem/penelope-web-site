/**
 * SelectModel - Gerencia dados e validações do Select
 */
export class SelectModel {
  constructor({
    value = '',
    name = 'filtro',
    id = 'select_filter',
    options = [],
    width = 'fit',
    variant = 'default',
    shape = 'square',
    disabled = false,
    required = false,
    placeholder = 'Selecione...',
  } = {}) {
    this.value = String(value)
    this.name = String(name)
    this.id = String(id)
    this.options = this.normalizeOptions(options)
    this.width = this.validateWidth(width)
    this.variant = this.validateVariant(variant)
    this.shape = this.validateShape(shape)
    this.disabled = Boolean(disabled)
    this.required = Boolean(required)
    this.placeholder = String(placeholder)
    this.errors = []
  }

  static VALID_WIDTHS = ['full', 'fit']
  static VALID_VARIANTS = ['default', 'pink', 'destac', 'brown']
  static VALID_SHAPES = ['square', 'circle']

  normalizeOptions(options) {
    if (!Array.isArray(options)) return []
    return options.map(opt =>
      typeof opt === 'object' && 'value' in opt
        ? { label: String(opt.label || opt.value), value: opt.value }
        : { label: String(opt).toUpperCase(), value: opt }
    )
  }

  validateWidth(width) {
    return SelectModel.VALID_WIDTHS.includes(width) ? width : 'fit'
  }

  validateVariant(variant) {
    return SelectModel.VALID_VARIANTS.includes(variant) ? variant : 'default'
  }

  validateShape(shape) {
    return SelectModel.VALID_SHAPES.includes(shape) ? shape : 'square'
  }

  // Getters
  get hasValue() {
    return Boolean(this.value)
  }

  get isEmpty() {
    return !this.hasValue
  }

  get selectedOption() {
    return this.options.find(opt => opt.value === this.value) || null
  }

  get displayValue() {
    return this.selectedOption ? this.selectedOption.label : this.placeholder
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  get isValid() {
    return !this.required || this.hasValue
  }

  // Métodos de atualização
  updateValue(newValue) {
    const stringValue = String(newValue || '')
    if (stringValue !== this.value) {
      this.value = stringValue
      this.clearErrors()
      return true
    }
    return false
  }

  updateOptions(newOptions) {
    const normalized = this.normalizeOptions(newOptions)
    if (JSON.stringify(normalized) !== JSON.stringify(this.options)) {
      this.options = normalized
      // Se o valor atual não existe mais nas opções, limpar
      if (this.hasValue && !this.options.find(opt => opt.value === this.value)) {
        this.value = ''
      }
      return true
    }
    return false
  }

  clear() {
    if (this.value !== '') {
      this.value = ''
      this.clearErrors()
      return true
    }
    return false
  }

  // Validação e erros
  validate() {
    this.clearErrors()
    if (this.required && this.isEmpty) {
      this.addError('Este campo é obrigatório')
    }
    return !this.hasErrors
  }

  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }

  // Utilitários
  toJSON() {
    return {
      value: this.value,
      name: this.name,
      id: this.id,
      options: this.options,
      width: this.width,
      variant: this.variant,
      shape: this.shape,
      disabled: this.disabled,
      required: this.required,
      placeholder: this.placeholder,
      hasValue: this.hasValue,
      isEmpty: this.isEmpty,
      selectedOption: this.selectedOption,
      displayValue: this.displayValue,
      hasErrors: this.hasErrors,
      errorMessages: this.errorMessages,
      isValid: this.isValid,
    }
  }
}
