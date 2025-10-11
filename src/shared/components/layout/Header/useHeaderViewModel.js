import { useState, useCallback, useEffect } from 'react'
import { HeaderModel } from '@shared/components/layout/Header/HeaderModel'

/**
 * HeaderViewModel - Gerencia a lógica e apresentação do Header
 * Centraliza a lógica de CSS e comportamento
 */
class HeaderViewModel {
  constructor(model = new HeaderModel()) {
    this.model = model
    this.errors = []
  }

  // Getters de dados
  get logoSize() {
    return this.model.logoSize
  }

  get logoColorScheme() {
    return this.model.logoColorScheme
  }

  get isAuthenticated() {
    return this.model.isAuthenticated
  }

  get sticky() {
    return this.model.sticky
  }

  get showShadow() {
    return this.model.showShadow
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
  get headerClasses() {
    const baseClasses = [
      'flex items-center justify-between',
      'w-full px-section-x md:px-section-x-md py-5',
      'bg-white',
      'transition-all duration-200',
    ]

    // Shadow
    if (this.showShadow) {
      baseClasses.push('shadow-md')
    }

    // Sticky
    if (this.sticky) {
      baseClasses.push('sticky top-0 z-50')
    }

    return baseClasses.join(' ')
  }

  get logoClasses() {
    return [
      'transition-opacity hover:opacity-80',
      'cursor-pointer',
    ].join(' ')
  }

  get logoSizeClasses() {
    return this.model.logoSizeClass
  }

  // Métodos de ação
  updateLogoSize = newSize => {
    try {
      const updated = this.model.updateLogoSize(newSize)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar tamanho do logo: ${error.message}`)
      return false
    }
  }

  updateColorScheme = newScheme => {
    try {
      const updated = this.model.updateColorScheme(newScheme)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar esquema de cores: ${error.message}`)
      return false
    }
  }

  updateAuthentication = isAuth => {
    try {
      const updated = this.model.updateAuthentication(isAuth)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar autenticação: ${error.message}`)
      return false
    }
  }

  toggleSticky = () => {
    try {
      const newState = this.model.toggleSticky()
      this.clearErrors()
      return newState
    } catch (error) {
      this.addError(`Erro ao alterar modo sticky: ${error.message}`)
      return this.sticky
    }
  }

  toggleShadow = () => {
    try {
      const newState = this.model.toggleShadow()
      this.clearErrors()
      return newState
    } catch (error) {
      this.addError(`Erro ao alterar sombra: ${error.message}`)
      return this.showShadow
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
        header: this.headerClasses,
        logo: this.logoClasses,
        logoSize: this.logoSizeClasses,
      }
    }
  }
}

/**
 * Hook base para HeaderViewModel
 */
export function useHeaderViewModel(initialModel) {
  const [viewModel] = useState(() => new HeaderViewModel(initialModel))
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateLogoSize: size => {
      const success = viewModel.updateLogoSize(size)
      if (success) refresh()
      return success
    },

    updateColorScheme: scheme => {
      const success = viewModel.updateColorScheme(scheme)
      if (success) refresh()
      return success
    },

    updateAuthentication: isAuth => {
      const success = viewModel.updateAuthentication(isAuth)
      if (success) refresh()
      return success
    },

    toggleSticky: () => {
      const newState = viewModel.toggleSticky()
      refresh()
      return newState
    },

    toggleShadow: () => {
      const newState = viewModel.toggleShadow()
      refresh()
      return newState
    },

    clearErrors: () => {
      viewModel.clearErrors()
      refresh()
    },
  }

  return {
    // Data
    logoSize: viewModel.logoSize,
    logoColorScheme: viewModel.logoColorScheme,
    isAuthenticated: viewModel.isAuthenticated,
    sticky: viewModel.sticky,
    showShadow: viewModel.showShadow,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // CSS Classes
    headerClasses: viewModel.headerClasses,
    logoClasses: viewModel.logoClasses,
    logoSizeClasses: viewModel.logoSizeClasses,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
  }
}

/**
 * Hook factory que aceita props semânticas em vez de model
 */
export function useHeaderFactory({
  logoSize = 40,
  logoColorScheme = 'pink',
  isAuthenticated = false,
  sticky = true,
  showShadow = true,
} = {}) {
  const [viewModel] = useState(() => {
    const model = new HeaderModel({
      logoSize,
      logoColorScheme,
      isAuthenticated,
      sticky,
      showShadow,
    })
    return new HeaderViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  // Atualiza o modelo quando as props mudam
  useEffect(() => {
    let changed = false

    if (viewModel.model.updateAuthentication(isAuthenticated)) {
      changed = true
    }

    if (changed) {
      forceUpdate(prev => prev + 1)
    }
  }, [isAuthenticated, viewModel.model])

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateLogoSize: size => {
      const success = viewModel.updateLogoSize(size)
      if (success) refresh()
      return success
    },

    updateColorScheme: scheme => {
      const success = viewModel.updateColorScheme(scheme)
      if (success) refresh()
      return success
    },

    updateAuthentication: isAuth => {
      const success = viewModel.updateAuthentication(isAuth)
      if (success) refresh()
      return success
    },

    toggleSticky: () => {
      const newState = viewModel.toggleSticky()
      refresh()
      return newState
    },

    toggleShadow: () => {
      const newState = viewModel.toggleShadow()
      refresh()
      return newState
    },

    clearErrors: () => {
      viewModel.clearErrors()
      refresh()
    },
  }

  return {
    // Data
    logoSize: viewModel.logoSize,
    logoColorScheme: viewModel.logoColorScheme,
    isAuthenticated: viewModel.isAuthenticated,
    sticky: viewModel.sticky,
    showShadow: viewModel.showShadow,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // CSS Classes
    headerClasses: viewModel.headerClasses,
    logoClasses: viewModel.logoClasses,
    logoSizeClasses: viewModel.logoSizeClasses,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
  }
}

export { HeaderViewModel }
