/**
 * EventType.js
 * DTO que representa um tipo de agendamento do cal-service
 * Usado para criar e gerenciar tipos de eventos que podem ser agendados.
 */

export class EventType {
  #id
  #title
  #slug
  #description
  #lengthInMinutes
  #minimumBookingNotice
  #hidden
  #estateId

  constructor({
    id = null,
    title = '',
    slug = '',
    description = '',
    lengthInMinutes = 60,
    minimumBookingNotice = 120,
    hidden = false,
    estateId = null,
  }) {
    this.#id = id
    this.#title = title
    this.#slug = slug
    this.#description = description
    this.#lengthInMinutes = lengthInMinutes
    this.#minimumBookingNotice = minimumBookingNotice
    this.#hidden = hidden
    this.#estateId = estateId
  }

  get id() { return this.#id }
  get title() { return this.#title }
  get slug() { return this.#slug }
  get description() { return this.#description }
  get lengthInMinutes() { return this.#lengthInMinutes }
  get minimumBookingNotice() { return this.#minimumBookingNotice }
  get hidden() { return this.#hidden }
  get estateId() { return this.#estateId }

  set title(v) { this.#title = v }
  set description(v) { this.#description = v }
  set lengthInMinutes(v) { this.#lengthInMinutes = v }
  set minimumBookingNotice(v) { this.#minimumBookingNotice = v }
  set hidden(v) { this.#hidden = v }

  /**
   * Converte para payload para criação/atualização na API
   */
  toRequestPayload() {
    return {
      title: this.#title,
      description: this.#description,
      lengthInMinutes: this.#lengthInMinutes,
      minimumBookingNotice: this.#minimumBookingNotice,
      hidden: this.#hidden,
      estateId: this.#estateId,
    }
  }

  /**
   * Cria uma instância a partir dos dados da API
   */
  static fromApi(data) {
    if (!data) return null
    return new EventType({
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description,
      lengthInMinutes: data.lengthInMinutes,
      minimumBookingNotice: data.minimumBookingNotice,
      hidden: data.hidden,
      estateId: data.estateId,
    })
  }

  /**
   * Lista de tipos de evento para display
   */
  summary() {
    return {
      id: this.#id,
      title: this.#title,
      duration: `${this.#lengthInMinutes}min`,
      visible: !this.#hidden,
    }
  }
}
