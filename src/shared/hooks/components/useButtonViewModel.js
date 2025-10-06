import { useState, useCallback } from 'react'
import { ButtonViewModel } from '../../viewmodel/components/ButtonViewModel'

/**
 * Hook para gerenciar estado e interações do ButtonViewModel
 * @param {ButtonModel} initialModel - Modelo inicial do botão
 * @param {Object} config - Configurações adicionais
 * @returns {Object} Estado e comandos do botão
 */
export function useButtonViewModel(initialModel, config = {}) {
  const [viewModel] = useState(() => new ButtonViewModel(initialModel, config))
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

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

    setType: type => {
      const success = viewModel.setType(type)
      if (success) refresh()
      return success
    },

    handleClick: viewModel.handleClick,
  }

  return {
    text: viewModel.text,
    variant: viewModel.variant,
    type: viewModel.type,
    active: viewModel.active,
    disabled: viewModel.disabled,
    transition: viewModel.transition,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,
    canClick: viewModel.canClick,
    ...commands,
  }
}
