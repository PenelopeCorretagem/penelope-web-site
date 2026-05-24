import { useState, useCallback, useRef } from 'react'
import { FormModel } from '@shared/components/ui/Form/FormModel'

// Classes Tailwind diretas para Form
const FORM_CONTAINER_CLASSES = 'w-full flex flex-col gap-6 items-center'
const FORM_TITLE_CLASSES = 'text-center text-distac-primary'
const FORM_SUBTITLE_CLASSES = 'text-center text-default-dark-muted'
const FORM_FIELD_CONTAINER_CLASSES = 'w-full'
const FORM_ERROR_CONTAINER_CLASSES = 'w-full'
const FORM_SUCCESS_CONTAINER_CLASSES = 'w-full p-4 bg-green-100 border border-green-400 text-green-700 rounded'
const FORM_FOOTER_CLASSES = 'w-full text-center'
const FORM_SUBMIT_BUTTON_LOADING = 'opacity-50 cursor-not-allowed'
const FORM_SUBMIT_BUTTON_NORMAL = ''

/**
 * FormViewModel - Gerencia a lógica e apresentação do Form usando classes Tailwind diretas
 */
class FormViewModel {
  constructor(model = new FormModel(), options = {}) {
    this.model = model
    this.controlledLoading = Boolean(options.controlledLoading)
  }

  // Getters de dados
  get title() {
    return this.model.title
  }

  get subtitle() {
    return this.model.subtitle
  }

  get fields() {
    return this.model.fields
  }

  get submitText() {
    return this.model.submitText
  }

  get submitWidth() {
    return this.model.submitWidth
  }

  get errorMessages() {
    return this.model.errorMessages
  }

  get successMessage() {
    return this.model.successMessage
  }

  get isLoading() {
    return this.model.isLoading
  }

  get footerContent() {
    return this.model.footerContent
  }

  get fieldValues() {
    return this.model.fieldValues
  }

  get fieldErrors() {
    return this.model.fieldErrors
  }

  get hasTitle() {
    return this.model.hasTitle
  }

  get hasSubtitle() {
    return this.model.hasSubtitle
  }

  get hasErrors() {
    return this.model.hasErrors
  }

  get hasSuccess() {
    return this.model.hasSuccess
  }

  get hasFooter() {
    return this.model.hasFooter
  }

  get isValid() {
    return this.model.isValid
  }

  get canSubmit() {
    return this.model.canSubmit
  }

  get formData() {
    return this.model.formData
  }

  // Lógica de CSS usando classes Tailwind diretas
  getFormClasses(className = '') {
    return `${FORM_CONTAINER_CLASSES} ${className}`.trim()
  }

  getTitleClasses(className = '') {
    return `${FORM_TITLE_CLASSES} ${className}`.trim()
  }

  getSubtitleClasses(className = '') {
    return `${FORM_SUBTITLE_CLASSES} ${className}`.trim()
  }

  getFieldContainerClasses(className = '') {
    return `${FORM_FIELD_CONTAINER_CLASSES} ${className}`.trim()
  }

  getErrorContainerClasses(className = '') {
    return `${FORM_ERROR_CONTAINER_CLASSES} ${className}`.trim()
  }

  getSuccessContainerClasses(className = '') {
    return `${FORM_SUCCESS_CONTAINER_CLASSES} ${className}`.trim()
  }

  getSubmitButtonClasses(className = '') {
    const stateClasses = this.isLoading ? FORM_SUBMIT_BUTTON_LOADING : FORM_SUBMIT_BUTTON_NORMAL
    return `${stateClasses} ${className}`.trim()
  }

  getFooterClasses(className = '') {
    return `${FORM_FOOTER_CLASSES} ${className}`.trim()
  }

  // Métodos de ação
  updateFieldValue = (fieldName, value) => {
    return this.model.updateFieldValue(fieldName, value)
  }

  updateTitle = (newTitle) => {
    return this.model.updateTitle(newTitle)
  }

  updateSubtitle = (newSubtitle) => {
    return this.model.updateSubtitle(newSubtitle)
  }

  setLoading = (loading) => {
    return this.model.setLoading(loading)
  }

  setErrors = (errors) => {
    return this.model.setErrors(errors)
  }

  clearErrors = () => {
    return this.model.clearErrors()
  }

  setSuccess = (message) => {
    return this.model.setSuccess(message)
  }

  clearSuccess = () => {
    return this.model.clearSuccess()
  }

  reset = () => {
    return this.model.reset()
  }

  validateForm = () => {
    return this.model.validateForm()
  }

  // Event handlers
  handleFieldChange = (fieldName) => (value) => {
    this.updateFieldValue(fieldName, value)
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    // Validação completa apenas no submit
    if (!this.validateForm()) {
      return false
    }

    this.setLoading(true)
    this.clearErrors()
    this.clearSuccess()

    try {
      if (this.model.onSubmit) {
        const result = await this.model.onSubmit(this.formData, this.model)

        if (result && result.success) {
          const successMessage = typeof result.message === 'string'
            ? result.message.trim()
            : ''

          if (successMessage) {
            this.setSuccess(successMessage)
          }

          if (result.reset) {
            this.reset()
          }
        } else if (result && result.error) {
          this.setErrors(result.error)
        }

        return result
      }
    } catch (error) {
      this.setErrors(error.message || 'Erro inesperado')
      return { success: false, error: error.message }
    } finally {
      if (!this.controlledLoading) {
        this.setLoading(false)
      }
    }
  }

  // Métodos utilitários
  getFieldValue(fieldName) {
    return this.fieldValues[fieldName] || ''
  }

  getFieldError(fieldName) {
    return this.fieldErrors[fieldName] || ''
  }

  hasFieldError(fieldName) {
    return Boolean(this.fieldErrors[fieldName])
  }

  getState() {
    return {
      ...this.model.toJSON(),
      classes: {
        form: this.formClasses,
        title: this.titleClasses,
        subtitle: this.subtitleClasses,
        fieldContainer: this.fieldContainerClasses,
        errorContainer: this.errorContainerClasses,
        successContainer: this.successContainerClasses,
        submitButton: this.submitButtonClasses,
        footer: this.footerClasses,
      }
    }
  }
}

/**
 * Hook para gerenciar estado e interações do Form
 * Factory Pattern - cria o modelo internamente
 */
export function useFormViewModel(initialProps = {}) {
  const controlledLoading = Boolean(initialProps.controlledLoading)

  const [viewModel] = useState(() => {
    const model = new FormModel(initialProps)
    return new FormViewModel(model, { controlledLoading })
  })

  const [, forceUpdate] = useState(0)
  const debouncedValidatorsRef = useRef({})

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const updateFieldValue = useCallback((fieldName, value) => {
    const success = viewModel.updateFieldValue(fieldName, value)
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const updateTitle = useCallback((title) => {
    const success = viewModel.updateTitle(title)
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const updateSubtitle = useCallback((subtitle) => {
    const success = viewModel.updateSubtitle(subtitle)
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const setLoading = useCallback((loading) => {
    const success = viewModel.setLoading(loading)
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const setErrors = useCallback((errors) => {
    const success = viewModel.setErrors(errors)
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const clearErrors = useCallback(() => {
    const success = viewModel.clearErrors()
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const setSuccess = useCallback((message) => {
    const success = viewModel.setSuccess(message)
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const clearSuccess = useCallback(() => {
    const success = viewModel.clearSuccess()
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const reset = useCallback(() => {
    const success = viewModel.reset()
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  const validateForm = useCallback(() => {
    const isValid = viewModel.validateForm()
    refresh()
    return isValid
  }, [viewModel, refresh])

  const scheduleFieldValidation = useCallback((fieldName, value, delay = 600) => {
    if (debouncedValidatorsRef.current[fieldName]) {
      clearTimeout(debouncedValidatorsRef.current[fieldName])
    }

    debouncedValidatorsRef.current[fieldName] = setTimeout(() => {
      const field = viewModel.fields.find(f => f.name === fieldName)
      if (!field || !field.validate) {
        return
      }

      const validationResult = field.validate(value, viewModel.formData)
      if (validationResult !== true) {
        viewModel.model.fieldErrors[fieldName] = validationResult
      } else {
        delete viewModel.model.fieldErrors[fieldName]
      }

      refresh()
    }, delay)
  }, [viewModel, refresh])

  // Event handlers que incluem refresh
  const handleFieldChange = useCallback((fieldName) => (value) => {
    const field = viewModel.fields.find(f => f.name === fieldName)
    const shouldDebounce = field && (field.type === 'password' || field.debounceValidation)

    // Atualizar valor do campo imediatamente
    viewModel.handleFieldChange(fieldName)(value)
    refresh()

    // Se o campo precisa debounce, validar com atraso
    if (shouldDebounce && field.validate) {
      const delay = field.debounceDelay ?? 600
      scheduleFieldValidation(fieldName, value, delay)
    }

    // Revalidar campos dependentes (por exemplo, confirmação de senha) após mudança de senha.
    if (fieldName === 'senha') {
      const confirmField = viewModel.fields.find(f => f.name === 'confirmSenha')
      if (confirmField && confirmField.validate) {
        const confirmValue = viewModel.fieldValues.confirmSenha
        scheduleFieldValidation('confirmSenha', confirmValue)
      }
    }
  }, [viewModel, refresh, scheduleFieldValidation])

  const handleSubmit = useCallback(async (event) => {
    const result = await viewModel.handleSubmit(event)
    refresh()
    return result
  }, [viewModel, refresh])

  return {
    // Data
    title: viewModel.title,
    subtitle: viewModel.subtitle,
    fields: viewModel.fields,
    submitText: viewModel.submitText,
    submitWidth: viewModel.submitWidth,
    errorMessages: viewModel.errorMessages,
    successMessage: viewModel.successMessage,
    isLoading: viewModel.isLoading,
    footerContent: viewModel.footerContent,
    fieldValues: viewModel.fieldValues,
    fieldErrors: viewModel.fieldErrors,
    hasTitle: viewModel.hasTitle,
    hasSubtitle: viewModel.hasSubtitle,
    hasErrors: viewModel.hasErrors,
    hasSuccess: viewModel.hasSuccess,
    hasFooter: viewModel.hasFooter,
    isValid: viewModel.isValid,
    formData: viewModel.formData,

    // CSS Classes usando theme.js
    formClasses: viewModel.getFormClasses(),
    titleClasses: viewModel.getTitleClasses(),
    subtitleClasses: viewModel.getSubtitleClasses(),
    fieldContainerClasses: viewModel.getFieldContainerClasses(),
    errorContainerClasses: viewModel.getErrorContainerClasses(),
    successContainerClasses: viewModel.getSuccessContainerClasses(),
    submitButtonClasses: viewModel.getSubmitButtonClasses(),
    footerClasses: viewModel.getFooterClasses(),

    // Event Handlers
    handleFieldChange,
    handleSubmit,

    // Commands
    updateFieldValue,
    updateTitle,
    updateSubtitle,
    setLoading,
    setErrors,
    clearErrors,
    setSuccess,
    clearSuccess,
    reset,
    validateForm,

    // Submission state
    canSubmit: viewModel.canSubmit,

    // Utilities
    getFieldValue: viewModel.getFieldValue.bind(viewModel),
    getFieldError: viewModel.getFieldError.bind(viewModel),
    hasFieldError: viewModel.hasFieldError.bind(viewModel),
    getState: viewModel.getState.bind(viewModel),
  }
}

export { FormViewModel }
