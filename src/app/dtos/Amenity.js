export class Amenity {
  #id
  #description
  #icon

  constructor({ id = null, description = '', icon = '' } = {}) {
    this.#id = id
    this.#description = description
    this.#icon = icon
  }

  get id() { return this.#id }
  get description() { return this.#description }
  get icon() { return this.#icon }

  set id(value) { this.#id = value }
  set description(value) { this.#description = value ?? '' }
  set icon(value) { this.#icon = value ?? '' }

  toRequestPayload() {
    return {
      description: this.#description,
      icon: this.#icon,
    }
  }
}
