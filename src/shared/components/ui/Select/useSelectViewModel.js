import { useState, useCallback, useRef, useEffect } from 'react'
import { SelectViewModel } from './SelectViewModel'

/**
 * Hook que conecta o SelectViewModel com React
 */
export function useSelectViewModel(initialProps = {}) {
  const [viewModel] = useState(() => new SelectViewModel(initialProps))
  const [, forceUpdate] = useState(0)
  const selectRef = useRef(null)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // Sincronizar valor externo com o modelo interno
  useEffect(() => {
    if (initialProps.value !== undefined && initialProps.value !== viewModel.value) {
      viewModel.updateValue(initialProps.value)
      refresh()
    }
  }, [initialProps.value, viewModel, refresh])

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        if (viewModel.setOpen(false)) {
          refresh()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [viewModel, refresh])

  // Event handlers
  const handleToggle = useCallback(() => {
    if (viewModel.handleToggle()) {
      refresh()
    }
  }, [viewModel, refresh])

  const handleOptionClick = useCallback((optionValue) => {
    if (viewModel.handleOptionClick(optionValue)) {
      refresh()
    }
  }, [viewModel, refresh])

  const handleKeyDown = useCallback((event) => {
    if (viewModel.handleKeyDown(event)) {
      refresh()
    }
  }, [viewModel, refresh])

  // Comandos
  const commands = {
    updateValue: useCallback((newValue) => {
      if (viewModel.updateValue(newValue)) {
        refresh()
        return true
      }
      return false
    }, [viewModel, refresh]),

    updateOptions: useCallback((newOptions) => {
      if (viewModel.updateOptions(newOptions)) {
        refresh()
        return true
      }
      return false
    }, [viewModel, refresh]),

    clear: useCallback(() => {
      if (viewModel.clear()) {
        refresh()
        return true
      }
      return false
    }, [viewModel, refresh]),

    validate: useCallback(() => {
      const isValid = viewModel.validate()
      refresh()
      return isValid
    }, [viewModel, refresh]),

    setOpen: useCallback((open) => {
      if (viewModel.setOpen(open)) {
        refresh()
        return true
      }
      return false
    }, [viewModel, refresh]),
  }

  return {
    // Referência
    selectRef,

    // Estado do modelo
    value: viewModel.value,
    name: viewModel.name,
    id: viewModel.id,
    options: viewModel.options,
    width: viewModel.width,
    variant: viewModel.variant,
    shape: viewModel.shape,
    disabled: viewModel.disabled,
    required: viewModel.required,
    placeholder: viewModel.placeholder,
    isOpen: viewModel.isOpen,
    hasValue: viewModel.hasValue,
    isEmpty: viewModel.isEmpty,
    isEditable: viewModel.isEditable,
    selectedOption: viewModel.selectedOption,
    displayValue: viewModel.displayValue,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // Handlers
    handleToggle,
    handleOptionClick,
    handleKeyDown,

    // Comandos
    ...commands,

    // Estado completo
    getState: viewModel.getState,
  }
}
