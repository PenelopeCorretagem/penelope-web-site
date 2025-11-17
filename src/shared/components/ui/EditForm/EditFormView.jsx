import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useEditFormViewModel } from './useEditFormViewModel'

/**
 * EditFormView - Formulário especializado para operações CRUD
 */
export function EditFormView({
  title = '',
  fields = [],
  initialData = {},
  onSubmit,
  onCancel,
  onDelete,
  isEditing: initialIsEditing = false,
  showDeleteButton = true,
}) {
  const vm = useEditFormViewModel({
    title,
    fields,
    initialData,
    onSubmit,
    onCancel,
    onDelete,
    isEditing: initialIsEditing,
  })

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {vm.title && (
          <HeadingView level={2} className="text-distac-primary">
            {vm.title}
          </HeadingView>
        )}
      </div>

      {/* Success Message */}
      {vm.hasSuccess && (
        <div className="w-full p-3 bg-green-50 border border-green-300 text-green-700 rounded">
          {vm.successMessage}
        </div>
      )}

      {/* Error Messages */}
      {vm.hasErrors && (
        <div className="w-full">
          <ErrorDisplayView
            messages={vm.errorMessages}
            position="inline"
            variant="prominent"
          />
        </div>
      )}

      {/* Form Content */}
      <div className="w-full h-full flex-1 flex flex-col gap-card md:gap-card-md">
        {!vm.isEditing ? (
          /* Modo visualização */
          <>
            <div className="w-full grid grid-cols-6 gap-4">
              {vm.fields
                .filter(field => !field.hideInViewMode)
                .map((field) => (
                  <div key={field.name} className={field.gridColumn || 'col-span-6'}>
                    {field.type === 'select' ? (
                      <SelectView
                        value={vm.getFieldValue(field.name)}
                        options={field.options || []}
                        placeholder={field.placeholder || 'Selecione...'}
                        disabled={true}
                        hasLabel={Boolean(field.label)}
                        width="full"
                        variant="default"
                      >
                        {field.label || ''}
                      </SelectView>
                    ) : field.type === 'hidden' || field.hideInViewMode ? (
                      <div></div> // Placeholder vazio
                    ) : field.type === 'checkbox-group' ? (
                      <div className="w-full flex flex-col gap-2">
                        <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
                          {field.label}:
                        </label>
                        <div className={`w-full rounded-sm p-button-rectangle md:p-button-rectangle-md transition-colors duration-200 bg-default-light-muted opacity-75`}>
                          <div className="flex flex-wrap gap-3">
                            {field.options?.map(option => {
                              const currentValue = vm.getFieldValue(field.name) || []
                              const isSelected = Array.isArray(currentValue) && currentValue.includes(option.value)

                              return (
                                <div key={option.value} className="flex items-center">
                                  <InputView
                                    type="checkbox"
                                    checked={isSelected}
                                    disabled={true}
                                    placeholder={option.label}
                                    hasLabel={false}
                                    isActive={false}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <InputView
                        id={field.name}
                        name={field.name}
                        type={field.type || 'text'}
                        value={vm.getFieldValue(field.name)}
                        hasLabel={Boolean(field.label)}
                        disabled={true}
                        isActive={false}
                        showPasswordToggle={false}
                      >
                        {field.label || ''}
                      </InputView>
                    )}
                  </div>
                ))}
            </div>

            {/* Buttons - View Mode */}
            <div className="flex items-center justify-between">
              <div></div>
              <div className="flex gap-card md:gap-card-md">
                {showDeleteButton && (
                  <ButtonView
                    type="button"
                    width="fit"
                    color="gray"
                    onClick={vm.handleDelete}
                  >
                    EXCLUIR
                  </ButtonView>
                )}
                <ButtonView
                  type="button"
                  width="fit"
                  color="pink"
                  onClick={vm.handleEdit}
                >
                  EDITAR
                </ButtonView>
              </div>
            </div>
          </>
        ) : (
          /* Modo edição */
          <form onSubmit={vm.handleSubmit} className="w-full h-full flex-1 flex flex-col gap-card md:gap-card-md">
            <div className="w-full grid grid-cols-6 gap-4">
              {vm.fields.map((field) => (
                <div key={field.name} className={field.gridColumn || 'col-span-6'}>
                  {field.type === 'select' ? (
                    <SelectView
                      value={vm.getFieldValue(field.name)}
                      options={field.options || []}
                      placeholder={field.placeholder || 'Selecione...'}
                      disabled={field.disabled}
                      hasLabel={Boolean(field.label)}
                      width="full"
                      variant={field.disabled ? 'default' : 'pink'}
                      onChange={vm.handleFieldChange(field.name)}
                    >
                      {field.label || ''}
                    </SelectView>
                  ) : field.type === 'hidden' || field.hideInEditMode ? (
                    <div></div> // Placeholder vazio
                  ) : field.type === 'checkbox-group' ? (
                    <div className="w-full flex flex-col gap-2">
                      <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
                        {field.label}:
                      </label>
                      <div className={`w-full rounded-sm p-button-rectangle md:p-button-rectangle-md transition-colors duration-200 ${
                        field.disabled
                          ? 'bg-default-light-muted opacity-75'
                          : 'bg-distac-primary-light'
                      }`}
                      >
                        <div className="flex flex-wrap gap-3">
                          {field.options?.map(option => {
                            const currentValue = vm.getFieldValue(field.name) || []
                            const isChecked = Array.isArray(currentValue) && currentValue.includes(option.value)

                            return (
                              <div key={option.value} className="flex items-center">
                                <InputView
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={field.disabled}
                                  placeholder={option.label}
                                  hasLabel={false}
                                  onChange={(checked) => {
                                    if (field.mutuallyExclusive) {
                                      // Para checkboxes mutuamente exclusivos, apenas um pode estar selecionado
                                      const newValue = checked ? [option.value] : []
                                      vm.handleFieldChange(field.name)({ target: { value: newValue } })
                                    } else {
                                      // Para checkboxes normais, adiciona/remove da lista
                                      const newValue = checked
                                        ? [...currentValue, option.value]
                                        : currentValue.filter(v => v !== option.value)
                                      vm.handleFieldChange(field.name)({ target: { value: newValue } })
                                    }
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <InputView
                      id={field.name}
                      name={field.name}
                      type={field.type || 'text'}
                      placeholder={field.placeholder || ''}
                      value={vm.getFieldValue(field.name)}
                      onChange={vm.handleFieldChange(field.name)}
                      hasLabel={Boolean(field.label)}
                      required={field.required || false}
                      showPasswordToggle={field.showPasswordToggle && field.type === 'password'}
                      isActive={true}
                      disabled={field.disabled}
                      formatOnChange={field.formatOnChange}
                      formatter={field.formatter}
                    >
                      {field.label || ''}
                    </InputView>
                  )}
                </div>
              ))}
            </div>

            {/* Buttons - Edit Mode */}
            <div className="flex items-center justify-between">
              <div></div>
              <div className="flex gap-card md:gap-card-md">
                <ButtonView
                  type="button"
                  width="fit"
                  color="gray"
                  onClick={vm.handleCancel}
                >
                  CANCELAR
                </ButtonView>
                <ButtonView
                  type="submit"
                  width="fit"
                  color="pink"
                  disabled={vm.isLoading}
                >
                  {vm.isLoading ? 'Salvando...' : 'SALVAR'}
                </ButtonView>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
