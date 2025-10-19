import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { InputView } from '@shared/components/ui/Input/InputView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/ui/ErrorDisplay/ErrorDisplayView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useManagementFormViewModel } from './useManagementFormViewModel'

/**
 * ManagementFormView - formulário adaptado para telas de gerenciamento (perfil, settings)
 * Permite visualização, edição e exclusão de dados
 */
export function ManagementFormView({
  title = '',
  subtitle = '',
  fields = [],
  submitWidth = 'fit',
  onSubmit,
  onDelete,
  initialData = {},
  footerContent,
  initialErrors = [],
  initialSuccess = '',
  initialLoading = false,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const location = useLocation()

  const viewModel = useManagementFormViewModel({
    title,
    subtitle,
    fields,
    submitWidth,
    onSubmit: async (data) => {
      const result = await onSubmit?.(data)
      if (result?.success) {
        setIsEditing(false)
      }
      return result
    },
    footerContent,
    errorMessages: initialErrors,
    successMessage: initialSuccess,
    isLoading: initialLoading,
  })

  // Efeito para carregar dados iniciais
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([fieldName, value]) => {
        if (value !== undefined) {
          viewModel.updateFieldValue(fieldName, value)
        }
      })
    }
  }, [initialData, viewModel])

  // Referência para armazenar o pathname anterior
  const previousPathRef = useRef(location.pathname)

  // Efeito para resetar estado na mudança de rota
  useEffect(() => {
    const currentPath = location.pathname
    const previousPath = previousPathRef.current

    // Verifica se está mudando entre as rotas de perfil e acesso
    const isPerfilOrAcesso = currentPath.includes('perfil') || currentPath.includes('acesso')
    const wasPerfilOrAcesso = previousPath.includes('perfil') || previousPath.includes('acesso')

    // Se ambos os caminhos (atual e anterior) são de perfil/acesso e são diferentes
    if (isPerfilOrAcesso && wasPerfilOrAcesso && currentPath !== previousPath) {
      setIsEditing(false)
      viewModel.clearErrors()
    }

    previousPathRef.current = currentPath
  }, [location.pathname, viewModel])

  // Handler para ativar modo de edição
  const handleEdit = () => {
    setIsEditing(true)
  }

  // Handler para cancelar edição
  const handleCancel = () => {
    setIsEditing(false)
    if (initialData) {
      Object.entries(initialData).forEach(([fieldName, value]) => {
        if (value !== undefined) {
          viewModel.updateFieldValue(fieldName, value)
        }
      })
    }
    viewModel.clearErrors()
  }

  return (
    <>
      <form onSubmit={viewModel.handleSubmit} className={viewModel.formClasses} key={isEditing ? 'editing' : 'viewing'}>
        {/* Título de Edição */}
        {isEditing && (
          <HeadingView level={2} className="text-2xl font-bold mb-6 text-center">
            {location.pathname === '/acesso' ? 'EDITAR ACESSO' : 'EDITAR PERFIL'}
          </HeadingView>
        )}

        {/* Título Original */}
        {!isEditing && viewModel.hasTitle && (
          <HeadingView level={2} className={viewModel.titleClasses}>
            {title}
          </HeadingView>
        )}

        {/* Subtítulo */}
        {viewModel.hasSubtitle && (
        <TextView className={viewModel.subtitleClasses}>
          {subtitle}
        </TextView>
        )}

        {/* Campos */}
        {fields.map((field) => (
          <div key={field.name} className={viewModel.fieldContainerClasses}>
            <InputView
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              placeholder={isEditing ? (field.placeholder || '') : ''}
              value={viewModel.getFieldValue(field.name)}
              onChange={isEditing ? viewModel.handleFieldChange(field.name) : undefined}
              onClick={isEditing ? field.onClick : undefined}
              hasLabel={field.hasLabel !== undefined ? field.hasLabel : Boolean(field.label)}
              required={isEditing && (field.required || false)}
              showPasswordToggle={isEditing && field.showPasswordToggle}
              isActive={isEditing && !viewModel.isLoading}
              maxLength={field.maxLength}
              minLength={field.minLength}
              step={field.step}
              min={field.min}
              max={field.max}
              autoComplete={field.autoComplete}
              readOnly={!isEditing}
              disabled={!isEditing || viewModel.isLoading}
              pattern={isEditing ? field.pattern : undefined}
              inputMode={isEditing ? field.inputMode : undefined}
              className={!isEditing ? 'bg-gray-50 border-gray-200' : ''}
            >
              {field.label || ''}
            </InputView>

            {/* Erro específico do campo */}
            {viewModel.hasFieldError(field.name) && (
            <div className="text-red-600 text-sm mt-1">
              {viewModel.getFieldError(field.name)}
            </div>
            )}
          </div>
        ))}

        {/* Mensagem de sucesso */}
        {viewModel.hasSuccess && (
        <div className={viewModel.successContainerClasses}>
          {viewModel.successMessage}
        </div>
        )}

        {/* Erros gerais */}
        {viewModel.hasErrors && viewModel.errorMessages.length > 0 && (
        <div className={viewModel.errorContainerClasses}>
          <ErrorDisplayView
            messages={viewModel.errorMessages}
            position="inline"
            variant="prominent"
          />
        </div>
        )}

        {/* Rodapé */}
        {viewModel.hasFooter && (
        <div className={viewModel.footerClasses}>
          {footerContent}
        </div>
        )}
      </form>

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
              onClick={handleEdit}
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
              type="button"
              width={submitWidth}
              onClick={() => document.querySelector('form').requestSubmit()}
              disabled={viewModel.isLoading}
              variant="pink"
            >
              {viewModel.isLoading ? 'Salvando...' : 'SALVAR'}
            </ButtonView>
          </>
        )}
      </div>
    </>
  )
}

export default ManagementFormView
