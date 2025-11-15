import { InputView } from '@shared/components/ui/Input/InputView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useEditFormViewModel } from './useEditFormViewModel'

/**
 * EditFormView - Formulário especializado para operações CRUD
 *
 * @param {string} title - Título do formulário
 * @param {Array} fields - Array de configuração dos campos
 * @param {Object} initialData - Dados iniciais
 * @param {Function} onSubmit - Handler de submit
 * @param {Function} onDelete - Handler de exclusão
 * @param {boolean} isEditing - Estado inicial de edição
 * @param {boolean} showDeleteButton - Mostrar botão excluir (padrão: true)
 */
export function EditFormView({
  title = '',
  fields = [],
  initialData = {},
  onSubmit,
  onDelete,
  isEditing: initialIsEditing = false,
  showDeleteButton = true,
}) {
  const vm = useEditFormViewModel({
    title,
    fields,
    initialData,
    onSubmit,
    onDelete,
    isEditing: initialIsEditing,
  })

  return (
    <div className="w-full flex flex-col gap-subsection">
      {/* Título */}
      {vm.title && (
        <HeadingView level={2} className="text-distac-primary">
          {vm.title}
        </HeadingView>
      )}

      {/* Mensagem de sucesso */}
      {vm.hasSuccess && (
        <div className="w-full p-3 bg-green-50 border border-green-300 text-green-700 rounded">
          {vm.successMessage}
        </div>
      )}

      {/* Erros */}
      {vm.hasErrors && (
        <div className="w-full">
          <ErrorDisplayView
            messages={vm.errorMessages}
            position="inline"
            variant="prominent"
          />
        </div>
      )}

      {/* Modo visualização */}
      {!vm.isEditing ? (
        <>
          <div className="w-full grid grid-cols-2 gap-subsection md:gap-subsection-md">
            {vm.fields.map((field) => (
              <div key={field.name} className="w-full">
                <label className="block text-sm font-medium text-default-dark mb-2">
                  {field.label}
                </label>
                <div className="p-3 bg-default-light border border-default-dark-muted rounded">
                  {field.type === 'password'
                    ? (vm.getFieldValue(field.name) ? '••••••••' : '-')
                    : (vm.getFieldValue(field.name) || '-')
                  }
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            {showDeleteButton && (
              <ButtonView
                type="button"
                width="fit"
                onClick={vm.handleDelete}
                color="gray"
              >
                EXCLUIR
              </ButtonView>
            )}
            <ButtonView
              type="button"
              width="fit"
              onClick={vm.handleEdit}
              color="pink"
            >
              EDITAR
            </ButtonView>
          </div>
        </>
      ) : (
        /* Modo edição */
        <form onSubmit={vm.handleSubmit} className="w-full flex flex-col gap-subsection">
          <div className="w-full grid grid-cols-2 gap-subsection md:gap-subsection-md">
            {vm.fields.map((field) => (
              <div key={field.name} className="w-full">
                <InputView
                  id={field.name}
                  name={field.name}
                  type={field.type || 'text'}
                  placeholder={field.placeholder || ''}
                  value={vm.getFieldValue(field.name)}
                  onChange={vm.handleFieldChange(field.name)}
                  hasLabel={Boolean(field.label)}
                  required={field.required || false}
                  showPasswordToggle={field.type === 'password'}
                  isActive={true}
                >
                  {field.label || ''}
                </InputView>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <ButtonView
              type="button"
              width="fit"
              onClick={vm.handleCancel}
              color="gray"
            >
              CANCELAR
            </ButtonView>
            <ButtonView
              type="submit"
              width="fit"
              disabled={vm.isLoading}
              color="pink"
            >
              {vm.isLoading ? 'Salvando...' : 'SALVAR'}
            </ButtonView>
          </div>
        </form>
      )}
    </div>
  )
}
