import { useState, useCallback } from 'react'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { getLabelThemeClasses } from '@shared/styles/theme'

/**
 * LabelViewModel - Gerencia a lógica e apresentação de labels
 */
class LabelViewModel {
  constructor(model = new LabelModel()) {
    this.model = model
    this.errors = []
  }

  get displayText() {
    return this.model.text || 'Label'
  }

  get variant() {
    return this.model.variant
  }

  get size() {
    return this.model.size
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  get isValid() {
    return this.model.isValid()
  }

  get isEmpty() {
    return !this.model.hasText()
  }

  // Lógica de CSS usando theme.js
  get finalClassName() {
    return getLabelThemeClasses({
      variant: this.variant,
      size: this.size,
      isEmpty: this.isEmpty,
      invalid: this.hasErrors,
    })
  }

  updateText = newText => {
    try {
      this.model.updateText(newText)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  updateVariant = newVariant => {
    try {
      this.model.updateVariant(newVariant)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  updateSize = newSize => {
    try {
      this.model.updateSize(newSize)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }
}

/**
 * Hook para gerenciar estado e interações do LabelViewModel
 */
export function useLabelViewModel(initialModel) {
  const [viewModel] = useState(() => new LabelViewModel(initialModel))
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateText: text => {
      const success = viewModel.updateText(text)
      if (success) refresh()
      return success
    },

    updateVariant: variant => {
      const success = viewModel.updateVariant(variant)
      if (success) refresh()
      return success
    },

    updateSize: size => {
      const success = viewModel.updateSize(size)
      if (success) refresh()
      return success
    },

    clearErrors: () => {
      viewModel.clearErrors()
      refresh()
    },
  }

  return {
    displayText: viewModel.displayText,
    variant: viewModel.variant,
    size: viewModel.size,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,
    isEmpty: viewModel.isEmpty,
    finalClassName: viewModel.finalClassName,
    ...commands,
  }
}

export { LabelViewModel }
