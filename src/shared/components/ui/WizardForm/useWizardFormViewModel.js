import { useState, useCallback, useRef } from 'react'
import { WizardFormModel } from './WizardFormModel'

export function useWizardFormViewModel(initialProps = {}) {
  const modelRef = useRef(null)

  if (!modelRef.current) {
    modelRef.current = new WizardFormModel(initialProps)
  }

  const model = modelRef.current
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // Actions
  const updateFieldValue = useCallback((fieldName, value) => {
    model.updateFieldValue(fieldName, value)
    refresh()
  }, [model, refresh])

  const nextStep = useCallback(() => {
    if (model.validateCurrentStep()) {
      model.nextStep()
      refresh()
      return true
    }
    refresh()
    return false
  }, [model, refresh])

  const previousStep = useCallback(() => {
    model.previousStep()
    refresh()
  }, [model, refresh])

  const goToStep = useCallback((stepIndex) => {
    model.goToStep(stepIndex)
    refresh()
  }, [model, refresh])

  const handleFieldChange = useCallback((fieldName) => (value) => {
    updateFieldValue(fieldName, value)
  }, [updateFieldValue])

  const handleNext = useCallback(() => {
    nextStep()
  }, [nextStep])

  const handlePrevious = useCallback(() => {
    previousStep()
  }, [previousStep])

  const handleCancel = useCallback(() => {
    model.reset()
    refresh()
    if (initialProps.onCancel) {
      initialProps.onCancel()
    }
  }, [model, refresh, initialProps])

  const handleSubmit = useCallback(async (event) => {
    console.log('🚀 [WIZARD FORM] handleSubmit called - START')
    console.log('🚀 [WIZARD FORM] Event type:', event?.type)
    console.log('🚀 [WIZARD FORM] Event target:', event?.target?.tagName)

    if (event) {
      event.preventDefault()
      console.log('🚀 [WIZARD FORM] preventDefault called')
    }

    console.log('🚀 [WIZARD FORM] Current state:', {
      isLastStep: model.isLastStep,
      currentStep: model.currentStep,
      totalSteps: model.totalSteps,
      hasOnSubmit: !!model.onSubmit,
      onSubmitType: typeof model.onSubmit
    })

    console.log('📋 [WIZARD FORM] Field values:', model.fieldValues)

    if (!model.isLastStep) {
      console.log('🔄 [WIZARD FORM] Not last step, going to next')
      return nextStep()
    }

    console.log('✅ [WIZARD FORM] Last step reached, proceeding with submission')

    // Validação antes de enviar
    if (!model.validateCurrentStep()) {
      console.error('❌ [WIZARD FORM] Validation failed for current step')
      console.error('❌ [WIZARD FORM] Validation errors:', model.fieldErrors)
      refresh()
      return false
    }

    console.log('✅ [WIZARD FORM] Validation passed, starting submission')

    model.setLoading(true)
    model.clearErrors()
    model.clearSuccess()
    refresh()

    try {
      if (model.onSubmit && typeof model.onSubmit === 'function') {
        console.log('📤 [WIZARD FORM] Calling onSubmit handler')
        console.log('📤 [WIZARD FORM] Data being sent:', model.fieldValues)

        const result = await model.onSubmit(model.fieldValues)
        console.log('📥 [WIZARD FORM] onSubmit result:', result)

        if (result && result.success) {
          console.log('✅ [WIZARD FORM] Submit successful')
          model.setSuccess(result.message || 'Dados salvos com sucesso!')
          if (result.reset) {
            model.reset()
          }
        } else if (result && result.error) {
          console.log('❌ [WIZARD FORM] Submit failed with error')
          model.setErrors(Array.isArray(result.error) ? result.error : [result.error])
        } else if (!result) {
          console.warn('⚠️ [WIZARD FORM] onSubmit returned no result')
        }

        refresh()
        return result
      } else {
        console.error('❌ [WIZARD FORM] No valid onSubmit handler')
        console.error('❌ [WIZARD FORM] onSubmit value:', model.onSubmit)
        console.error('❌ [WIZARD FORM] onSubmit type:', typeof model.onSubmit)
        model.setErrors(['Erro interno: handler de submissão não configurado'])
        refresh()
        return { success: false, error: 'Handler não configurado' }
      }
    } catch (error) {
      console.error('❌ [WIZARD FORM] Submit error caught:', error)
      console.error('❌ [WIZARD FORM] Error stack:', error.stack)

      const errorMessage = error.message || 'Erro ao salvar dados'
      model.setErrors([errorMessage])
      refresh()
      return { success: false, error: errorMessage }
    } finally {
      console.log('🏁 [WIZARD FORM] handleSubmit finished, setting loading to false')
      model.setLoading(false)
      refresh()
    }
  }, [model, nextStep, refresh])

  const handleDelete = useCallback(() => {
    if (model.onDelete) {
      model.onDelete(model.fieldValues)
    }
  }, [model])

  const handleClear = useCallback(() => {
    // Limpa apenas os campos da etapa atual
    model.clearCurrentStep()
    refresh()

    // Chama o callback onClear se fornecido (para lógica adicional)
    if (initialProps.onClear) {
      initialProps.onClear(model.currentStep)
    }
  }, [model, refresh, initialProps])

  const getFieldValue = useCallback((fieldName) => {
    return model.fieldValues[fieldName] || ''
  }, [model.fieldValues])

  const getFieldError = useCallback((fieldName) => {
    return model.fieldErrors[fieldName] || ''
  }, [model.fieldErrors])

  const hasFieldError = useCallback((fieldName) => {
    return Boolean(model.fieldErrors[fieldName])
  }, [model.fieldErrors])

  return {
    // Data
    title: model.title,
    steps: model.steps,
    currentStep: model.currentStep,
    totalSteps: model.totalSteps,
    isFirstStep: model.isFirstStep,
    isLastStep: model.isLastStep,
    currentStepData: model.currentStepData,
    fieldValues: model.fieldValues,
    fieldErrors: model.fieldErrors,
    hasErrors: model.hasErrors,
    hasSuccess: model.hasSuccess,
    hasDeleteAction: model.hasDeleteAction,
    errorMessages: model.errorMessages,
    successMessage: model.successMessage,
    isLoading: model.isLoading,
    onDelete: model.onDelete, // Expose onDelete for conditional rendering

    // Event Handlers
    handleFieldChange,
    handleNext,
    handlePrevious,
    handleCancel,
    handleSubmit,
    handleDelete,
    handleClear,
    goToStep,

    // Utilities
    getFieldValue,
    getFieldError,
    hasFieldError,
  }
}
