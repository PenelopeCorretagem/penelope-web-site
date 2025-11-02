import { InputView } from '@shared/components/ui/Input/InputView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useManagementFormViewModel } from './useManagementFormViewModel'

/**
 * ManagementFormView - formulário para gerenciamento seguindo padrão MVVM
 * Esta é uma VIEW pura - apenas renderiza dados do ViewModel
 */
export function ManagementFormView(props) {
  // ViewModel gerencia todo o estado e lógica
  const vm = useManagementFormViewModel(props)

  return (
    <form onSubmit={vm.handleSubmit} className={vm.formClasses}>
      {/* Título */}
      {vm.shouldShowTitle && (
        <HeadingView level={3} className={vm.titleClasses}>
          {vm.title}
        </HeadingView>
      )}

      {/* Subtítulo */}
      {vm.hasSubtitle && (
        <TextView className={vm.subtitleClasses}>
          {vm.subtitle}
        </TextView>
      )}

      {/* Campos */}
      <div className={vm.fieldContainerClasses}>
        {vm.fields.map((field) => (
          <div key={field.name} className="w-full">
            <InputView
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              placeholder={vm.isEditing ? (field.placeholder || '') : ''}
              value={vm.getFieldValue(field.name)}
              onChange={vm.handleFieldChange(field.name)}
              hasLabel={field.hasLabel !== undefined ? field.hasLabel : Boolean(field.label)}
              required={vm.isEditing && (field.required || false)}
              showPasswordToggle={vm.isEditing && field.showPasswordToggle}
              isActive={vm.isEditing}
              readOnly={!vm.isEditing}
              maxLength={field.maxLength}
              minLength={field.minLength}
              step={field.step}
              min={field.min}
              max={field.max}
              autoComplete={field.autoComplete}
              pattern={vm.isEditing ? field.pattern : undefined}
              inputMode={vm.isEditing ? field.inputMode : undefined}
            >
              {field.label || ''}
            </InputView>
          </div>
        ))}
      </div>

      {/* Mensagem de sucesso */}
      {vm.hasSuccess && (
        <div className={vm.successContainerClasses}>
          {vm.successMessage}
        </div>
      )}

      {/* Erros gerais */}
      {vm.hasErrors && (
        <div className={vm.errorContainerClasses}>
          <ErrorDisplayView
            messages={vm.errorMessages}
            position="inline"
            variant="prominent"
          />
        </div>
      )}

      {/* Rodapé */}
      {vm.hasFooter && (
        <div className={vm.footerClasses}>
          {vm.footerContent}
        </div>
      )}

      {/* Botões de ação */}
      <div className={vm.buttonContainerClasses}>
        {!vm.isEditing ? (
          <>
            <ButtonView
              type="button"
              width={vm.submitWidth}
              onClick={vm.handleDelete}
              color="gray"
            >
              EXCLUIR
            </ButtonView>
            <ButtonView
              type="button"
              width={vm.submitWidth}
              onClick={vm.handleEdit}
              color="pink"
            >
              EDITAR
            </ButtonView>
          </>
        ) : (
          <>
            <ButtonView
              type="button"
              width={vm.submitWidth}
              onClick={vm.handleCancel}
              color="gray"
            >
              CANCELAR
            </ButtonView>
            <ButtonView
              type="submit"
              width={vm.submitWidth}
              disabled={vm.isLoading}
              color="pink"
            >
              {vm.isLoading ? 'Salvando...' : 'SALVAR'}
            </ButtonView>
          </>
        )}
      </div>
    </form>
  )
}

export default ManagementFormView
