import { useState, useCallback, useMemo, useEffect } from 'react'
import { FooterViewModel } from '../../viewmodel/components/FooterViewModel'
import { FooterModel } from '../../model/components/FooterModel'

export function useFooterViewModel(isAuthenticated = false, logoSize = 40, logoColorScheme = 'pink') {
  const [viewModel] = useState(() => {
    const model = new FooterModel(isAuthenticated, logoSize, logoColorScheme)
    return new FooterViewModel(model)
  })

  const [snapshot, setSnapshot] = useState(() => viewModel.getSnapshot())

  const updateSnapshot = useCallback(() => {
    const newSnapshot = viewModel.getSnapshot()
    setSnapshot(newSnapshot)
  }, [viewModel])

  // Sincroniza estado de autenticação quando muda
  useEffect(() => {
    const result = viewModel.setAuthentication(isAuthenticated)

    if (result && result.changed) {
      updateSnapshot()
    }
  }, [isAuthenticated, viewModel, updateSnapshot])

  // Sincroniza configurações do logo quando mudam
  useEffect(() => {
    const result = viewModel.setLogoConfig(logoSize, logoColorScheme)

    if (result && result.changed) {
      updateSnapshot()
    }
  }, [logoSize, logoColorScheme, viewModel, updateSnapshot])

  const commands = useMemo(
    () => ({
      setAuthentication: (isAuth) => {
        const result = viewModel.setAuthentication(isAuth)
        if (result && result.changed) {
          updateSnapshot()
        }
        return result
      },

      setLogoConfig: (size, colorScheme) => {
        const result = viewModel.setLogoConfig(size, colorScheme)
        if (result && result.changed) {
          updateSnapshot()
        }
        return result
      },

      clearErrors: () => {
        viewModel.clearErrors()
        updateSnapshot()
      }
    }),
    [viewModel, updateSnapshot]
  )

  return {
    // Estado observável
    isAuthenticated: snapshot.isAuthenticated,
    copyrightInfo: snapshot.copyrightInfo,
    logoConfig: snapshot.logoConfig,
    hasErrors: snapshot.hasErrors,
    errorMessages: snapshot.errorMessages,
    footerContainerClasses: snapshot.footerContainerClasses,
    copyrightClasses: snapshot.copyrightClasses,

    // Comandos
    ...commands
  }
}
