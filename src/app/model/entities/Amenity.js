/**
 * Amenity - Entidade de domínio para Comodidades
 *
 * Representa uma comodidade/amenidade que pode estar associada a um imóvel
 */
export class Amenity {
  #id
  #description
  #icon

  constructor({ id = null, description = '', icon = 'Zap' } = {}) {
    this.#id = id
    this.#description = description
    this.#icon = icon
  }

  get id() {
    return this.#id
  }

  set id(value) {
    this.#id = value
  }

  get description() {
    return this.#description
  }

  set description(value) {
    this.#description = value ?? ''
  }

  get icon() {
    return this.#icon
  }

  set icon(value) {
    this.#icon = value ?? 'Zap'
  }

  /**
   * Converte entidade para payload de request
   * @returns {Object} Payload para API
   */
  toRequestPayload() {
    return {
      description: this.#description,
      icon: this.#icon,
    }
  }

  /**
   * Retorna resumo da amenity
   * @returns {string}
   */
  summary() {
    return `${this.#description} [${this.#icon}]`
  }
}
