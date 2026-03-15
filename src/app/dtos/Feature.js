/**
 * Representa uma diferença/amenidade de um imóvel.
 *
 * Esta entidade contém informações básicas:
 * - id: identificador único
 * - description: texto descritivo da diferença
 * - icon: nome do ícone associado
 *
 * Os campos internos são privados e acessados apenas via getters.
 */
export class Feature {
  /** @type {number} */
  #id

  /** @type {string} */
  #description

  /** @type {string} */
  #icon

  /**
   * @param {Object} params
   * @param {number} params.id - Identificador único da diferença
   * @param {string} params.description - Descrição da diferença
   * @param {string} params.icon - Nome do ícone
   */
  constructor({ id, description, icon }) {
    this.#id = id ?? null
    this.#description = description ?? ''
    this.#icon = icon ?? ''
  }

  /** Retorna o ID da diferença */
  get id() {
    return this.#id
  }

  /** Retorna a descrição da diferença */
  get description() {
    return this.#description
  }

  /** Retorna o nome do ícone */
  get icon() {
    return this.#icon
  }

  /**
   * Converte para payload aceito pela API.
   */
  toRequestPayload() {
    return {
      description: this.#description,
      icon: this.#icon,
    }
  }

  /**
   * Converte dados recebidos da API para instância da entidade.
   */
  static fromApi(apiData) {
    return new Feature({
      id: apiData.id,
      description: apiData.description,
      icon: apiData.icon,
    })
  }
}
