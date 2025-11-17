import { useState, useEffect, useCallback } from 'react'

export function useEditFormViewModel({
  title = '',
  fields = [],
  initialData = {},
  onSubmit,
  onCancel,
  onDelete,
  isEditing: initialIsEditing = false,
}) {
  const [isEditing, setIsEditing] = useState(initialIsEditing)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Inicializar formData com dados iniciais
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(initialData)
    }
  }, [initialData])

  // Sincronizar formData quando initialData muda
  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      ...initialData
    }))
  }, [initialData])

  const getFieldValue = useCallback((fieldName) => {
    return formData[fieldName] || ''
  }, [formData])

  const handleFieldChange = useCallback((fieldName) => {
    return (event) => {
      const value = event.target ? event.target.value : event

      // Encontrar o field para verificar se tem formatter
      const field = fields.find(f => f.name === fieldName)
      let processedValue = value

      // Aplicar formatação se o campo tiver formatter e formatOnChange
      if (field && field.formatOnChange && field.formatter && typeof field.formatter === 'function') {
        processedValue = field.formatter(value)
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: processedValue
      }))

      // Limpar erros deste campo quando houver alteração
      if (errors[fieldName]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
      }
    }
  }, [fields, errors])

  const validateForm = useCallback(() => {
    const newErrors = {}

    fields.forEach(field => {
      if (field.required && !getFieldValue(field.name)) {
        newErrors[field.name] = `${field.label || field.name} é obrigatório`
      }

      if (field.validate && getFieldValue(field.name)) {
        const validationResult = field.validate(getFieldValue(field.name), formData)
        if (validationResult !== true) {
          newErrors[field.name] = validationResult
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [fields, formData, getFieldValue])

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await onSubmit?.(formData)

      if (result?.success) {
        setSuccessMessage(result.message || 'Dados salvos com sucesso!')
        setIsEditing(false)

        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      } else if (result?.error) {
        setErrors({ general: result.error })
      }
    } catch (error) {
      console.error('Erro ao submeter formulário:', error)
      setErrors({ general: 'Erro inesperado. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }, [formData, validateForm, onSubmit])

  const handleEdit = useCallback(() => {
    setIsEditing(true)
    setErrors({})
    setSuccessMessage('')
  }, [])

  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setErrors({})
    setSuccessMessage('')

    // Restaurar dados iniciais
    setFormData(initialData)

    onCancel?.()
  }, [initialData, onCancel])

  const handleDelete = useCallback(async () => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setIsLoading(true)
      try {
        await onDelete?.()
      } catch (error) {
        console.error('Erro ao excluir:', error)
        setErrors({ general: 'Erro ao excluir. Tente novamente.' })
      } finally {
        setIsLoading(false)
      }
    }
  }, [onDelete])

  return {
    // Estado
    title,
    fields,
    formData,
    isEditing,
    isLoading,
    errors,
    successMessage,

    // Estados computados
    hasErrors: Object.keys(errors).length > 0,
    hasSuccess: !!successMessage,
    errorMessages: Object.values(errors),

    // Métodos
    getFieldValue,
    handleFieldChange,
    handleSubmit,
    handleEdit,
    handleCancel,
    handleDelete,
    validateForm
  }
}
