import { useState, useCallback, useEffect } from 'react'
import { EditFormModel } from './EditFormModel'

export function useEditFormViewModel(initialProps = {}) {
  const [model] = useState(() => new EditFormModel(initialProps))
  const [isEditing, setIsEditing] = useState(initialProps.isEditing || false)
  const [fieldValues, setFieldValues] = useState(initialProps.initialData || {})
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Atualizar valores quando initialData mudar
  useEffect(() => {
    if (initialProps.initialData) {
      setFieldValues(initialProps.initialData)
      model.fieldValues = initialProps.initialData
    }
  }, [initialProps.initialData, model])

  const updateFieldValue = useCallback((fieldName, value) => {
    setFieldValues(prev => ({ ...prev, [fieldName]: value }))
    model.updateFieldValue(fieldName, value)
  }, [model])

  const clearErrors = useCallback(() => {
    setErrors([])
    model.clearErrors()
  }, [model])

  const clearSuccess = useCallback(() => {
    setSuccess('')
    model.clearSuccess()
  }, [model])

  const handleFieldChange = useCallback((fieldName) => (e) => {
    const value = e.target?.value ?? e
    updateFieldValue(fieldName, value)
    clearErrors()
  }, [updateFieldValue, clearErrors])

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()

    setLoading(true)
    clearErrors()
    clearSuccess()

    try {
      if (initialProps.onSubmit) {
        const result = await initialProps.onSubmit(fieldValues)

        if (result?.success) {
          setSuccess(result.message || 'Dados salvos com sucesso!')
          setIsEditing(false)
        } else if (result?.error) {
          setErrors(Array.isArray(result.error) ? result.error : [result.error])
        }

        return result
      }
    } catch (error) {
      setErrors([error.message || 'Erro ao salvar dados'])
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [fieldValues, initialProps, clearErrors, clearSuccess])

  const handleEdit = useCallback(() => {
    setIsEditing(true)
    clearErrors()
    clearSuccess()
  }, [clearErrors, clearSuccess])

  const handleCancel = useCallback(() => {
    if (initialProps.onCancel && typeof initialProps.onCancel === 'function') {
      initialProps.onCancel()
    } else {
      setFieldValues(initialProps.initialData || {})
      setIsEditing(false)
      clearErrors()
      clearSuccess()
    }
  }, [initialProps.onCancel, initialProps.initialData, clearErrors, clearSuccess])

  const handleDelete = useCallback(() => {
    if (initialProps.onDelete) {
      initialProps.onDelete()
    }
  }, [initialProps])

  const getFieldValue = useCallback((fieldName) => {
    return fieldValues[fieldName] || ''
  }, [fieldValues])

  return {
    // Estado
    title: initialProps.title || '',
    fields: initialProps.fields || [],
    isEditing,
    isLoading: loading,
    errorMessages: errors,
    successMessage: success,
    fieldValues,
    hasErrors: errors.length > 0,
    hasSuccess: Boolean(success),

    // Event Handlers
    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleCancel,
    handleDelete,

    // Utilities
    getFieldValue,
    updateFieldValue,
    clearErrors,
    clearSuccess,
  }
}
