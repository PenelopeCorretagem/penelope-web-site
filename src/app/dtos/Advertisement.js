/**
 * Advertisement.js
 * DTO + lógica de domínio para anúncios de imóveis.
 * Sem lógica de apresentação.
 */
export class Advertisement {
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

  // ===== LÓGICA DE DOMÍNIO =====

  isActive() {
    return this.#active === true
  }

  isFeatured() {
    return this.#featured === true
  }

  isExpired() {
    if (!this.#endDate) return false
    return new Date(this.#endDate) < new Date()
  }
}
