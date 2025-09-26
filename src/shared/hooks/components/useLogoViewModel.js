import { useState, useCallback, useMemo } from 'react'
import { LogoViewModel } from '../../viewmodel/components/LogoViewModel'

/**
 * Hook para gerenciar estado e interações do LogoViewModel
 * @param {LogoModel} model - Modelo do logo
 * @returns {Object} Estado e comandos do logo
 */
export function useLogoViewModel(model) {
  const viewModel = useMemo(() => new LogoViewModel(model), [model])
  const [snapshot, setSnapshot] = useState(() => viewModel.getSnapshot())

  const updateSnapshot = useCallback(() => {
    setSnapshot(viewModel.getSnapshot())
  }, [viewModel])

  const commands = useMemo(
    () => ({
      updateColorScheme: colorScheme => {
        const result = viewModel.updateColorScheme(colorScheme)
        if (result.changed) {
          updateSnapshot()
        }
        return result
      },

      updateSize: size => {
        const result = viewModel.updateSize(size)
        if (result.changed) {
          updateSnapshot()
        }
        return result
      },

      setSizePreset: preset => {
        const result = viewModel.setSizePreset(preset)
        if (result.changed) {
          updateSnapshot()
        }
        return result
      },

      refresh: updateSnapshot,
    }),
    [viewModel, updateSnapshot]
  )

  return {
    colorScheme: snapshot.colorScheme,
    size: snapshot.size,
    hasErrors: snapshot.hasErrors,
    errorMessages: snapshot.errorMessages,
    ...commands,
    viewModel,
  }
}
