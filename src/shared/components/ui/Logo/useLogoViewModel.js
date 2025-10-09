import { useState, useCallback, useMemo } from 'react'
import { LogoModel } from '@shared/components/ui/Logo/LogoModel'

/**
 * LogoViewModel - Gerencia a lógica de apresentação do logotipo
 * Controla esquema de cores, tamanho e tratamento de erros
 */
class LogoViewModel {
  /**
   * @param {LogoModel} model - Instância do modelo de logo
   */
  constructor(model = new LogoModel()) {
    this.model = model
    this.errors = []
  }

  /**
   * Getters - Propriedades computadas que refletem o estado do modelo
   */
  get colorScheme() {
    return this.model.colorScheme
  }

  get size() {
    return this.model.size
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  get isValid() {
    return this.model.isValid
  }

  /**
   * ✅ MVVM: ViewModel gerencia mapeamento CSS
   * Retorna classes CSS baseadas no esquema de cores
   */
  get colorClassName() {
    const colorMap = {
      pink: 'text-brand-pink',
      brown: 'text-brand-brown',
      white: 'text-brand-white',
      black: 'text-brand-black',
      custom: '',
    }
    return colorMap[this.colorScheme] || colorMap.pink
  }

  /**
   * Retorna classes de estado baseadas em erros e validação
   */
  get stateClassName() {
    if (this.hasErrors) return 'opacity-50 filter grayscale'
    if (!this.isValid) return 'opacity-80'
    return ''
  }

  /**
   * Verifica se deve usar cor customizada
   */
  get useCustomColor() {
    return this.colorScheme === 'custom'
  }

  /**
   * Retorna todas as classes CSS concatenadas
   */
  getLogoClasses(customColor, additionalClassName = '') {
    const baseClasses = 'fill-current transition-all duration-200'

    return [
      baseClasses,
      this.colorClassName,
      this.stateClassName,
      additionalClassName,
    ]
      .filter(Boolean)
      .join(' ')
  }

  /**
   * Retorna estilo inline para o logo
   */
  getLogoStyle(customColor) {
    return {
      ...(this.useCustomColor && { color: customColor || 'currentColor' }),
      height: this.size,
      width: 'auto',
    }
  }

  /**
   * Atualiza o esquema de cores do logotipo
   * @param {string} newColorScheme - Novo esquema de cores
   * @returns {Object} Resultado da operação
   */
  updateColorScheme = newColorScheme => {
    try {
      this.model.updateColorScheme(newColorScheme)
      this.clearErrors()
      return { success: true, changed: true }
    } catch (error) {
      this.addError(error.message)
      return { success: false, changed: false, error: error.message }
    }
  }

  /**
   * Atualiza o tamanho do logotipo
   * @param {Object} newSize - Novas dimensões
   * @returns {Object} Resultado da operação
   */
  updateSize = newSize => {
    try {
      this.model.updateSize(newSize)
      this.clearErrors()
      return { success: true, changed: true }
    } catch (error) {
      this.addError(error.message)
      return { success: false, changed: false, error: error.message }
    }
  }

  /**
   * Define um preset de tamanho predefinido
   * @param {string} preset - Nome do preset de tamanho
   * @returns {Object} Resultado da operação
   */
  setSizePreset = preset => {
    try {
      this.model.setSizePreset(preset)
      this.clearErrors()
      return { success: true, changed: true }
    } catch (error) {
      this.addError(error.message)
      return { success: false, changed: false, error: error.message }
    }
  }

  /**
   * Retorna um snapshot do estado atual para uso em hooks
   * @returns {Object} Estado atual do logotipo
   */
  getSnapshot() {
    return {
      colorScheme: this.model.colorScheme,
      size: this.model.size,
      hasErrors: this.hasErrors,
      errorMessages: this.errorMessages,
    }
  }

  /**
   * Gerenciamento de Erros
   */

  /**
   * Adiciona uma nova mensagem de erro se não existir
   * @param {string} message - Mensagem de erro
   */
  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  /**
   * Limpa todas as mensagens de erro
   */
  clearErrors() {
    this.errors = []
  }
}

/**
 * Hook para gerenciar estado e interações do LogoViewModel
 * Implementa Factory Pattern - cria o modelo internamente
 * @param {number} size - Tamanho do logo
 * @param {string} colorScheme - Esquema de cores do logo
 * @returns {Object} Estado e comandos do logo
 */
export function useLogoViewModel(size = 40, colorScheme = 'pink') {
  // ✅ Factory Pattern - Hook cria o modelo
  const [viewModel] = useState(() => {
    const model = new LogoModel(size, colorScheme)
    return new LogoViewModel(model)
  })

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

  // ✅ Retorna apenas dados e métodos CSS do ViewModel
  return {
    colorScheme: viewModel.colorScheme,
    size: viewModel.size,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,
    // ✅ Métodos CSS vindos do ViewModel
    colorClassName: viewModel.colorClassName,
    stateClassName: viewModel.stateClassName,
    useCustomColor: viewModel.useCustomColor,
    getLogoClasses: (customColor, additionalClassName) =>
      viewModel.getLogoClasses(customColor, additionalClassName),
    getLogoStyle: (customColor) =>
      viewModel.getLogoStyle(customColor),
    ...commands,
  }
}

export { LogoViewModel }
