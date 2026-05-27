export class EventType {
  #id
  #title
  #slug
  #description
  #lengthInMinutes
  #minimumBookingNotice
  #hidden
  #estateId
  #createdAt

  constructor({
    id = null,
    title = '',
    slug = '',
    description = '',
    lengthInMinutes = 60,
    minimumBookingNotice = 120,
    hidden = false,
    estateId = null,
    createdAt = null,
  }) {
    this.#id = id
    this.#title = title
    this.#slug = slug
    this.#description = description
    this.#lengthInMinutes = lengthInMinutes
    this.#minimumBookingNotice = minimumBookingNotice
    this.#hidden = hidden
    this.#estateId = estateId
    this.#createdAt = createdAt
  }

  get id() { return this.#id }
  get title() { return this.#title }
  get slug() { return this.#slug }
  get description() { return this.#description }
  get lengthInMinutes() { return this.#lengthInMinutes }
  get minimumBookingNotice() { return this.#minimumBookingNotice }
  get hidden() { return this.#hidden }
  get estateId() { return this.#estateId }
  get createdAt() { return this.#createdAt }

  set title(v) { this.#title = v }
  set description(v) { this.#description = v }
  set lengthInMinutes(v) { this.#lengthInMinutes = v }
  set minimumBookingNotice(v) { this.#minimumBookingNotice = v }
  set hidden(v) { this.#hidden = v }

  isVisible() {
    return !this.#hidden
  }

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
}
