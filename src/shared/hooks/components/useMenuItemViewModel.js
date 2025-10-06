import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { MenuItemViewModel } from '@shared/viewmodel/components/MenuItemViewModel'

export function useMenuItemViewModel(initialModel, config = {}) {
  const location = useLocation()
  const [viewModel] = useState(
    () => new MenuItemViewModel(initialModel, config)
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
