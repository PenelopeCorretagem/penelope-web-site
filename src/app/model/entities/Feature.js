/**
 * Representa uma diferença/amenidade de um imóvel.
 *
 * Esta entidade contém apenas informações básicas:
 * - id: identificador único
 * - description: texto descritivo da diferença
 *
 * Os campos internos são privados e acessados apenas via getters.
 */
export class Feature {
  /** @type {number} */
  #id

  /** @type {string} */
  #description

  /**
   * @param {Object} params
   * @param {number} params.id - Identificador único da diferença
   * @param {string} params.description - Descrição da diferença
   */
  constructor({ id, description }) {
    this.#id = id
    this.#description = description
  }

  /** Retorna o ID da diferença */
  get id() {
    return this.#id
  }

  /** Retorna a descrição da diferença */
  get description() {
    return this.#description
  }
}
