import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useWizardFormViewModel } from './useWizardFormViewModel'
import { useState, useRef } from 'react'
import { GripVertical, Plus } from 'lucide-react'

export function WizardFormView(props) {
  const vm = useWizardFormViewModel(props)
  const [direction, setDirection] = useState('forward')
  const fileInputRefs = useRef({})
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

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

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDrop = (e, fieldName, dropIndex) => {
    e.preventDefault()

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const currentFiles = vm.getFieldValue(fieldName) || []
    const newFiles = [...currentFiles]
    const [draggedFile] = newFiles.splice(draggedIndex, 1)
    newFiles.splice(dropIndex, 0, draggedFile)

    vm.handleFieldChange(fieldName)(newFiles)
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Função para obter URL de prévia da imagem
  const getImagePreview = (file) => {
    if (!file) return null

    // Se já tem uma URL de prévia (arquivo existente da API)
    if (file.preview) return file.preview

    // Se tem URL direta
    if (file.url) return file.url

    // Se é um arquivo novo do input, cria URL temporária
    if (file instanceof File) {
      return URL.createObjectURL(file)
    }

    return null
  }

  // Verificar se o arquivo é uma imagem
  const isImageFile = (file) => {
    if (!file) return false

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

    if (file.type) {
      return imageTypes.includes(file.type)
    }

    if (file.name) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
    }

    return false
  }

  const renderField = (field) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: vm.getFieldValue(field.name),
      onChange: vm.handleFieldChange(field.name),
      hasLabel: field.hasLabel !== undefined ? field.hasLabel : Boolean(field.label),
      required: field.required || false,
      children: field.label || '',
      className: field.className || '',
    }

    if (field.type === 'heading') {
      return (
        <HeadingView level={3} className={`text-distac-primary ${field.className || ''}`}>
          {field.label}
        </HeadingView>
      )
    }

    if (field.type === 'textarea') {
      return (
        <div className="w-full h-full flex flex-col gap-2 flex-1">
          {field.label && (
            <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
              {field.label}:
            </label>
          )}
          <textarea
            id={field.name}
            name={field.name}
            value={vm.getFieldValue(field.name)}
            onChange={(e) => vm.handleFieldChange(field.name)(e.target.value)}
            placeholder={field.placeholder || field.label || ''}
            rows={field.rows || 4}
            required={field.required || false}
            className={`w-full flex-1 px-4 py-2 rounded-sm bg-distac-primary-light text-[12px] md:text-[16px] leading-normal resize-none focus:bg-default-light focus:ring-2 focus:ring-distac-primary focus:outline-none transition-colors duration-200 placeholder:text-default-dark-muted placeholder:text-[12px] md:placeholder:text-[16px] placeholder:uppercase placeholder:font-default ${field.className || ''}`}
          />
        </div>
      )
    }

    if (field.type === 'select') {
      // Debug específico para o campo responsible
      if (field.name === 'responsible') {
        console.log('🔧 [SELECT DEBUG] Renderizando campo responsible:', {
          fieldName: field.name,
          currentValue: vm.getFieldValue(field.name),
          optionsCount: field.options?.length || 0,
          options: field.options,
          disabled: field.disabled,
          timestamp: new Date().toISOString()
        })
      }

      return (
        <div key={`${field.name}-${field.options?.length || 0}`} className="w-full flex flex-col gap-2">
          {field.label && (
            <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
              {field.label}:
            </label>
          )}
          <SelectView
            key={`${field.name}-select-${field.options?.length || 0}`}
            id={field.name}
            name={field.name}
            value={vm.getFieldValue(field.name)}
            onChange={(e) => vm.handleFieldChange(field.name)(e.target.value)}
            variant="pink"
            options={field.options || []}
            width="full"
            className={field.className || ''}
            disabled={field.disabled}
          />
        </div>
      )
    }

    if (field.type === 'checkbox-group') {
      return (
        <div className={`w-full flex flex-col gap-2 ${field.className || ''}`}>
          {field.label && (
            <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
              {field.label}:
            </label>
          )}
          <div className="w-full bg-distac-primary-light rounded-sm px-4 py-2 transition-colors duration-200">
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
                    className="w-4 h-4 accent-distac-primary cursor-pointer"
                  />
                  <span className="text-[12px] md:text-[16px] text-default-dark">{option.label}</span>
                </label>
              ))}
            </div>
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
        <div className={`w-full h-full flex flex-col gap-card md:gap-card-md ${field.className || ''}`}>
          <div className="flex items-center justify-between">
            {field.label && (
              <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
                {field.label}:
              </label>
            )}
            <button
              type="button"
              onClick={() => handleFileButtonClick(field.name)}
              className=" text-distac-primary hover:scale-105 transition-all cursor-pointer"
              title={`Adicionar ${field.label}`}
            >
              <Plus size={30} />
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

          {hasFiles ? (
            <div className="flex flex-col gap-card md:gap-card-md flex-1 h-full">
              {field.multiple ? (
                <div
                  className="flex flex-col gap-2 bg-distac-primary-light rounded-sm p-4 h-full overflow-y-auto"
                  onClick={() => handleFileButtonClick(field.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleFileButtonClick(field.name)
                    }
                  }}
                >
                  {currentFiles.map((file, index) => {
                    const imageUrl = getImagePreview(file)
                    const showImage = isImageFile(file) && imageUrl

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => handleDrop(e, field.name, index)}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center gap-3 bg-default-light px-3 py-2 rounded-sm cursor-move transition-all ${
                          draggedIndex === index ? 'opacity-50' : ''
                        } ${
                          dragOverIndex === index && draggedIndex !== index ? 'border-2 border-distac-primary' : ''
                        }`}
                      >
                        <GripVertical size={16} className="text-default-dark-muted flex-shrink-0" />

                        {showImage ? (
                          <img
                            src={imageUrl}
                            alt={file.name}
                            className="w-16 h-16 object-cover rounded-sm flex-shrink-0"
                          />
                        ) : (
                          <span className="text-default-dark text-sm truncate flex-1">
                            {file.name}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const updatedFiles = currentFiles.filter((_, i) => i !== index)
                            vm.handleFieldChange(field.name)(updatedFiles)
                          }}
                          className="text-distac-primary hover:text-distac-secondary font-bold text-xl cursor-pointer flex-shrink-0 ml-auto"
                          title="Remover arquivo"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="relative w-full h-full flex-1 bg-distac-primary-light rounded-sm overflow-hidden group">
                  {isImageFile(currentFiles) && getImagePreview(currentFiles) ? (
                    <>
                      <img
                        src={getImagePreview(currentFiles)}
                        alt={currentFiles.name}
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => vm.handleFieldChange(field.name)(null)}
                        className="absolute top-2 right-2 bg-distac-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl cursor-pointer hover:bg-distac-secondary transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        title="Remover arquivo"
                      >
                        ×
                      </button>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full h-full flex-1 bg-distac-primary-light rounded-sm px-4 py-2 flex items-center justify-center text-[12px] md:text-[16px] text-default-dark-muted italic cursor-pointer hover:bg-opacity-90 transition-colors"
              onClick={() => handleFileButtonClick(field.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleFileButtonClick(field.name)
                }
              }}
            >
              Nenhum arquivo selecionado
            </div>
          )}
        </div>
      )
    }

    return (
      <InputView
        key={field.name}
        {...commonProps}
        type={field.type || 'text'}
        placeholder={field.placeholder || field.label || ''}
      />
    )
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
            color="soft-gray"
            onClick={vm.handleClear}
          >
            LIMPAR
          </ButtonView>
          {vm.onDelete && (
            <ButtonView
              type="button"
              width="fit"
              color="gray"
              onClick={vm.handleDelete}
            >
              EXCLUIR
            </ButtonView>
          )}
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex gap-card md:gap-card-md border-b border-default-light-muted">
        {vm.steps.map((step, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleGoToStep(index)}
            className={`pb-2 text-sm font-semibold uppercase transition-colors cursor-pointer ${
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
      <div className="w-full h-full flex-1 flex flex-col gap-card md:gap-card-md">
        <div className="relative w-full h-full flex-1">
          <div
            key={vm.currentStep}
            className={`${animationClass} h-full ${vm.currentStepData.className || 'flex flex-col gap-card md:gap-card-md'}`}
          >
            {(vm.currentStepData.groups || []).map((group, groupIndex) => (
              <div key={groupIndex} className={group.className || 'w-full'}>
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
            ))}
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
              color="brown"
              onClick={handlePrevious}
            >
              VOLTAR
            </ButtonView>
          )}

          {vm.isFirstStep && <div></div>}

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
