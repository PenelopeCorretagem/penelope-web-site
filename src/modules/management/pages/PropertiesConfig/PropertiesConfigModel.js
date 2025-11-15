/**
 * Modelo de dados para configuração de propriedades
 */
export class PropertiesConfigModel {
  constructor() {
    this.lancamentos = []
    this.disponiveis = []
    this.emObras = []
  }

  /**
   * Define os lançamentos
   */
  setLancamentos(properties) {
    this.lancamentos = properties
  }

  /**
   * Define os disponíveis
   */
  setDisponiveis(properties) {
    this.disponiveis = properties
  }

  /**
   * Define os em obras
   */
  setEmObras(properties) {
    this.emObras = properties
  }

  /**
   * Retorna todas as propriedades
   */
  getAllProperties() {
    return {
      lancamentos: this.lancamentos,
      disponiveis: this.disponiveis,
      emObras: this.emObras
    }
  }

  /**
   * Retorna o total de propriedades
   */
  getTotalCount() {
    return this.lancamentos.length + this.disponiveis.length + this.emObras.length
  }
}
