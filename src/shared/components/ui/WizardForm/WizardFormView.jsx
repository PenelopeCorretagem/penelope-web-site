import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ErrorDisplayView } from '@shared/components/feedback/ErrorDisplay/ErrorDisplayView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { AlertView, useAlert } from '@shared/components/feedback/Alert/AlertView'
import { SortButtonView } from '@shared/components/ui/SortButton/SortButtonView'
import { useWizardFormViewModel } from './useWizardFormViewModel'
import { useState, useRef, useMemo } from 'react'
import { GripVertical, Plus } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { formatArea } from '@shared/utils/area/formatAreaUtil'
import { formatCEP } from '@shared/utils/CEP/formatCEPUtil'
import { useCEPAutoFill } from '@shared/hooks/useCEPAutoFill'

export function WizardFormView(props) {
  const vm = useWizardFormViewModel(props)
  const alert = useAlert(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('warning')
  const [direction, setDirection] = useState('forward')
  const [differentialsFilters, setDifferentialsFilters] = useState({})
  const fileInputRefs = useRef({})
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Função para exibir alerta com mensagem e tipo
  const showAlert = (message, type = 'warning') => {
    setAlertMessage(message)
    setAlertType(type)
    alert.show()
  }

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

  // Hook para preenchimento automático de CEP do IMÓVEL
  const cepAutoFillProperty = useCEPAutoFill(
    (addressData) => {
      // Preencher apenas campos do IMÓVEL
      if (addressData.street) {
        vm.handleFieldChange('street')(addressData.street)
      }
      if (addressData.neighborhood) {
        vm.handleFieldChange('neighborhood')(addressData.neighborhood)
      }
      if (addressData.city) {
        vm.handleFieldChange('city')(addressData.city)
      }
      if (addressData.uf) {
        vm.handleFieldChange('state')(addressData.uf)
      }
    },
    {
      debounceDelay: 800,
      enableAutoFill: true,
      onError: (error) => {
        showAlert(error, 'warning')
      }
    }
  )

  // Hook para preenchimento automático de CEP do STAND
  const cepAutoFillStand = useCEPAutoFill(
    (addressData) => {
      // Preencher apenas campos do STAND
      if (addressData.street) {
        vm.handleFieldChange('standStreet')(addressData.street)
      }
      if (addressData.neighborhood) {
        vm.handleFieldChange('standNeighborhood')(addressData.neighborhood)
      }
      if (addressData.city) {
        vm.handleFieldChange('standCity')(addressData.city)
      }
      if (addressData.uf) {
        vm.handleFieldChange('standState')(addressData.uf)
      }
    },
    {
      debounceDelay: 800,
      enableAutoFill: true,
      onError: (error) => {
        showAlert(error, 'warning')
      }
    }
  )

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

    // Verificar se é um campo do stand e se deve ser desabilitado
    const isStandField = field.name.startsWith('stand') && field.name !== 'enableStandAddress'
    const standEnabled = Boolean(vm.getFieldValue('enableStandAddress'))

    // Se é campo do stand e o checkbox não está marcado, desabilitar
    if (isStandField && !standEnabled) {
      commonProps.disabled = true
    } else {
      commonProps.disabled = field.disabled || false
    }

    // Aplicar formatação para campos específicos
    if (field.name === 'area' && field.type === 'text') {
      commonProps.formatOnChange = true
      commonProps.formatter = formatArea

      // Adicionar handler especial para área
      const originalOnChange = commonProps.onChange
      commonProps.onChange = (value) => {
        // Se o cursor está no final (após m²), mover para antes do sufixo
        setTimeout(() => {
          const input = document.getElementById(field.name)
          if (input && value.includes('m²')) {
            const cursorPosition = value.indexOf(' m²')
            if (input.selectionStart >= cursorPosition && cursorPosition > 0) {
              input.setSelectionRange(cursorPosition, cursorPosition)
            }
          }
        }, 0)

        originalOnChange(value)
      }
    }

    // Aplicar formatação para CEP do IMÓVEL
    if (field.name === 'cep' && field.type === 'text') {
      commonProps.formatOnChange = true
      commonProps.formatter = formatCEP

      const originalOnChange = commonProps.onChange
      commonProps.onChange = (value) => {
        originalOnChange(value)

        // Disparar busca automática apenas para campos do IMÓVEL
        setTimeout(() => {
          cepAutoFillProperty.searchCEP(value)
        }, 100)
      }
    }

    // Aplicar formatação para CEP do STAND
    if (field.name === 'standCep' && field.type === 'text') {
      commonProps.formatOnChange = true
      commonProps.formatter = formatCEP

      const originalOnChange = commonProps.onChange
      commonProps.onChange = (value) => {
        originalOnChange(value)

        // Disparar busca automática apenas para campos do STAND (se habilitado)
        if (standEnabled) {
          setTimeout(() => {
            cepAutoFillStand.searchCEP(value)
          }, 100)
        }
      }
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
      // Processar opções - garantir que sejam objetos com value e label
      let processedOptions = []

      if (Array.isArray(field.options)) {
        processedOptions = field.options.map(option => {
          if (typeof option === 'string') {
            return { value: option, label: option }
          }
          return option
        })
      }

      return (
        <SelectView
          key={`${field.name}-select-${processedOptions.length}-${commonProps.disabled ? 'disabled' : 'enabled'}`}
          id={field.name}
          name={field.name}
          value={vm.getFieldValue(field.name)}
          onChange={(e) => vm.handleFieldChange(field.name)(e.target.value)}
          variant={commonProps.disabled ? 'default' : 'pink'}
          options={processedOptions}
          width="full"
          className="w-full"
          disabled={commonProps.disabled}
          hasLabel={Boolean(field.label)}
          size={field.size}
        >
          {field.label}
        </SelectView>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <InputView
          id={field.name}
          name={field.name}
          type="checkbox"
          placeholder={field.placeholder || field.label}
          checked={Boolean(vm.getFieldValue(field.name))}
          onChange={(checked) => vm.handleFieldChange(field.name)(checked)}
          hasLabel={Boolean(field.label)}
          required={field.required || false}
          disabled={field.disabled}
        >
          {field.label || ''}
        </InputView>
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
            <div className={field.groupClassName || 'flex flex-wrap gap-3 md:gap-4'}>
              {(field.options || []).map(option => (
                <InputView
                  key={option.value}
                  id={`${field.name}_${option.value}`}
                  name={`${field.name}[]`}
                  type="checkbox"
                  placeholder={option.label}
                  checked={(vm.getFieldValue(field.name) || []).includes(option.value)}
                  onChange={(checked) => {
                    const currentValue = vm.getFieldValue(field.name) || []
                    const newValue = checked
                      ? [...currentValue, option.value]
                      : currentValue.filter(v => v !== option.value)
                    vm.handleFieldChange(field.name)(newValue)
                  }}
                  hasLabel={false}
                  disabled={field.disabled}
                />
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (field.type === 'differentials-grid') {
      const currentValue = vm.getFieldValue(field.name) || []
      
      // Obter filtros do estado compartilhado
      const filters = differentialsFilters[field.name] || {
        searchTerm: '',
        initialLetter: '',
        sortOrder: 'none'
      }
      
      const handleFilterChange = (filterKey, filterValue) => {
        setDifferentialsFilters(prev => ({
          ...prev,
          [field.name]: {
            ...filters,
            [filterKey]: filterValue
          }
        }))
      }
      
      const renderIcon = (iconName) => {
        if (!iconName) return null
        try {
          const Icon = LucideIcons[iconName]
          return <Icon size={24} strokeWidth={2} />
        } catch {
          return null
        }
      }

      // Obter letras iniciais disponíveis
      const availableInitials = (() => {
        const letters = new Set()
        ;(field.options || []).forEach(option => {
          const first = option.label.charAt(0).toUpperCase()
          if (first) letters.add(first)
        })
        return Array.from(letters).sort()
      })()

      // Filtrar e ordenar as opções
      const filteredOptions = (() => {
        let filtered = [...(field.options || [])]

        // Filtro por busca
        if (filters.searchTerm) {
          filtered = filtered.filter(option =>
            option.label.toLowerCase().includes(filters.searchTerm.toLowerCase())
          )
        }

        // Filtro por letra inicial
        if (filters.initialLetter) {
          filtered = filtered.filter(option =>
            option.label.charAt(0).toUpperCase() === filters.initialLetter
          )
        }

        // Ordenação
        if (filters.sortOrder === 'ascending') {
          filtered.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'))
        } else if (filters.sortOrder === 'descending') {
          filtered.sort((a, b) => b.label.localeCompare(a.label, 'pt-BR'))
        }

        return filtered
      })()
      
      return (
        <div className={`w-full flex flex-col gap-4 ${field.className || ''}`}>
          {field.label && (
            <label className="uppercase font-semibold font-default text-[12px] leading-none md:text-[16px] text-default-dark-muted">
              {field.label}:
            </label>
          )}

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <InputView
                type="text"
                placeholder="Buscar diferencial..."
                value={filters.searchTerm}
                onChange={(value) => handleFilterChange('searchTerm', value)}
                hasLabel={false}
                isActive={true}
              />
            </div>

            {/* Inicial Letter Filter */}
            <div className="w-full md:w-fit">
              <SelectView
                value={filters.initialLetter}
                name="initialLetter"
                id="initialLetter"
                options={[
                  { value: '', label: 'Todas as letras' },
                  ...availableInitials.map(letter => ({
                    value: letter,
                    label: letter,
                  })),
                ]}
                width="fit"
                variant="brown"
                shape="square"
                hasLabel={false}
                onChange={(e) => handleFilterChange('initialLetter', e.target.value)}
              />
            </div>

            {/* Sort Button */}
            <div className="w-full md:w-fit">
              <SortButtonView
                sortOrder={filters.sortOrder === 'ascending' ? 'ascending' : filters.sortOrder === 'descending' ? 'descending' : 'none'}
                onSortChange={(newOrder) => handleFilterChange('sortOrder', newOrder)}
                title="Ordenar A-Z"
                width="fit"
                shape="square"
                color="brown"
              />
            </div>
          </div>

          {/* Grid de Diferenciais */}
          <div className="w-full h-full overflow-hidden bg-distac-primary-light rounded-sm px-4 py-2 transition-colors duration-200">
            {filteredOptions.length === 0 ? (
              <div className="w-full h-full overflow-y-auto flex items-center justify-center text-default-dark-muted text-sm py-8">
                Nenhum diferencial encontrado com esses critérios
              </div>
            ) : (
              <div className="w-full h-full overflow-y-auto grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4">
                {filteredOptions.map(option => {
                  const isSelected = currentValue.includes(option.value)
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const newValue = isSelected
                          ? currentValue.filter(v => v !== option.value)
                          : [...currentValue, option.value]
                        vm.handleFieldChange(field.name)(newValue)
                      }}
                      disabled={field.disabled}
                      className={`p-3 rounded-lg transition text-center font-medium text-sm flex flex-col items-center gap-2 ${
                        isSelected
                          ? 'bg-distac-primary text-white'
                          : 'bg-white text-distac-primary border-2 border-distac-primary hover:bg-slate-50'
                      } ${field.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'text-white' : 'text-distac-primary'
                      }`}>
                        {renderIcon(option.icon)}
                      </div>
                      <span>{option.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
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
            <div className="flex flex-col gap-card md:gap-card-md flex-1 h-full max-h-[400px]">
              {field.multiple ? (
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-distac-primary-light rounded-lg p-4 h-full overflow-y-auto content-start min-h-[160px]"
                  onClick={() => handleFileButtonClick(field.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleFileButtonClick(field.name)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Adicionar arquivos para ${field.label}`}
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
                        onKeyDown={(e) => {
                          e.stopPropagation()
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                          }
                        }}
                        role="listitem"
                        tabIndex={0}
                        aria-label={`Arquivo ${file.name}, posição ${index + 1}`}
                        className={`relative aspect-square rounded-lg overflow-hidden group cursor-move shadow-sm border-2 transition-all bg-white ${
                          draggedIndex === index ? 'opacity-50 border-distac-primary' : 'border-transparent hover:border-distac-primary/50'
                        } ${
                          dragOverIndex === index && draggedIndex !== index ? 'border-distac-primary scale-105' : ''
                        }`}
                      >
                        {showImage ? (
                          <img
                            src={imageUrl}
                            alt={file.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2">
                            <span className="text-default-dark text-xs text-center break-all line-clamp-3">
                              {file.name}
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-between items-start">
                            <div className="bg-black/40 rounded p-1 cursor-move">
                              <GripVertical size={16} className="text-white drop-shadow-md" />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                const updatedFiles = currentFiles.filter((_, i) => i !== index)
                                vm.handleFieldChange(field.name)(updatedFiles)
                              }}
                              className="text-white hover:text-red-400 bg-black/60 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                              title="Remover arquivo"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="relative w-full h-full max-h-72 flex-1 bg-distac-primary-light rounded-sm overflow-hidden group">
                  {isImageFile(currentFiles) && getImagePreview(currentFiles) ? (
                    <>
                      <img
                        src={getImagePreview(currentFiles)}
                        alt={currentFiles.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => vm.handleFieldChange(field.name)(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            vm.handleFieldChange(field.name)(null)
                          }
                        }}
                        aria-label={`Remover arquivo ${currentFiles.name}`}
                        className="absolute top-2 right-2 bg-distac-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xl cursor-pointer hover:bg-distac-secondary transition-colors shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
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
              className="w-full h-full max-h-72 flex-1 bg-distac-primary-light rounded-sm px-4 py-2 flex items-center justify-center text-[12px] md:text-[16px] text-default-dark-muted italic cursor-pointer hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-distac-primary"
              onClick={() => handleFileButtonClick(field.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleFileButtonClick(field.name)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Selecionar arquivo para ${field.label}`}
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
      <form
        className="w-full h-full flex-1 flex flex-col gap-card md:gap-card-md"
        onSubmit={(e) => {

          vm.handleSubmit(e)
        }}
      >
        <div className="relative w-full h-full flex-1">
          <div
            key={vm.currentStep}
            className={`${animationClass} h-full ${vm.currentStepData.className || 'flex flex-col gap-card md:gap-card-md'}`}
          >
            {(vm.currentStepData.groups || []).map((group, groupIndex) => (
              <div key={groupIndex} className={group.className || 'w-full'}>
                {group.fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.containerClassName || 'flex-1'}
                  >
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
              onClick={(e) => {

                handlePrevious(e)
              }}
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
              onClick={(e) => {

                vm.handleCancel()
              }}
            >
              CANCELAR
            </ButtonView>

            {!vm.isLastStep && (
              <ButtonView
                type="button"
                width="fit"
                color="pink"
                disabled={vm.isLoading}
                onClick={(e) => {

                  handleNext(e)
                }}
              >
                CONTINUAR
              </ButtonView>
            )}

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

      {/* Alert for CEP errors */}
      <AlertView
        isVisible={alert.isVisible}
        type={alertType}
        message={alertMessage}
        onClose={alert.hide}
        hasCloseButton={true}
      />
    </div>
  )
}
