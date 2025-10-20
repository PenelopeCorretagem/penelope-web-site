import { useState, useCallback } from 'react'
import { InputModel } from '@shared/components/ui/Input/InputModel'
import {
  getInputThemeClasses,
  getInputLabelThemeClasses,
  getInputContainerThemeClasses,
  getInputErrorThemeClasses
} from '@shared/styles/theme'

/**
 * InputViewModel - Gerencia a lógica e apresentação do Input
 * Centraliza a lógica de CSS e comportamento de campos de entrada
 */
class InputViewModel {
  constructor(model = new InputModel()) {
    this.model = model
    this.errors = []
  }

  // Getters de dados
  get value() {
    return this.model.value
  }

  get placeholder() {
    return this.model.placeholder
  }

  get type() {
    return this.model.type
  }

  get id() {
    return this.model.id
  }

  get name() {
    return this.model.name
  }

  get label() {
    return this.model.label
  }

  get isActive() {
    return this.model.isActive
  }

  get hasLabel() {
    return this.model.hasLabel
  }

  get required() {
    return this.model.required
  }

  get disabled() {
    return this.model.disabled
  }

  get readOnly() {
    return this.model.readOnly
  }

  get hasValue() {
    return this.model.hasValue
  }

  get isEmpty() {
    return this.model.isEmpty
  }

  get isEditable() {
    return this.model.isEditable
  }

  get shouldShowLabel() {
    return this.model.shouldShowLabel
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  get isValid() {
    return this.model.isValid && !this.hasErrors
  }

  // Lógica de CSS - centralizada no ViewModel usando theme
  get inputClasses() {
    return getInputThemeClasses({
      isActive: this.isActive,
      disabled: this.disabled,
      hasErrors: this.hasErrors,
      withToggle: false, // será ajustado pelo componente quando necessário
      className: '',
    })
  }

  get labelClasses() {
    return getInputLabelThemeClasses({
      hasErrors: this.hasErrors,
      required: this.required,
      className: '',
    })
  }

  get containerClasses() {
    return getInputContainerThemeClasses()
  }

  get errorClasses() {
    return getInputErrorThemeClasses()
  }

  // Métodos de ação
  updateValue = newValue => {
    try {
      const updated = this.model.updateValue(newValue)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar valor: ${error.message}`)
      return false
    }
  }

  updatePlaceholder = newPlaceholder => {
    try {
      const updated = this.model.updatePlaceholder(newPlaceholder)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar placeholder: ${error.message}`)
      return false
    }
  }

  updateType = newType => {
    try {
      const updated = this.model.updateType(newType)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar tipo: ${error.message}`)
      return false
    }
  }

  updateLabel = newLabel => {
    try {
      const updated = this.model.updateLabel(newLabel)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar label: ${error.message}`)
      return false
    }
  }

  setActive = active => {
    try {
      const updated = this.model.setActive(active)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar estado ativo: ${error.message}`)
      return false
    }
  }

  setDisabled = disabled => {
    try {
      const updated = this.model.setDisabled(disabled)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar estado desabilitado: ${error.message}`)
      return false
    }
  }

  setRequired = required => {
    try {
      const updated = this.model.setRequired(required)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar obrigatoriedade: ${error.message}`)
      return false
    }
  }

  clear = () => {
    try {
      const updated = this.model.clear()
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao limpar campo: ${error.message}`)
      return false
    }
  }

  // Event handlers
  handleChange = event => {
    const newValue = event.target.value
    this.updateValue(newValue)
  }



  // Validação básica
  validateInput() {
    this.clearErrors()

    if (this.required && this.isEmpty) {
      this.addError('Este campo é obrigatório')
    }

    if (this.type === 'email' && this.hasValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.value)) {
        this.addError('Email inválido')
      }
    }

    return !this.hasErrors
  }

  // Gerenciamento de erros
  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }

  // Métodos utilitários
  getState() {
    return {
      ...this.model.toJSON(),
      hasErrors: this.hasErrors,
      errorMessages: this.errorMessages,
      classes: {
        container: this.containerClasses,
        label: this.labelClasses,
        input: this.inputClasses,
      }
    }
  }

  focus() {
    // Retorna referência para focar o input
    return { focus: true }
  }
}

/**
 * Hook para gerenciar estado e interações do Input
 * Factory Pattern - cria o modelo internamente
 */
export function useInputViewModel(initialProps = {}) {
  const [viewModel] = useState(() => {
    const model = new InputModel(initialProps)
    return new InputViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateValue: value => {
      const success = viewModel.updateValue(value)
      if (success) refresh()
      return success
    },

    updatePlaceholder: placeholder => {
      const success = viewModel.updatePlaceholder(placeholder)
      if (success) refresh()
      return success
    },

    updateType: type => {
      const success = viewModel.updateType(type)
      if (success) refresh()
      return success
    },

    updateLabel: label => {
      const success = viewModel.updateLabel(label)
      if (success) refresh()
      return success
    },

    setActive: active => {
      const success = viewModel.setActive(active)
      if (success) refresh()
      return success
    },

    setDisabled: disabled => {
      const success = viewModel.setDisabled(disabled)
      if (success) refresh()
      return success
    },

    setRequired: required => {
      const success = viewModel.setRequired(required)
      if (success) refresh()
      return success
    },

    clear: () => {
      const success = viewModel.clear()
      if (success) refresh()
      return success
    },

    clearErrors: () => {
      viewModel.clearErrors()
      refresh()
    },

    validateInput: () => {
      const isValid = viewModel.validateInput()
      refresh()
      return isValid
    },
  }

  // Event handlers que incluem refresh
  const handleChange = useCallback((event) => {
    viewModel.handleChange(event)
    refresh()
  }, [viewModel, refresh])

  const handleFocus = useCallback((event) => {
    viewModel.handleFocus(event)
    refresh()
  }, [viewModel, refresh])

  const handleBlur = useCallback((event) => {
    viewModel.handleBlur(event)
    refresh()
  }, [viewModel, refresh])

  return {
    // Data
    value: viewModel.value,
    placeholder: viewModel.placeholder,
    type: viewModel.type,
    id: viewModel.id,
    name: viewModel.name,
    label: viewModel.label,
    isActive: viewModel.isActive,
    hasLabel: viewModel.hasLabel,
    required: viewModel.required,
    disabled: viewModel.disabled,
    readOnly: viewModel.readOnly,
    hasValue: viewModel.hasValue,
    isEmpty: viewModel.isEmpty,
    isEditable: viewModel.isEditable,
    shouldShowLabel: viewModel.shouldShowLabel,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // CSS Classes
    containerClasses: viewModel.containerClasses,
    labelClasses: viewModel.labelClasses,
    inputClasses: viewModel.inputClasses,
    errorClasses: viewModel.errorClasses,

    // Event Handlers
    handleChange,
    handleFocus,
    handleBlur,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
    focus: viewModel.focus,
  }
}

export { InputViewModel }
