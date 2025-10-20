/**
 * FormModel - Modelo de dados para formulários
 * Gerencia estado, validação e estrutura de formulários genéricos
 */
export class FormModel {
  constructor({
    title = '',
    subtitle = '',
    fields = [],
    submitText = 'Enviar',
    submitWidth = 'full',
    onSubmit = null,
    errorMessages = [],
    successMessage = '',
    isLoading = false,
    footerContent = null,
  } = {}) {
    this.title = title
    this.subtitle = subtitle
    this.fields = fields
    this.submitText = submitText
    this.submitWidth = submitWidth
    this.onSubmit = onSubmit
    this.errorMessages = errorMessages
    this.successMessage = successMessage
    this.isLoading = isLoading
    this.footerContent = footerContent
    this.fieldValues = {}
    this.fieldErrors = {}

    // Inicializa valores dos campos
    this.initializeFieldValues()
  }

  initializeFieldValues() {
    this.fields.forEach(field => {
      this.fieldValues[field.name] = field.defaultValue || ''
    })
  }

  // Getters
  get hasTitle() {
    return Boolean(this.title)
  }

  get hasSubtitle() {
    return Boolean(this.subtitle)
  }

  get hasErrors() {
    return this.errorMessages.length > 0 || Object.keys(this.fieldErrors).length > 0
  }

  get hasSuccess() {
    return Boolean(this.successMessage)
  }

  get hasFooter() {
    return Boolean(this.footerContent)
  }

  get isValid() {
    // Para formulários de auth, não validar campos vazios até que o usuário tente submeter
    // Apenas verifica se não há erros de validação
    const hasValidationErrors = Object.keys(this.fieldErrors).some(key => this.fieldErrors[key])
    const hasGeneralErrors = this.errorMessages.length > 0

    return !hasValidationErrors && !hasGeneralErrors
  }

  get formData() {
    return { ...this.fieldValues }
  }

  // Métodos de validação
  isFieldValid(field) {
    const value = this.fieldValues[field.name]

    // Para validação em tempo real, só valida se o campo não está vazio
    // ou se está sendo validado explicitamente
    if (!value || value.trim() === '') {
      // Só retorna inválido se o campo for obrigatório E estivermos validando no submit
      return true // Permite campos vazios durante digitação
    }

    // Validação por tipo
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    }

    // Validação customizada
    if (field.validate && typeof field.validate === 'function') {
      try {
        return field.validate(value, this.formData)
      } catch (error) {
        return error.message
      }
    }

    return true
  }

  validateField(fieldName) {
    const field = this.fields.find(f => f.name === fieldName)
    if (!field) return true

    const isValid = this.isFieldValid(field)

    if (isValid) {
      delete this.fieldErrors[fieldName]
    } else {
      this.fieldErrors[fieldName] = this.getFieldErrorMessage(field)
    }

    return isValid
  }

  getFieldErrorMessage(field) {
    const value = this.fieldValues[field.name]

    if (field.required && (!value || value.trim() === '')) {
      return field.errorMessage || `${field.label || field.placeholder} é obrigatório`
    }

    if (value && field.type === 'email') {
      return 'Email inválido'
    }

    if (field.validate && typeof field.validate === 'function') {
      try {
        field.validate(value, this.formData)
      } catch (error) {
        return error.message
      }
    }

    return 'Campo inválido'
  }

  validateForm() {
    this.fieldErrors = {}

    this.fields.forEach(field => {
      const value = this.fieldValues[field.name]

      // Validação completa no submit - incluindo campos obrigatórios
      if (field.required && (!value || value.trim() === '')) {
        this.fieldErrors[field.name] = field.errorMessage || `${field.label || field.placeholder} é obrigatório`
      } else if (value && value.trim() !== '') {
        // Só valida formato se o campo não estiver vazio
        if (!this.isFieldValid(field)) {
          this.fieldErrors[field.name] = this.getFieldErrorMessage(field)
        }
      }
    })

    const isValid = Object.keys(this.fieldErrors).length === 0

    return isValid
  }

  // Métodos de atualização
  updateFieldValue(fieldName, value) {
    this.fieldValues[fieldName] = value
    this.validateField(fieldName)
    return true
  }

  updateTitle(newTitle) {
    this.title = newTitle
    return true
  }

  updateSubtitle(newSubtitle) {
    this.subtitle = newSubtitle
    return true
  }

  setLoading(loading) {
    this.isLoading = loading
    return true
  }

  setErrors(errors) {
    this.errorMessages = Array.isArray(errors) ? errors : [errors]
    return true
  }

  clearErrors() {
    this.errorMessages = []
    this.fieldErrors = {}
    return true
  }

  setSuccess(message) {
    this.successMessage = message
    return true
  }

  clearSuccess() {
    this.successMessage = ''
    return true
  }

  reset() {
    this.initializeFieldValues()
    this.clearErrors()
    this.clearSuccess()
    this.setLoading(false)
    return true
  }

  // Serialização
  toJSON() {
    return {
      title: this.title,
      subtitle: this.subtitle,
      fields: this.fields,
      submitText: this.submitText,
      submitWidth: this.submitWidth,
      errorMessages: this.errorMessages,
      successMessage: this.successMessage,
      isLoading: this.isLoading,
      footerContent: this.footerContent,
      fieldValues: this.fieldValues,
      fieldErrors: this.fieldErrors,
      hasTitle: this.hasTitle,
      hasSubtitle: this.hasSubtitle,
      hasErrors: this.hasErrors,
      hasSuccess: this.hasSuccess,
      hasFooter: this.hasFooter,
      isValid: this.isValid,
      formData: this.formData,
    }
  }
}
