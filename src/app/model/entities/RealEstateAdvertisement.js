/**
 * Representa um anúncio de imóvel, incluindo status,
 * datas, responsáveis e o imóvel relacionado.
 */
export class RealEstateAdvertisement {
  // ===== PRIVATE FIELDS =====
  #id
  #active
  #emphasis
  #createdAt
  #endDate
  #creator
  #responsible
  #estate

  constructor({
    id,
    active,
    emphasis,
    createdAt,
    endDate,
    creator,
    responsible,
    estate,
  }) {
    this.#id = id ?? null
    this.#active = active ?? true
    this.#emphasis = emphasis ?? false
    this.#createdAt = createdAt ?? new Date().toISOString()
    this.#endDate = endDate ?? null
    this.#creator = creator ?? null
    this.#responsible = responsible ?? null
    this.#estate = estate ?? null
  }

  // ===== GETTERS =====
  get id() { return this.#id }
  get active() { return this.#active }
  get emphasis() { return this.#emphasis }
  get createdAt() { return this.#createdAt }
  get endDate() { return this.#endDate }
  get creator() { return this.#creator }
  get responsible() { return this.#responsible }
  get estate() { return this.#estate }

  // ===== SETTERS =====
  set active(v) { this.#active = v }
  set emphasis(v) { this.#emphasis = v }
  set endDate(v) { this.#endDate = v }
  set creator(v) { this.#creator = v }
  set responsible(v) { this.#responsible = v }
  set estate(v) { this.#estate = v }

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
  getFeatures() {
    if (!this.#estate) return []

    const features = []

    if (this.#estate.numberOfRooms) {
      features.push(`${this.#estate.numberOfRooms} dormitórios`)
    }

    if (this.#estate.amenities?.length > 0) {
      features.push(this.#estate.amenities[0].description)
    }

    if (this.#estate.area) {
      features.push(`${this.#estate.area}m²`)
    }

    return features
  }

  /**
   * Retorna resumo curto do anúncio.
   */
  summary() {
    const addr = this.getFormattedAddress()
    return `Anúncio #${this.#id} — ${addr.city}/${addr.neighborhood} — ${this.#active ? 'Ativo' : 'Inativo'}`
  }

  isRealEstateAdvertisement(object){
    return object instanceof RealEstateAdvertisement
  }
}
