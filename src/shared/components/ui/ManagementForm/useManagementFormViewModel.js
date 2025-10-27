import { useState, useCallback, useRef } from 'react'
import { ManagementFormModel } from './ManagementFormModel'

/**
 * Hook para gerenciar estado e interações do ManagementForm
 * Versão simplificada para evitar loops infinitos
 */
export function useManagementFormViewModel(initialProps = {}) {
  const modelRef = useRef(null)

  // Inicializar o modelo apenas uma vez
  if (!modelRef.current) {
    modelRef.current = new ManagementFormModel(initialProps)
  }

  const [fieldValues, setFieldValues] = useState({})
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // CSS classes fixas
  const formClasses = 'w-full flex flex-col gap-6 items-start'
  const titleClasses = 'text-distac-primary'
  const subtitleClasses = 'text-left text-default-dark-muted'
  const fieldContainerClasses = 'w-full'
  const errorContainerClasses = 'w-full mt-2'
  const successContainerClasses = 'w-full p-3 bg-green-50 border border-green-300 text-green-700 rounded'
  const footerClasses = 'w-full mt-4'

  // Computed values
  const hasErrors = errors.length > 0
  const hasSuccess = Boolean(success)
  const hasSubtitle = Boolean(initialProps.subtitle)
  const hasFooter = Boolean(initialProps.footerContent)

  // Actions
  const updateFieldValue = useCallback((fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const handleFieldChange = useCallback((fieldName) => (value) => {
    updateFieldValue(fieldName, value)
  }, [updateFieldValue])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    setLoading(true)
    clearErrors()
    setSuccess('')

    try {
      if (initialProps.onSubmit) {
        const result = await initialProps.onSubmit(fieldValues)

        if (result?.success) {
          setSuccess(result.message || 'Dados atualizados com sucesso!')
        } else if (result?.error) {
          setErrors(Array.isArray(result.error) ? result.error : [result.error])
        }

        return result
      }
    } catch (error) {
      setErrors([error.message || 'Erro ao atualizar dados'])
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [fieldValues, initialProps.onSubmit, clearErrors])

  // Utilities
  const getFieldValue = useCallback((fieldName) => {
    return fieldValues[fieldName] || ''
  }, [fieldValues])

  const getFieldError = useCallback((fieldName) => {
    return ''
  }, [])

  const hasFieldError = useCallback((fieldName) => {
    return false
  }, [])

  return {
    // Data
    title: initialProps.title || '',
    subtitle: initialProps.subtitle || '',
    fields: initialProps.fields || [],
    submitWidth: initialProps.submitWidth || 'fit',
    errorMessages: errors,
    successMessage: success,
    isLoading: loading,
    footerContent: initialProps.footerContent,
    fieldValues,
    hasSubtitle,
    hasErrors,
    hasSuccess,
    hasFooter,

    // CSS Classes
    formClasses,
    titleClasses,
    subtitleClasses,
    fieldContainerClasses,
    errorContainerClasses,
    successContainerClasses,
    footerClasses,

    // Event Handlers
    handleFieldChange,
    handleSubmit,

    // Commands
    updateFieldValue,
    clearErrors,

    // Utilities
    getFieldValue,
    getFieldError,
    hasFieldError,
  }
}
