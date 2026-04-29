/**
 * Representa um anúncio de imóvel, incluindo status,
 * datas, responsáveis e o imóvel relacionado.
 */
export class Advertisement {
  // ===== PRIVATE FIELDS =====
  #id
  #active
  #featured
  #createdAt
  #endDate
  #creator
  #responsible
  #estate
  #eventTypeId

  constructor({
    id,
    active,
    featured,
    createdAt,
    endDate,
    creator,
    responsible,
    estate,
    eventTypeId,
  }) {
    this.#id = id ?? null
    this.#active = active ?? true
    this.#featured = featured ?? false
    this.#createdAt = createdAt ?? new Date().toISOString()
    this.#endDate = endDate ?? null
    this.#creator = creator ?? null
    this.#responsible = responsible ?? null
    this.#estate = estate ?? null
    this.#eventTypeId = eventTypeId ?? null
  }

  // ===== GETTERS =====
  get id() { return this.#id }
  get active() { return this.#active }
  get featured() { return this.#featured }
  get createdAt() { return this.#createdAt }
  get endDate() { return this.#endDate }
  get creator() { return this.#creator }
  get responsible() { return this.#responsible }
  get estate() { return this.#estate }
  get eventTypeId() { return this.#eventTypeId }

  // ===== SETTERS =====
  set active(v) { this.#active = v }
  set featured(v) { this.#featured = v }
  set endDate(v) { this.#endDate = v }
  set creator(v) { this.#creator = v }
  set responsible(v) { this.#responsible = v }
  set estate(v) { this.#estate = v }
  set eventTypeId(v) { this.#eventTypeId = v }

  // (id e createdAt geralmente não têm setter, mas posso adicionar se quiser)

  // ===== MÉTODOS DE NEGÓCIO =====

  /**
   * Retorna cidade e bairro formatados.
   */
  getFormattedAddress() {
    if (!this.#estate?.address) {
      return { city: '', neighborhood: '' }
    }
    const { city, neighborhood } = this.#estate.address
    return { city, neighborhood }
  }

  /**
   * Retorna uma lista de características do imóvel.
   */
  getAmenities() {
    if (!this.#estate) return []

    const amenities = []

    if (this.#estate.numberOfRooms) {
      amenities.push(`${this.#estate.numberOfRooms} dormitórios`)
    }

    if (this.#estate.amenities?.length > 0) {
      amenities.push(this.#estate.amenities[0].description)
    }

    if (this.#estate.area) {
      amenities.push(`${this.#estate.area}m²`)
    }

    return amenities
  }

  /**
   * Retorna resumo curto do anúncio.
   */
  summary() {
    const addr = this.getFormattedAddress()
    return `Anúncio #${this.#id} — ${addr.city}/${addr.neighborhood} — ${this.#active ? 'Ativo' : 'Inativo'}`
  }

  isAdvertisement(object){
    return object instanceof Advertisement
  }
}
