import { useState, useEffect } from 'react'
import { InputView } from '@shared/components/ui/Input/InputView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'

/**
 * ManagementFormView - formulário simplificado para gerenciamento
 */
export function ManagementFormView({
  title = '',
  subtitle = '',
  fields = [],
  submitWidth = 'fit',
  onSubmit,
  onDelete,
  onEdit,
  onCancel,
  isEditing = false,
  initialData = {},
  footerContent,
}) {
  const [fieldValues, setFieldValues] = useState({})
  const [errors, setErrors] = useState([])
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Carregar dados iniciais apenas uma vez
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFieldValues(initialData)
    }
  }, []) // Sem dependências para rodar apenas uma vez

  // Resetar valores quando initialData muda (mudança de menu)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFieldValues(initialData)
    }
  }, [JSON.stringify(initialData)]) // Usar JSON.stringify para deep comparison

  const handleFieldChange = (fieldName) => (value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setErrors([])
    setSuccess('')

    try {
      if (onSubmit) {
        const result = await onSubmit(fieldValues)

        if (result?.success) {
          setSuccess(result.message || 'Dados atualizados com sucesso!')
        } else if (result?.error) {
          setErrors(Array.isArray(result.error) ? result.error : [result.error])
        }

        return result
      }
    } catch (error) {
      setErrors([error.message || 'Erro ao atualizar dados'])
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (initialData) {
      setFieldValues(initialData)
    }
    setErrors([])
    onCancel?.()
  }

  const getFieldValue = (fieldName) => {
    return fieldValues[fieldName] || ''
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 items-start">
      {/* Título */}
      {isEditing && title && (
        <HeadingView level={3} className="text-brand-pink">
          {title}
        </HeadingView>
      )}

      {/* Subtítulo */}
      {subtitle && (
        <TextView className="text-left text-brand-gray">
          {subtitle}
        </TextView>
      )}

      {/* Campos */}
      <div className="w-full grid grid-cols-2 gap-subsection md:gap-subsection-md">
        {fields.map((field) => (
          <div key={field.name} className="w-full">
            <InputView
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              placeholder={isEditing ? (field.placeholder || '') : ''}
              value={getFieldValue(field.name)}
              onChange={isEditing ? handleFieldChange(field.name) : undefined}
              hasLabel={field.hasLabel !== undefined ? field.hasLabel : Boolean(field.label)}
              required={isEditing && (field.required || false)}
              showPasswordToggle={isEditing && field.showPasswordToggle}
              isActive={isEditing}
              readOnly={!isEditing}
              maxLength={field.maxLength}
              minLength={field.minLength}
              step={field.step}
              min={field.min}
              max={field.max}
              autoComplete={field.autoComplete}
              pattern={isEditing ? field.pattern : undefined}
              inputMode={isEditing ? field.inputMode : undefined}
            >
              {field.label || ''}
            </InputView>
          </div>
        ))}
      </div>

      {/* Mensagem de sucesso */}
      {success && (
        <div className="w-full p-3 bg-green-50 border border-green-300 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Erros gerais */}
      {errors.length > 0 && (
        <div className="w-full mt-2">
          <ErrorDisplayView
            messages={errors}
            position="inline"
            variant="prominent"
          />
        </div>
      )}

      {/* Rodapé */}
      {footerContent && (
        <div className="w-full mt-4">
          {footerContent}
        </div>
      )}

      {/* Botões de ação */}
      <div className="w-full flex justify-start gap-4 mt-4">
        {!isEditing ? (
          <>
            <ButtonView
              type="button"
              width={submitWidth}
              onClick={onDelete}
              variant="gray"
            >
              EXCLUIR
            </ButtonView>
            <ButtonView
              type="button"
              width={submitWidth}
              onClick={onEdit}
              variant="pink"
            >
              EDITAR
            </ButtonView>
          </>
        ) : (
          <>
            <ButtonView
              type="button"
              width={submitWidth}
              onClick={handleCancel}
              variant="gray"
            >
              CANCELAR
            </ButtonView>
            <ButtonView
              type="submit"
              width={submitWidth}
              disabled={loading}
              variant="pink"
            >
              {loading ? 'Salvando...' : 'SALVAR'}
            </ButtonView>
          </>
        )}
      </div>
    </form>
  )
}

export default ManagementFormView
