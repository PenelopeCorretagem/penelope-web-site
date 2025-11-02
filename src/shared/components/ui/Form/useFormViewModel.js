import { useState, useCallback } from 'react'
import { FormModel } from '@shared/components/ui/Form/FormModel'
import {
  getFormThemeClasses,
  getFormTitleThemeClasses,
  getFormSubtitleThemeClasses,
  getFormFieldContainerThemeClasses,
  getFormErrorContainerThemeClasses,
  getFormSuccessContainerThemeClasses,
  getFormSubmitButtonThemeClasses,
  getFormFooterThemeClasses
} from '@shared/styles/theme'

/**
 * FormViewModel - Gerencia a lógica e apresentação do Form usando theme design-model
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

  // Lógica de CSS usando theme.js
  getFormClasses(className = '') {
    return getFormThemeClasses({
      hasErrors: this.hasErrors,
      isLoading: this.isLoading,
      className
    })
  }

  getTitleClasses(className = '') {
    return getFormTitleThemeClasses({
      hasTitle: this.hasTitle,
      className
    })
  }

  getSubtitleClasses(className = '') {
    return getFormSubtitleThemeClasses({
      hasSubtitle: this.hasSubtitle,
      className
    })
  }

  getFieldContainerClasses(className = '') {
    return getFormFieldContainerThemeClasses({
      className
    })
  }

  getErrorContainerClasses(className = '') {
    return getFormErrorContainerThemeClasses({
      hasErrors: this.hasErrors,
      className
    })
  }

  getSuccessContainerClasses(className = '') {
    return getFormSuccessContainerThemeClasses({
      hasSuccess: this.hasSuccess,
      className
    })
  }

  getSubmitButtonClasses(className = '') {
    return getFormSubmitButtonThemeClasses({
      isLoading: this.isLoading,
      isValid: this.isValid,
      submitWidth: this.submitWidth,
      className
    })
  }

  getFooterClasses(className = '') {
    return getFormFooterThemeClasses({
      hasFooter: this.hasFooter,
      className
    })
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
    ...commands,

    // Utilities
    getFieldValue: viewModel.getFieldValue.bind(viewModel),
    getFieldError: viewModel.getFieldError.bind(viewModel),
    hasFieldError: viewModel.hasFieldError.bind(viewModel),
    getState: viewModel.getState.bind(viewModel),
  }
}

export { FormViewModel }
