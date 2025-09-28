import { useState, useCallback, useMemo } from 'react'
import { LogoViewModel } from '../../viewmodel/components/LogoViewModel'

/**
 * Hook para gerenciar estado e interações do LogoViewModel
 * @param {LogoModel} model - Modelo do logo
 * @returns {Object} Estado e comandos do logo
 */
export function useLogoViewModel(model) {
  const [viewModel] = useState(() => new LogoViewModel(model))
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = useMemo(
    () => ({
      updateColorScheme: colorScheme => {
        const result = viewModel.updateColorScheme(colorScheme)
        if (result.changed) refresh()
        return result
      },

      updateSize: size => {
        const result = viewModel.updateSize(size)
        if (result.changed) refresh()
        return result
      },

      setSizePreset: preset => {
        const result = viewModel.setSizePreset(preset)
        if (result.changed) refresh()
        return result
      },
    }),
    [viewModel, refresh]
  )

  // ✅ Retorna apenas dados, não o ViewModel
  return {
    colorScheme: viewModel.colorScheme,
    size: viewModel.size,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,
    ...commands,
  }
}
