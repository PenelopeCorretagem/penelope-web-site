import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { NavItemModel } from '@shared/components/ui/NavItem/NavItemModel'

/**
 * NavItemViewModel - Gerencia a lógica e apresentação de itens do menu
 * Estende BaseElementViewModel para funcionalidades base de elementos UI
 */
class NavItemViewModel {
  constructor(model = new NavItemModel(), { onClick } = {}) {
    this.model = model
    this.onClick = onClick
    this.errors = []
  }

  // Getters de dados
  get text() {
    return this.model.text
  }

  get variant() {
    return this.model.variant
  }

  get active() {
    return this.model.active
  }

  get href() {
    return this.model.href
  }

  get icon() {
    return this.model.icon
  }

  get iconOnly() {
    return this.model.iconOnly
  }

  get to() {
    return this.model.to
  }

  get external() {
    return this.model.external
  }

  get disabled() {
    return this.model.disabled
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

  get canClick() {
    return !this.disabled && !this.hasErrors
  }

  get componentType() {
    if (this.model.isInternalLink()) return 'router-link'
    if (this.model.href) return 'a'
    return 'button'
  }

  // Métodos de lógica
  handleClick = event => {
    if (!this.canClick) return

    if (this.onClick) {
      this.onClick(event, this.model)
    }
  }

  toggle = () => {
    if (!this.canClick) return false

    this.model.toggle()
    return true
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

  setDisabled = disabled => {
    this.model.setDisabled(disabled)
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

export function useNavItemViewModel(initialModel, config = {}) {
  const location = useLocation()
  const [viewModel] = useState(
    () => new NavItemViewModel(initialModel, config)
  )
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    forceUpdate(prev => prev + 1)
  }, [location.pathname])

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // Verifica se o item está ativo baseado na rota atual
  const isActive = viewModel.to
    ? viewModel.to === '/'
      ? location.pathname === '/'
      : location.pathname === viewModel.to ||
        location.pathname.startsWith(`${viewModel.to}/`)
    : false

  const commands = {
    toggle: () => {
      const success = viewModel.toggle()
      if (success) refresh()
      return success
    },

    updateVariant: variant => {
      const success = viewModel.updateVariant(variant)
      if (success) refresh()
      return success
    },

    updateText: text => {
      const success = viewModel.updateText(text)
      if (success) refresh()
      return success
    },

    setDisabled: disabled => {
      viewModel.setDisabled(disabled)
      refresh()
    },

    handleClick: viewModel.handleClick,
  }

  return {
    text: viewModel.text,
    variant: viewModel.variant,
    active: isActive,
    href: viewModel.href,
    to: viewModel.to,
    external: viewModel.external,
    disabled: viewModel.disabled,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,
    canClick: viewModel.canClick,
    componentType: viewModel.componentType,
    icon: viewModel.icon,
    iconOnly: viewModel.iconOnly,
    ...commands,
  }
}

// Hook factory que aceita props semânticas em vez de model
export function useNavItemFactory({
  text = '',
  variant = 'default',
  active = false,
  href = null,
  to = null,
  external = false,
  disabled = false,
  icon = null,
  iconOnly = false,
  onClick = null
} = {}) {
  const [viewModel] = useState(() => {
    const model = new NavItemModel({
      text,
      variant,
      active,
      href,
      to,
      external,
      disabled,
      icon,
      iconOnly
    })
    return new NavItemViewModel(model, { onClick })
  })

  const location = useLocation()
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    forceUpdate(prev => prev + 1)
  }, [location.pathname])

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // Verifica se o item está ativo baseado na rota atual
  const isActive = viewModel.to
    ? viewModel.to === '/'
      ? location.pathname === '/'
      : location.pathname === viewModel.to ||
        location.pathname.startsWith(`${viewModel.to}/`)
    : active

  const commands = {
    toggle: () => {
      const success = viewModel.toggle()
      if (success) refresh()
      return success
    },

    updateVariant: variant => {
      const success = viewModel.updateVariant(variant)
      if (success) refresh()
      return success
    },

    updateText: text => {
      const success = viewModel.updateText(text)
      if (success) refresh()
      return success
    },

    setDisabled: disabled => {
      viewModel.setDisabled(disabled)
      refresh()
    },

    handleClick: viewModel.handleClick,
  }

  return {
    text: viewModel.text,
    variant: viewModel.variant,
    active: isActive,
    href: viewModel.href,
    to: viewModel.to,
    external: viewModel.external,
    disabled: viewModel.disabled,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,
    canClick: viewModel.canClick,
    componentType: viewModel.componentType,
    icon: viewModel.icon,
    iconOnly: viewModel.iconOnly,
    ...commands,
  }
}

export { NavItemViewModel }
