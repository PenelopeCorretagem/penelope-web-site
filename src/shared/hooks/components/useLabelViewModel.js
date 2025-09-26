import { useState, useCallback } from 'react'
import { LabelViewModel } from '../../viewmodel/components/LabelViewModel'

/**
 * Hook para gerenciar estado e interações do LabelViewModel
 * @param {LabelModel} initialModel - Modelo inicial do label
 * @param {Object} config - Configurações adicionais
 * @returns {Object} Estado e comandos do label
 */
export function useLabelViewModel(initialModel, config = {}) {
  const [viewModel] = useState(() => new LabelViewModel(initialModel, config))
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
  }

  return {
    displayText: viewModel.displayText,
    variant: viewModel.variant,
    size: viewModel.size,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    ...commands,
    viewModel,
  }
}
