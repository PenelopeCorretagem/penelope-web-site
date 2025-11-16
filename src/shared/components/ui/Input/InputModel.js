/**
 * InputModel - Modelo de dados para o componente Input
 * Gerencia estado e validação de campos de entrada
 */
export class InputModel {
  static DEFAULTS = {
    value: '',
    placeholder: '',
    type: 'text',
    id: '',
    name: '',
    label: '',
    isActive: true,
    hasLabel: true,
    required: false,
    disabled: false,
    readOnly: false,
  }

  constructor({
    value = InputModel.DEFAULTS.value,
    placeholder = InputModel.DEFAULTS.placeholder,
    type = InputModel.DEFAULTS.type,
    id = InputModel.DEFAULTS.id,
    name = InputModel.DEFAULTS.name,
    label = InputModel.DEFAULTS.label,
    isActive = InputModel.DEFAULTS.isActive,
    hasLabel = InputModel.DEFAULTS.hasLabel,
    required = InputModel.DEFAULTS.required,
    disabled = InputModel.DEFAULTS.disabled,
    readOnly = InputModel.DEFAULTS.readOnly,
  } = {}) {
    this.value = String(value || '')
    this.placeholder = String(placeholder || '')
    this.type = this.validateType(type)
    this.id = String(id || '')
    this.name = String(name || id || '')
    this.label = String(label || '')
    this.isActive = Boolean(isActive)
    this.hasLabel = Boolean(hasLabel)
    this.required = Boolean(required)
    this.disabled = Boolean(disabled)
    this.readOnly = Boolean(readOnly)
  }

  static TYPES = ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'checkbox']

  validateType(type) {
    return InputModel.TYPES.includes(type) ? type : InputModel.DEFAULTS.type
  }

  // Getters
  get isValid() {
    return (
      typeof this.value === 'string' &&
      typeof this.placeholder === 'string' &&
      InputModel.TYPES.includes(this.type) &&
      typeof this.id === 'string'
    )
  }

  get hasValue() {
    return Boolean(this.value.trim())
  }

  get isEmpty() {
    return !this.hasValue
  }

  get isEditable() {
    return this.isActive && !this.disabled && !this.readOnly
  }

  get isRequired() {
    return this.required
  }

  get shouldShowLabel() {
    return this.hasLabel && Boolean(this.label.trim())
  }

  // Métodos de atualização
  updateValue(newValue) {
    const stringValue = String(newValue || '')
    if (stringValue !== this.value) {
      this.value = stringValue
      return true
    }
    return false
  }

  updatePlaceholder(newPlaceholder) {
    const stringPlaceholder = String(newPlaceholder || '')
    if (stringPlaceholder !== this.placeholder) {
      this.placeholder = stringPlaceholder
      return true
    }
    return false
  }

  updateType(newType) {
    const validatedType = this.validateType(newType)
    if (validatedType !== this.type) {
      this.type = validatedType
      return true
    }
    return false
  }

  updateLabel(newLabel) {
    const stringLabel = String(newLabel || '')
    if (stringLabel !== this.label) {
      this.label = stringLabel
      return true
    }
    return false
  }

  updateId(newId) {
    const stringId = String(newId || '')
    if (stringId !== this.id) {
      this.id = stringId
      // Se name não foi definido explicitamente, atualiza também
      if (!this.name || this.name === this.id) {
        this.name = stringId
      }
      return true
    }
    return false
  }

  setActive(active) {
    const booleanActive = Boolean(active)
    if (booleanActive !== this.isActive) {
      this.isActive = booleanActive
      return true
    }
    return false
  }

  setDisabled(disabled) {
    const booleanDisabled = Boolean(disabled)
    if (booleanDisabled !== this.disabled) {
      this.disabled = booleanDisabled
      return true
    }
    return false
  }

  setReadOnly(readOnly) {
    const booleanReadOnly = Boolean(readOnly)
    if (booleanReadOnly !== this.readOnly) {
      this.readOnly = booleanReadOnly
      return true
    }
    return false
  }

  setRequired(required) {
    const booleanRequired = Boolean(required)
    if (booleanRequired !== this.required) {
      this.required = booleanRequired
      return true
    }
    return false
  }

  clear() {
    if (this.value !== '') {
      this.value = ''
      return true
    }
    return false
  }

  // Métodos utilitários
  toJSON() {
    return {
      value: this.value,
      placeholder: this.placeholder,
      type: this.type,
      id: this.id,
      name: this.name,
      label: this.label,
      isActive: this.isActive,
      hasLabel: this.hasLabel,
      required: this.required,
      disabled: this.disabled,
      readOnly: this.readOnly,
      hasValue: this.hasValue,
      isEmpty: this.isEmpty,
      isEditable: this.isEditable,
      shouldShowLabel: this.shouldShowLabel,
      isValid: this.isValid,
    }
  }

  clone() {
    return new InputModel({
      value: this.value,
      placeholder: this.placeholder,
      type: this.type,
      id: this.id,
      name: this.name,
      label: this.label,
      isActive: this.isActive,
      hasLabel: this.hasLabel,
      required: this.required,
      disabled: this.disabled,
      readOnly: this.readOnly,
    })
  }

  equals(other) {
    if (!(other instanceof InputModel)) return false

    return (
      this.value === other.value &&
      this.placeholder === other.placeholder &&
      this.type === other.type &&
      this.id === other.id &&
      this.name === other.name &&
      this.label === other.label &&
      this.isActive === other.isActive &&
      this.hasLabel === other.hasLabel &&
      this.required === other.required &&
      this.disabled === other.disabled &&
      this.readOnly === other.readOnly
    )
  }
}
