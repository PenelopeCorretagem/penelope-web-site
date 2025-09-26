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
    toggleActive: () => {
      const success = viewModel.toggleActive()
      if (success) refresh()
      return success
    },

    updateVariant: variant => {
      const success = viewModel.updateVariant(variant)
      if (success) refresh()
      return success
    },

    setDisabled: disabled => {
      viewModel.model.setDisabled(disabled)
      refresh()
    },
  }

  return {
    // Estado observável
    text: viewModel.model.text,
    variant: viewModel.variant,
    type: viewModel.model.type,
    isActive: viewModel.isActive,
    disabled: viewModel.model.disabled,
    hasErrors: viewModel.hasErrors,

    // Comandos
    ...commands,

    // ViewModel para a View
    viewModel,
  }
}
