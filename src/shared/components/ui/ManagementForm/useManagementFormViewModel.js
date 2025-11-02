import { useState, useCallback, useRef, useEffect } from 'react'
import { ManagementFormModel } from './ManagementFormModel'

/**
 * Hook para gerenciar estado e interações do ManagementForm
 */
export function useManagementFormViewModel(initialProps = {}) {
  const modelRef = useRef(null)

  // Inicializar o modelo apenas uma vez
  if (!modelRef.current) {
    modelRef.current = new ManagementFormModel(initialProps)
  }

  const [fieldValues, setFieldValues] = useState(initialProps.initialData || {})
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(initialProps.isEditing || false)

  // Referência para comparação profunda
  const prevInitialDataRef = useRef()

  // Atualizar valores quando initialData mudar
  useEffect(() => {
    const currentData = initialProps.initialData
    const prevData = prevInitialDataRef.current

    // Comparação profunda usando JSON.stringify
    if (currentData && JSON.stringify(currentData) !== JSON.stringify(prevData)) {
      setFieldValues(currentData)
      prevInitialDataRef.current = currentData
    }
  }, [initialProps.initialData])

  // Atualizar isEditing quando a prop mudar
  useEffect(() => {
    setIsEditing(initialProps.isEditing || false)
  }, [initialProps.isEditing])

  // CSS classes fixas
  const formClasses = 'w-full flex flex-col gap-6 items-start'
  const titleClasses = 'text-distac-primary'
  const subtitleClasses = 'text-left text-default-dark-muted'
  const fieldContainerClasses = 'w-full grid grid-cols-2 gap-subsection md:gap-subsection-md'
  const errorContainerClasses = 'w-full mt-2'
  const successContainerClasses = 'w-full p-3 bg-green-50 border border-green-300 text-green-700 rounded'
  const footerClasses = 'w-full mt-4'
  const buttonContainerClasses = 'w-full flex justify-start gap-4 mt-4'

  // Computed values
  const hasErrors = errors.length > 0
  const hasSuccess = Boolean(success)
  const hasSubtitle = Boolean(initialProps.subtitle)
  const hasFooter = Boolean(initialProps.footerContent)
  const shouldShowTitle = isEditing && Boolean(initialProps.title)

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

  const clearSuccess = useCallback(() => {
    setSuccess('')
  }, [])

  const handleFieldChange = useCallback((fieldName) => (value) => {
    updateFieldValue(fieldName, value)
    clearErrors()
  }, [updateFieldValue, clearErrors])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    setLoading(true)
    clearErrors()
    clearSuccess()

    try {
      if (initialProps.onSubmit) {
        const result = await initialProps.onSubmit(fieldValues)

        if (result?.success) {
          setSuccess(result.message || 'Dados atualizados com sucesso!')
          setIsEditing(false)
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
  }, [fieldValues, initialProps.onSubmit, clearErrors, clearSuccess])

  const handleEdit = useCallback(() => {
    setIsEditing(true)
    clearErrors()
    clearSuccess()
    if (initialProps.onEdit) {
      initialProps.onEdit()
    }
  }, [clearErrors, clearSuccess, initialProps.onEdit])

  const handleCancel = useCallback(() => {
    setFieldValues(initialProps.initialData || {})
    setIsEditing(false)
    clearErrors()
    clearSuccess()
    if (initialProps.onCancel) {
      initialProps.onCancel()
    }
  }, [initialProps.initialData, initialProps.onCancel, clearErrors, clearSuccess])

  const handleDelete = useCallback(() => {
    if (initialProps.onDelete) {
      initialProps.onDelete()
    }
  }, [initialProps.onDelete])

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
    isEditing,
    footerContent: initialProps.footerContent,
    fieldValues,
    hasSubtitle,
    hasErrors,
    hasSuccess,
    hasFooter,
    shouldShowTitle,

    // CSS Classes
    formClasses,
    titleClasses,
    subtitleClasses,
    fieldContainerClasses,
    errorContainerClasses,
    successContainerClasses,
    footerClasses,
    buttonContainerClasses,

    // Event Handlers
    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleCancel,
    handleDelete,

    // Commands
    updateFieldValue,
    clearErrors,
    clearSuccess,

    // Utilities
    getFieldValue,
    getFieldError,
    hasFieldError,
  }
}
