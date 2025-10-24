import { useState, useCallback } from 'react'
import { HeadingModel } from '@shared/components/ui/Heading/HeadingModel'
import { getHeadingThemeClasses } from '@shared/styles/theme'

/**
 * HeadingViewModel - Gerencia a lógica e apresentação do Heading
 * Centraliza a lógica de CSS e comportamento de títulos
 */
class HeadingViewModel {
  constructor(model = new HeadingModel()) {
    this.model = model
    this.errors = []
  }

  // Getters de dados
  get level() {
    return this.model.level
  }

  get color() {
    return this.model.color
  }

  get children() {
    return this.model.children
  }

  get className() {
    return this.model.className
  }

  get componentTag() {
    return this.model.componentTag
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
    return getHeadingThemeClasses({
      level: this.model.level,
      color: this.model.color,
      className: this.model.className,
    })
  }

  // Funções para mesclar classes removendo conflitos de font-weight
  mergeClasses(baseClasses, customClasses) {
    if (!customClasses || customClasses.trim() === '') {
      return baseClasses
    }

    const base = baseClasses.split(' ')
    const custom = customClasses.split(' ')

    // Remove classes de font-weight conflitantes se houver uma personalizada
    const fontWeightClasses = [
      'font-thin', 'font-extralight', 'font-light', 'font-normal',
      'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'
    ]

    const hasCustomFontWeight = custom.some(cls => fontWeightClasses.includes(cls))

    let finalClasses = base
    if (hasCustomFontWeight) {
      finalClasses = base.filter(cls => !fontWeightClasses.includes(cls))
    }

    return [...finalClasses, ...custom].join(' ')
  }

  // Métodos de ação
  updateLevel = newLevel => {
    try {
      const updated = this.model.updateLevel(newLevel)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar nível: ${error.message}`)
      return false
    }
  }

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
        level: this.levelClasses,
        color: this.colorClasses,
        final: this.finalClassName,
      }
    }
  }

  isLevel(targetLevel) {
    return this.model.isLevel(targetLevel)
  }

  isColor(targetColor) {
    return this.model.isColor(targetColor)
  }
}

/**
 * Hook para gerenciar estado e CSS do Heading
 */
export function useHeadingViewModel(initialModel) {
  const [viewModel] = useState(() => new HeadingViewModel(initialModel))
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateLevel: level => {
      const success = viewModel.updateLevel(level)
      if (success) refresh()
      return success
    },

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
    level: viewModel.level,
    color: viewModel.color,
    children: viewModel.children,
    className: viewModel.className,
    componentTag: viewModel.componentTag,
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
    isLevel: viewModel.isLevel,
    isColor: viewModel.isColor,
  }
}

/**
 * Hook factory que aceita props semânticas em vez de model
 */
export function useHeadingFactory({
  level = 1,
  color = 'black',
  state = 'default',
  children = '',
  className = '',
} = {}) {
  const [viewModel] = useState(() => {
    const model = new HeadingModel({
      level,
      color,
      children,
      className,
    })
    return new HeadingViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  // Lógica de CSS usando theme.js com estado
  const finalClassName = getHeadingThemeClasses({
    level: viewModel.level,
    color: viewModel.color,
    state,
    className: viewModel.className,
  })

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateLevel: newLevel => {
      const success = viewModel.updateLevel(newLevel)
      if (success) refresh()
      return success
    },

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
    level: viewModel.level,
    color: viewModel.color,
    children: viewModel.children,
    className: viewModel.className,
    componentTag: viewModel.componentTag,
    hasContent: viewModel.hasContent,
    isEmpty: viewModel.isEmpty,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // CSS Classes (gerenciadas pelo ViewModel usando theme.js)
    finalClassName,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
    isLevel: viewModel.isLevel,
    isColor: viewModel.isColor,
  }
}

export { HeadingViewModel }
