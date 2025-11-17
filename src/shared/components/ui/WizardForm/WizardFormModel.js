/**
 * WizardFormModel - Modelo de dados para formulários em etapas (wizard)
 */
export class WizardFormModel {
  constructor({
    title = '',
    steps = [],
    initialData = {},
    onSubmit = null,
    onDelete = null,
    onClear = null,
  } = {}) {
    this.title = title
    this.steps = steps
    this.currentStep = 0
    this.fieldValues = { ...initialData }
    this.fieldErrors = {}
    this.onSubmit = onSubmit
    this.onDelete = onDelete
    this.onClear = onClear
    this.isLoading = false
    this.errorMessages = []
    this.successMessage = ''
  }

  get totalSteps() {
    return this.steps.length
  }

  get isFirstStep() {
    return this.currentStep === 0
  }

  get isLastStep() {
    return this.currentStep === this.totalSteps - 1
  }

  get currentStepData() {
    return this.steps[this.currentStep] || {}
  }

  get hasErrors() {
    return this.errorMessages.length > 0 || Object.keys(this.fieldErrors).length > 0
  }

  get hasSuccess() {
    return Boolean(this.successMessage)
  }

  get hasDeleteAction() {
    return typeof this.onDelete === 'function'
  }

  nextStep() {
    if (!this.isLastStep) {
      this.currentStep++
      return true
    }
    return false
  }

  previousStep() {
    if (!this.isFirstStep) {
      this.currentStep--
      return true
    }
    return false
  }

  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.totalSteps) {
      this.currentStep = stepIndex
      return true
    }
    return false
  }

  updateFieldValue(fieldName, value) {
    this.fieldValues[fieldName] = value
    delete this.fieldErrors[fieldName]
    return true
  }

  validateCurrentStep() {
    const stepFields = this.currentStepData.fields || []
    let isValid = true

    stepFields.forEach(field => {
      const value = this.fieldValues[field.name]
      if (field.required && (!value || value.trim() === '')) {
        this.fieldErrors[field.name] = `${field.label} é obrigatório`
        isValid = false
      }
    })

    return isValid
  }

  clearErrors() {
    this.errorMessages = []
    this.fieldErrors = {}
    return true
  }

  setErrors(errors) {
    this.errorMessages = Array.isArray(errors) ? errors : [errors]
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

  setLoading(loading) {
    this.isLoading = loading
    return true
  }

  reset() {
    this.currentStep = 0
    this.fieldValues = {}
    this.clearErrors()
    this.clearSuccess()
    return true
  }

  clearCurrentStep() {
    const stepFields = this.currentStepData.fields || []
    stepFields.forEach(field => {
      this.fieldValues[field.name] = field.defaultValue || ''
      delete this.fieldErrors[field.name]
    })
    return true
  }

  toJSON() {
    return {
      title: this.title,
      steps: this.steps,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      isFirstStep: this.isFirstStep,
      isLastStep: this.isLastStep,
      fieldValues: this.fieldValues,
      fieldErrors: this.fieldErrors,
      hasErrors: this.hasErrors,
      hasSuccess: this.hasSuccess,
      hasDeleteAction: this.hasDeleteAction,
      errorMessages: this.errorMessages,
      successMessage: this.successMessage,
      isLoading: this.isLoading,
    }
  }
}
