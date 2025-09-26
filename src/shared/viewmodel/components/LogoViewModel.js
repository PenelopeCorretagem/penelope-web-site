import { LogoModel } from '../../model/components/LogoModel'

/**
 * LogoViewModel - Gerencia a lógica de apresentação do logotipo
 * Controla esquema de cores, tamanho e tratamento de erros
 */
export class LogoViewModel {
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
