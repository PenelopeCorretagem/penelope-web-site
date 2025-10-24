import { useState, useCallback } from 'react'
import { FormModel } from '@shared/components/ui/Form/FormModel'

/**
 * FormViewModel - Gerencia a lógica e apresentação do Form
 * Centraliza a lógica de CSS e comportamento de formulários
 */
class FormViewModel {
  constructor(model = new FormModel()) {
    this.model = model
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

  get formData() {
    return this.model.formData
  }

  // Lógica de CSS - centralizada no ViewModel
  get formClasses() {
    return 'w-full flex flex-col gap-6 items-center'
  }

  get titleClasses() {
    return 'text-center text-brand-pink'
  }

  get subtitleClasses() {
    return 'text-center text-brand-dark-gray'
  }

  get fieldContainerClasses() {
    return 'w-full'
  }

  get errorContainerClasses() {
    return 'w-full'
  }

  get successContainerClasses() {
    return 'w-full p-4 bg-green-100 border border-green-400 text-green-700 rounded'
  }

  get submitButtonClasses() {
    return this.isLoading ? 'opacity-50 cursor-not-allowed' : ''
  }

  get footerClasses() {
    return 'w-full text-center'
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
          this.setSuccess(result.message || 'Operação realizada com sucesso!')
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
      this.setLoading(false)
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
  const [viewModel] = useState(() => {
    const model = new FormModel(initialProps)
    return new FormViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // Commands que incluem refresh
  const commands = {
    updateFieldValue: (fieldName, value) => {
      const success = viewModel.updateFieldValue(fieldName, value)
      if (success) refresh()
      return success
    },

    updateTitle: (title) => {
      const success = viewModel.updateTitle(title)
      if (success) refresh()
      return success
    },

    updateSubtitle: (subtitle) => {
      const success = viewModel.updateSubtitle(subtitle)
      if (success) refresh()
      return success
    },

    setLoading: (loading) => {
      const success = viewModel.setLoading(loading)
      if (success) refresh()
      return success
    },

    setErrors: (errors) => {
      const success = viewModel.setErrors(errors)
      if (success) refresh()
      return success
    },

    clearErrors: () => {
      const success = viewModel.clearErrors()
      if (success) refresh()
      return success
    },

    setSuccess: (message) => {
      const success = viewModel.setSuccess(message)
      if (success) refresh()
      return success
    },

    clearSuccess: () => {
      const success = viewModel.clearSuccess()
      if (success) refresh()
      return success
    },

    reset: () => {
      const success = viewModel.reset()
      if (success) refresh()
      return success
    },

    validateForm: () => {
      const isValid = viewModel.validateForm()
      refresh()
      return isValid
    },
  }

  // Event handlers que incluem refresh
  const handleFieldChange = useCallback((fieldName) => (value) => {
    viewModel.handleFieldChange(fieldName)(value)
    refresh()
  }, [viewModel, refresh])

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

    // CSS Classes
    formClasses: viewModel.formClasses,
    titleClasses: viewModel.titleClasses,
    subtitleClasses: viewModel.subtitleClasses,
    fieldContainerClasses: viewModel.fieldContainerClasses,
    errorContainerClasses: viewModel.errorContainerClasses,
    successContainerClasses: viewModel.successContainerClasses,
    submitButtonClasses: viewModel.submitButtonClasses,
    footerClasses: viewModel.footerClasses,

    // Event Handlers
    handleFieldChange,
    handleSubmit,

    // Commands
    ...commands,

    // Utilities
    getFieldValue: viewModel.getFieldValue.bind(viewModel),
    getFieldError: viewModel.getFieldError.bind(viewModel),
    hasFieldError: viewModel.hasFieldError.bind(viewModel),
    getState: viewModel.getState.bind(viewModel),
  }
}

export { FormViewModel }
