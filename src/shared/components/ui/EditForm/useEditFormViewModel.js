import { useState, useEffect, useCallback } from 'react'
import { formatCEP } from '@shared/utils/CEP/formatCEPUtil'
import { formatCPF } from '@shared/utils/CPF/formatCPFUtil'
import { formatPhoneNumber } from '@shared/utils/phone/formatPhoneNumberUtil'

const CEP_FIELD_NAME_REGEX = /cep|zipcode/i
const CPF_FIELD_NAME_REGEX = /cpf/i
const PHONE_FIELD_NAME_REGEX = /phone|telefone|celular|whatsapp/i

function isMaskableValue(value) {
  return typeof value === 'string' || typeof value === 'number'
}

function shouldApplyCEPMask(field = {}) {
  return CEP_FIELD_NAME_REGEX.test(field.name || '')
}

function shouldApplyCPFMask(field = {}) {
  return CPF_FIELD_NAME_REGEX.test(field.name || '')
}

function shouldApplyPhoneMask(field = {}) {
  return PHONE_FIELD_NAME_REGEX.test(field.name || '')
}

function applyInitialFieldMasks(data = {}, fields = []) {
  const maskedData = { ...data }

  fields.forEach((field) => {
    if (!field?.name) return

    const value = maskedData[field.name]
    if (value === undefined || value === null || value === '' || !isMaskableValue(value)) {
      return
    }

    if (field.formatOnChange && typeof field.formatter === 'function') {
      maskedData[field.name] = field.formatter(String(value))
      return
    }

    if (shouldApplyCEPMask(field)) {
      maskedData[field.name] = formatCEP(String(value))
      return
    }

    if (shouldApplyCPFMask(field)) {
      maskedData[field.name] = formatCPF(String(value))
      return
    }

    if (shouldApplyPhoneMask(field)) {
      maskedData[field.name] = formatPhoneNumber(String(value))
    }
  })

  return maskedData
}

export function useEditFormViewModel({
  title = '',
  fields = [],
  initialData = {},
  onSubmit,
  onCancel,
  onDelete,
  isEditing: initialIsEditing = false,
  useNativeDeleteConfirm = true,
}) {
  const [isEditing, setIsEditing] = useState(initialIsEditing)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Sincronizar formData quando initialData muda, aplicando máscaras de campos
  useEffect(() => {
    const maskedInitialData = applyInitialFieldMasks(initialData, fields)

    setFormData(prevData => ({
      ...prevData,
      ...maskedInitialData
    }))
  }, [initialData, fields])

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

      // Garantir máscara de CEP em qualquer campo de CEP, mesmo sem formatter explícito
      if (field && shouldApplyCEPMask(field) && isMaskableValue(processedValue)) {
        processedValue = formatCEP(String(processedValue))
      }

      // Garantir máscara de CPF em qualquer campo de CPF, mesmo sem formatter explícito
      if (field && shouldApplyCPFMask(field) && isMaskableValue(processedValue)) {
        processedValue = formatCPF(String(processedValue))
      }

      // Garantir máscara de telefone em qualquer campo de telefone, mesmo sem formatter explícito
      if (field && shouldApplyPhoneMask(field) && isMaskableValue(processedValue)) {
        processedValue = formatPhoneNumber(String(processedValue))
      }

      setFormData(prev => {
        const newData = {
          ...prev,
          [fieldName]: processedValue
        }

        // Verificar se há campos condicionais que dependem deste campo
        fields.forEach(f => {
          if (f.conditional && f.conditional.field === fieldName) {
            // Se o valor não corresponde à condição e clearOnHide é true, limpar o campo
            if (f.conditional.clearOnHide && processedValue !== f.conditional.value) {
              newData[f.name] = ''
            }
          }
        })

        return newData
      })

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
      // Verificar se o campo deve ser exibido com base em condições
      let shouldValidate = true
      if (field.conditional) {
        const dependentFieldValue = formData[field.conditional.field]
        shouldValidate = dependentFieldValue === field.conditional.value
      }

      // Pular validação de campos ocultos
      if (!shouldValidate) {
        return
      }

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
    setFormData(applyInitialFieldMasks(initialData, fields))

    onCancel?.()
  }, [initialData, fields, onCancel])

  const handleDelete = useCallback(async () => {
    if (useNativeDeleteConfirm && !window.confirm('Tem certeza que deseja excluir este item?')) {
      return
    }

    setIsLoading(true)
    try {
      await onDelete?.()
    } catch (error) {
      console.error('Erro ao excluir:', error)
      setErrors({ general: 'Erro ao excluir. Tente novamente.' })
    } finally {
      setIsLoading(false)
    }
  }, [onDelete, useNativeDeleteConfirm])

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
