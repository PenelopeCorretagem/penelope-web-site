import { useState, useCallback } from 'react'
import { TextModel } from '@shared/components/ui/Text/TextModel'
import { getTextThemeClasses } from '@shared/styles/theme'

/**
 * TextViewModel - Gerencia a lógica e apresentação do Text
 * Centraliza a lógica de CSS e comportamento de textos
 */
class TextViewModel {
  constructor(model = new TextModel()) {
    this.model = model
    this.errors = []
  }

  // Getters de dados
  get children() {
    return this.model.children
  }

  get className() {
    return this.model.className
  }

  get hasContent() {
    return this.model.hasContent
  }

  get isEmpty() {
    return this.model.isEmpty
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

  // Lógica de CSS usando theme.js
  get finalClassName() {
    return getTextThemeClasses({
      className: this.model.className,
    })
  }

  // Métodos de ação
  updateChildren = newChildren => {
    try {
      const updated = this.model.updateChildren(newChildren)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar conteúdo: ${error.message}`)
      return false
    }
  }

  updateClassName = newClassName => {
    try {
      const updated = this.model.updateClassName(newClassName)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar className: ${error.message}`)
      return false
    }
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
        base: this.baseClasses,
        final: this.finalClassName,
      }
    }
  }
}

/**
 * Hook para gerenciar estado e CSS do Text
 * Factory Pattern - cria o modelo internamente
 */
export function useTextViewModel({
  children = '',
  className = '',
} = {}) {
  const [viewModel] = useState(() => {
    const model = new TextModel({
      children,
      className,
    })
    return new TextViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateChildren: newChildren => {
      const success = viewModel.updateChildren(newChildren)
      if (success) refresh()
      return success
    },

    updateClassName: newClassName => {
      const success = viewModel.updateClassName(newClassName)
      if (success) refresh()
      return success
    },

    clearErrors: () => {
      viewModel.clearErrors()
      refresh()
    },
  }

  return {
    // Data
    children: viewModel.children,
    className: viewModel.className,
    hasContent: viewModel.hasContent,
    isEmpty: viewModel.isEmpty,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // CSS Classes (gerenciadas pelo ViewModel usando theme.js)
    finalClassName: viewModel.finalClassName,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
  }
}

export { TextViewModel }
