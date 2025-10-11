import { useState, useCallback } from 'react'
import { TextModel } from '@shared/components/ui/Text/TextModel'

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
  get color() {
    return this.model.color
  }

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

  // Lógica de CSS - centralizada no ViewModel
  get colorClasses() {
    const textColors = {
      black: 'text-brand-black',
      white: 'text-brand-white',
    }

    return textColors[this.color] || textColors.black
  }

  get baseClasses() {
    return [
      'font-default-family',
      this.colorClasses,
      'text-[12px]',
      'leading-none',
      'md:text-[16px]',
    ].join(' ')
  }

  get finalClassName() {
    if (!this.className || this.className.trim() === '') {
      return this.baseClasses
    }

    return `${this.baseClasses} ${this.className}`
  }

  // Validação com throw de erro (como no componente original)
  ensureTextColor(textColor) {
    try {
      const textColorValue = String(textColor).trim()

      const textColors = {
        black: 'text-brand-black',
        white: 'text-brand-white',
      }

      if (!Object.keys(textColors).includes(textColorValue)) {
        throw new Error(`Cor inválida: ${textColor}`)
      }

      return textColors[textColorValue]
    } catch (error) {
      this.addError(error.message)
      // Retorna cor padrão em caso de erro
      return 'text-brand-black'
    }
  }

  // Métodos de ação
  updateColor = newColor => {
    try {
      const updated = this.model.updateColor(newColor)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar cor: ${error.message}`)
      return false
    }
  }

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
        color: this.colorClasses,
        final: this.finalClassName,
      }
    }
  }

  isColor(targetColor) {
    return this.model.isColor(targetColor)
  }
}

/**
 * Hook base para TextViewModel
 */
export function useTextViewModel(initialModel) {
  const [viewModel] = useState(() => new TextViewModel(initialModel))
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateColor: color => {
      const success = viewModel.updateColor(color)
      if (success) refresh()
      return success
    },

    updateChildren: children => {
      const success = viewModel.updateChildren(children)
      if (success) refresh()
      return success
    },

    updateClassName: className => {
      const success = viewModel.updateClassName(className)
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
    color: viewModel.color,
    children: viewModel.children,
    className: viewModel.className,
    hasContent: viewModel.hasContent,
    isEmpty: viewModel.isEmpty,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // CSS Classes
    baseClasses: viewModel.baseClasses,
    colorClasses: viewModel.colorClasses,
    finalClassName: viewModel.finalClassName,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
    isColor: viewModel.isColor,
    ensureTextColor: viewModel.ensureTextColor,
  }
}

/**
 * Hook factory que aceita props semânticas em vez de model
 */
export function useTextFactory({
  color = 'black',
  children = '',
  className = '',
} = {}) {
  const [viewModel] = useState(() => {
    const model = new TextModel({
      color,
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
    updateColor: newColor => {
      const success = viewModel.updateColor(newColor)
      if (success) refresh()
      return success
    },

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
    color: viewModel.color,
    children: viewModel.children,
    className: viewModel.className,
    hasContent: viewModel.hasContent,
    isEmpty: viewModel.isEmpty,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // CSS Classes
    baseClasses: viewModel.baseClasses,
    colorClasses: viewModel.colorClasses,
    finalClassName: viewModel.finalClassName,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
    isColor: viewModel.isColor,
    ensureTextColor: viewModel.ensureTextColor,
  }
}

export { TextViewModel }
