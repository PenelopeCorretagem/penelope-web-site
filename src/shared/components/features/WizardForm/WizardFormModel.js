import { formatCEP } from '@shared/utils/CEP/formatCEPUtil'
import { formatCPF } from '@shared/utils/CPF/formatCPFUtil'
import { formatPhoneNumber } from '@shared/utils/phone/formatPhoneNumberUtil'

const CEP_FIELD_NAME_REGEX = /cep|zipcode/i
const CPF_FIELD_NAME_REGEX = /cpf/i
const PHONE_FIELD_NAME_REGEX = /phone|telefone|celular|whatsapp/i

function isMaskableValue(value) {
  return typeof value === 'string' || typeof value === 'number'
}

function getAllFieldsFromSteps(steps = []) {
  return (steps || []).flatMap(step =>
    (step.groups || []).flatMap(group => group.fields || [])
  )
}

function normalizeInitialFieldValues(initialData = {}, steps = []) {
  const normalizedData = { ...initialData }
  const fields = getAllFieldsFromSteps(steps)

  fields.forEach((field) => {
    if (!field?.name) return

    const value = normalizedData[field.name]
    if (value === undefined || value === null || value === '' || !isMaskableValue(value)) {
      return
    }

    if (field.formatOnChange && typeof field.formatter === 'function') {
      normalizedData[field.name] = field.formatter(String(value))
      return
    }

    if (CEP_FIELD_NAME_REGEX.test(field.name)) {
      normalizedData[field.name] = formatCEP(String(value))
      return
    }

    if (CPF_FIELD_NAME_REGEX.test(field.name)) {
      normalizedData[field.name] = formatCPF(String(value))
      return
    }

    if (PHONE_FIELD_NAME_REGEX.test(field.name)) {
      normalizedData[field.name] = formatPhoneNumber(String(value))
    }
  })

  return normalizedData
}

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
    onDisable = null,
    onClear = null,
  } = {}) {
    this.title = title
    this.steps = steps
    this.currentStep = 0
    this.fieldValues = normalizeInitialFieldValues(initialData, steps)
    this.fieldErrors = {}
    this.onSubmit = onSubmit
    this.onDelete = onDelete
    this.onDisable = onDisable
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

  get hasDisableAction() {
    return typeof this.onDisable === 'function'
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


    const stepFields = this.getAllFieldsForStep(this.currentStep)
    let isValid = true



    stepFields.forEach(field => {
      const value = this.fieldValues[field.name]


      if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        this.fieldErrors[field.name] = `${field.label} é obrigatório`

        isValid = false
      }
    })


    return isValid
  }

  validateAllSteps() {
    let isValid = true
    this.fieldErrors = {}

    for (let i = 0; i < this.totalSteps; i++) {
      const stepFields = this.getAllFieldsForStep(i)
      stepFields.forEach(field => {
        const value = this.fieldValues[field.name]

        if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
          this.fieldErrors[field.name] = `${field.label} é obrigatório`
          isValid = false
        }
      })
    }

    return isValid
  }

  // Método auxiliar para obter todos os campos de uma etapa
  getAllFieldsForStep(stepIndex) {
    const step = this.steps[stepIndex]
    if (!step || !step.groups) return []

    const fields = []
    step.groups.forEach(group => {
      if (group.fields) {
        fields.push(...group.fields)
      }
    })

    return fields
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
      hasDisableAction: this.hasDisableAction,
      errorMessages: this.errorMessages,
      successMessage: this.successMessage,
      isLoading: this.isLoading,
    }
  }
}
