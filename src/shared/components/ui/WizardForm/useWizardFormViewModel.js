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




    if (event) {
      event.preventDefault()

    }





    // Validação de todas as etapas antes de enviar
    if (!model.validateAllSteps()) {
      console.error('❌ [WIZARD FORM] Validation failed for some steps')
      console.error('❌ [WIZARD FORM] Validation errors:', model.fieldErrors)

      // Encontrar a primeira etapa com erro e navegar para ela
      for (let i = 0; i < model.totalSteps; i++) {
        const stepFields = model.getAllFieldsForStep(i)
        if (stepFields.some(f => model.fieldErrors[f.name])) {
          model.goToStep(i)
          break
        }
      }

      refresh()
      return false
    }



    model.setLoading(true)
    model.clearErrors()
    model.clearSuccess()
    refresh()

    try {
      if (model.onSubmit && typeof model.onSubmit === 'function') {



        const result = await model.onSubmit(model.fieldValues)


        if (result && result.success) {

          model.setSuccess(result.message || 'Dados salvos com sucesso!')
          if (result.reset) {
            model.reset()
          }
        } else if (result && result.error) {

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

      model.setLoading(false)
      refresh()
    }
  }, [model, nextStep, refresh])

  const handleDelete = useCallback(() => {
    if (model.onDelete) {
      model.onDelete(model.fieldValues)
    }
  }, [model])

  const handleDisable = useCallback(() => {
    if (model.onDisable) {
      model.onDisable(model.fieldValues)
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
    hasDisableAction: model.hasDisableAction,
    errorMessages: model.errorMessages,
    successMessage: model.successMessage,
    isLoading: model.isLoading,
    onDelete: model.onDelete, // Expose onDelete for conditional rendering
    onDisable: model.onDisable,

    // Event Handlers
    handleFieldChange,
    handleNext,
    handlePrevious,
    handleCancel,
    handleSubmit,
    handleDelete,
    handleDisable,
    handleClear,
    goToStep,

    // Utilities
    getFieldValue,
    getFieldError,
    hasFieldError,
  }
}
