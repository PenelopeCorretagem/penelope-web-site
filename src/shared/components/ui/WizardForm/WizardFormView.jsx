import { InputView } from '@shared/components/ui/Input/InputView'
import { TextAreaView } from '@shared/components/ui/TextArea/TextAreaView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useWizardFormViewModel } from './useWizardFormViewModel'
import { useState, useRef } from 'react'

export function WizardFormView(props) {
  const vm = useWizardFormViewModel(props)
  const [direction, setDirection] = useState('forward')
  const fileInputRefs = useRef({})

  const handleNext = (e) => {
    if (e) e.preventDefault()
    setDirection('forward')
    setTimeout(() => vm.handleNext(), 0)
  }

  const handlePrevious = (e) => {
    if (e) e.preventDefault()
    setDirection('backward')
    setTimeout(() => vm.handlePrevious(), 0)
  }

  const handleGoToStep = (index) => {
    setDirection(index > vm.currentStep ? 'forward' : 'backward')
    setTimeout(() => vm.goToStep(index), 0)
  }

  const animationClass = direction === 'forward'
    ? 'animate-slideInFromRight'
    : 'animate-slideInFromLeft'

  const handleFileButtonClick = (fieldName) => {
    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].click()
    }
  }

  const handleFileChange = (fieldName, multiple = false) => (event) => {
    const files = event.target.files

    if (!files || files.length === 0) return

    if (multiple) {
      const fileArray = Array.from(files)
      const currentFiles = vm.getFieldValue(fieldName) || []
      const updatedFiles = [...currentFiles, ...fileArray]
      vm.handleFieldChange(fieldName)(updatedFiles)
    } else {
      vm.handleFieldChange(fieldName)(files[0])
    }
  }

  const renderField = (field) => {
    const commonProps = {
      key: field.name,
      id: field.name,
      name: field.name,
      value: vm.getFieldValue(field.name),
      onChange: vm.handleFieldChange(field.name),
      hasLabel: field.hasLabel !== undefined ? field.hasLabel : Boolean(field.label),
      required: field.required || false,
      isActive: true,
      children: field.label || '',
    }

    if (field.type === 'heading') {
      return (
        <HeadingView level={3} className="text-distac-primary">
          {field.label}
        </HeadingView>
      )
    }

    if (field.type === 'textarea') {
      return (
        <TextAreaView
          {...commonProps}
          placeholder={field.placeholder || ''}
          rows={field.rows || 4}
        />
      )
    }

    if (field.type === 'select') {
      return (
        <div className="w-full flex flex-col gap-2">
          {field.label && (
            <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
              {field.label}:
            </label>
          )}
          <SelectView
            {...commonProps}
            options={field.options || []}
            width="full"
          />
        </div>
      )
    }

    if (field.type === 'checkbox-group') {
      return (
        <div className="w-full flex flex-row items-center gap-4">
          {field.label && (
            <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
              {field.label}:
            </label>
          )}
          <div className="flex flex-wrap gap-3">
            {(field.options || []).map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={(vm.getFieldValue(field.name) || []).includes(option.value)}
                  onChange={(e) => {
                    const currentValue = vm.getFieldValue(field.name) || []
                    const newValue = e.target.checked
                      ? [...currentValue, option.value]
                      : currentValue.filter(v => v !== option.value)
                    vm.handleFieldChange(field.name)(newValue)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm text-default-dark">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )
    }

    if (field.type === 'file') {
      const currentFiles = vm.getFieldValue(field.name)
      const hasFiles = field.multiple
        ? Array.isArray(currentFiles) && currentFiles.length > 0
        : Boolean(currentFiles)

      return (
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {field.label && (
              <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
                {field.label}:
              </label>
            )}
            <button
              type="button"
              onClick={() => handleFileButtonClick(field.name)}
              className="text-distac-primary hover:text-distac-primary-dark text-2xl font-bold transition-colors"
              title={`Adicionar ${field.label}`}
            >
              +
            </button>
          </div>

          <input
            ref={el => fileInputRefs.current[field.name] = el}
            type="file"
            accept={field.accept}
            multiple={field.multiple}
            onChange={handleFileChange(field.name, field.multiple)}
            className="hidden"
            id={`${field.name}-file-input`}
          />

          {hasFiles && (
            <div className="flex flex-col gap-2 mt-2">
              {field.multiple ? (
                <div className="flex flex-wrap gap-2">
                  {currentFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-distac-primary-light px-3 py-2 rounded text-sm"
                    >
                      <span className="text-default-dark truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = currentFiles.filter((_, i) => i !== index)
                          vm.handleFieldChange(field.name)(updatedFiles)
                        }}
                        className="text-distac-primary hover:text-distac-secondary font-bold"
                        title="Remover arquivo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-distac-primary-light px-3 py-2 rounded text-sm">
                  <span className="text-default-dark truncate max-w-[200px]">
                    {currentFiles.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => vm.handleFieldChange(field.name)(null)}
                    className="text-distac-primary hover:text-distac-secondary font-bold"
                    title="Remover arquivo"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          )}

          {!hasFiles && (
            <div className="text-sm text-default-dark-muted italic">
              Nenhum arquivo selecionado
            </div>
          )}
        </div>
      )
    }

    return (
      <InputView
        {...commonProps}
        type={field.type || 'text'}
        placeholder={field.placeholder || ''}
      />
    )
  }

  // Agrupar campos por groupRow
  const groupFields = (fields) => {
    const groups = []
    const groupMap = new Map()

    fields.forEach(field => {
      if (field.groupRow) {
        if (!groupMap.has(field.groupRow)) {
          groupMap.set(field.groupRow, [])
        }
        groupMap.get(field.groupRow).push(field)
      } else {
        groups.push({ type: 'single', field })
      }
    })

    groupMap.forEach((fieldsInGroup, groupName) => {
      groups.push({ type: 'row', fields: fieldsInGroup, groupName })
    })

    // Reordenar para manter a ordem original
    const orderedGroups = []
    const processedGroups = new Set()

    fields.forEach(field => {
      if (field.groupRow) {
        if (!processedGroups.has(field.groupRow)) {
          orderedGroups.push({
            type: 'row',
            fields: groupMap.get(field.groupRow),
            groupName: field.groupRow
          })
          processedGroups.add(field.groupRow)
        }
      } else {
        orderedGroups.push({ type: 'single', field })
      }
    })

    return orderedGroups
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <HeadingView level={2} className="text-distac-primary">
          {vm.title}
        </HeadingView>
        <div className="flex gap-4">
          <ButtonView
            type="button"
            width="fit"
            color="gray"
            onClick={vm.handleClear}
          >
            LIMPAR
          </ButtonView>
          <ButtonView
            type="button"
            width="fit"
            color="gray"
            onClick={vm.handleDelete}
          >
            EXCLUIR
          </ButtonView>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex gap-6 border-b border-default-light-muted">
        {vm.steps.map((step, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleGoToStep(index)}
            className={`pb-2 text-sm font-semibold uppercase transition-colors ${
              vm.currentStep === index
                ? 'text-distac-primary border-b-2 border-distac-primary'
                : 'text-default-dark-muted hover:text-default-dark'
            }`}
          >
            {step.title || `Etapa ${index + 1}`}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="w-full flex flex-col gap-6">
        <div className="relative w-full overflow-hidden">
          <div
            key={vm.currentStep}
            className={`${animationClass} ${vm.currentStepData.className || 'w-full flex flex-col gap-6'}`}
          >
            {groupFields(vm.currentStepData.fields || []).map((group, groupIndex) => {
              if (group.type === 'single') {
                const field = group.field

                return (
                  <div key={field.name} className={field.containerClassName || 'w-full'}>
                    {renderField(field)}
                    {vm.hasFieldError(field.name) && (
                      <div className="text-red-600 text-sm mt-1">
                        {vm.getFieldError(field.name)}
                      </div>
                    )}
                  </div>
                )
              } else {
                // Verifica se é um grupo especial (heading + checkbox)
                const isHeaderGroup = group.fields.some(f => f.type === 'heading') &&
                                     group.fields.some(f => f.type === 'checkbox-group')

                const rowClasses = isHeaderGroup
                  ? 'w-full flex flex-row items-center justify-between gap-6'
                  : 'w-full flex flex-row gap-6'

                return (
                  <div key={group.groupName || groupIndex} className={rowClasses}>
                    {group.fields.map(field => (
                      <div key={field.name} className={field.containerClassName || 'flex-1'}>
                        {renderField(field)}
                        {vm.hasFieldError(field.name) && (
                          <div className="text-red-600 text-sm mt-1">
                            {vm.getFieldError(field.name)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              }
            })}
          </div>
        </div>

        {/* Success Message */}
        {vm.hasSuccess && (
          <div className="w-full p-3 bg-green-50 border border-green-300 text-green-700 rounded">
            {vm.successMessage}
          </div>
        )}

        {/* Error Messages */}
        {vm.hasErrors && vm.errorMessages.length > 0 && (
          <div className="w-full">
            <ErrorDisplayView
              messages={vm.errorMessages}
              position="inline"
              variant="prominent"
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          {!vm.isFirstStep && (
            <ButtonView
              type="button"
              width="fit"
              color="gray"
              onClick={handlePrevious}
            >
              VOLTAR
            </ButtonView>
          )}

          {vm.isFirstStep && <div></div>}

          <div className="flex gap-4">
            <ButtonView
              type="button"
              width="fit"
              color="gray"
              onClick={vm.handleCancel}
            >
              CANCELAR
            </ButtonView>
            <ButtonView
              type={vm.isLastStep ? 'submit' : 'button'}
              width="fit"
              color="pink"
              disabled={vm.isLoading}
              onClick={vm.isLastStep ? undefined : handleNext}
            >
              {vm.isLoading ? 'Salvando...' : vm.isLastStep ? 'SALVAR' : 'CONTINUAR'}
            </ButtonView>
          </div>
        </div>
      </div>
    </div>
  )
}
