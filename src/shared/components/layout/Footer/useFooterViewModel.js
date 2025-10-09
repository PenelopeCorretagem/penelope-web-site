import { useState, useCallback, useMemo, useEffect } from 'react'
import { FooterModel } from '@shared/components/layout/Footer/FooterModel'

/**
 * FooterViewModel - Gerencia a lógica de apresentação do footer
 * Integra com FooterModel e expõe dados formatados para a view
 */
class FooterViewModel {
  /**
   * @param {Object} model - FooterModel para gerenciar estado do footer
   */
  constructor(model) {
    this.model = model
    this.errors = []
  }

  /**
   * Getters - Propriedades computadas que refletem o estado do modelo
   */
  get isAuthenticated() {
    return this.model.authenticated
  }

  get copyrightInfo() {
    return this.model.getCopyrightInfo()
  }

  get logoConfig() {
    return this.model.getLogoConfig()
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  /**
   * Atualiza estado de autenticação
   * @param {boolean} isAuthenticated - Estado de autenticação
   * @returns {Object} Resultado da atualização
   */
  setAuthentication = (isAuthenticated) => {
    const result = this.model.setAuthenticationStatus(isAuthenticated)
    this.clearErrors()
    return result
  }

  /**
   * Atualiza configurações do logo
   * @param {number} size - Tamanho do logo
   * @param {string} colorScheme - Esquema de cores
   * @returns {Object} Resultado da atualização
   */
  setLogoConfig = (size, colorScheme) => {
    const result = this.model.setLogoConfig(size, colorScheme)
    this.clearErrors()
    return result
  }

  /**
   * Obtém classes CSS para o container do footer
   * @returns {string} Classes CSS
   */
  getFooterContainerClasses() {
    return [
      'flex flex-col items-center justify-center',
      'p-section md:p-section-md',
      'w-full h-auto',
      'gap-subsection md:gap-subsection-md'
    ].join(' ')
  }

  /**
   * Obtém classes CSS para a linha de copyright
   * @returns {string} Classes CSS
   */
  getCopyrightClasses() {
    return [
      'w-full text-center',
      'border-t-2 border-brand-white-tertiary',
      'pt-section-y'
    ].join(' ')
  }

  /**
   * Adiciona erro
   * @param {string} error - Mensagem de erro
   */
  addError(error) {
    this.errors.push(error)
  }

  /**
   * Limpa erros
   */
  clearErrors() {
    this.errors = []
  }

  /**
   * Obtém snapshot do estado atual
   * @returns {Object} Estado atual
   */
  getSnapshot() {
    return {
      isAuthenticated: this.isAuthenticated,
      copyrightInfo: this.copyrightInfo,
      logoConfig: this.logoConfig,
      hasErrors: this.hasErrors,
      errorMessages: this.errorMessages,
      footerContainerClasses: this.getFooterContainerClasses(),
      copyrightClasses: this.getCopyrightClasses()
    }
  }
}

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

export { FooterViewModel }
