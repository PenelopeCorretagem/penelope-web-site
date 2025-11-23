/**
 * Representa um endereço completo de um imóvel ou usuário.
 */
export class Address {
  // ===== PRIVATE FIELDS =====
  #id
  #street
  #number
  #neighborhood
  #city
  #uf
  #region
  #zipCode

  constructor({
    id,
    street,
    number,
    neighborhood,
    city,
    uf,
    region,
    zipCode,
  }) {
    this.#id = id ?? null
    this.#street = street ?? ''
    this.#number = number ?? ''
    this.#neighborhood = neighborhood ?? ''
    this.#city = city ?? ''
    this.#uf = uf ?? ''
    this.#region = region ?? ''
    this.#zipCode = zipCode ?? ''
  }

  // ===== GETTERS =====
  get id() { return this.#id }
  get street() { return this.#street }
  get number() { return this.#number }
  get neighborhood() { return this.#neighborhood }
  get city() { return this.#city }
  get uf() { return this.#uf }
  get region() { return this.#region }
  get zipCode() { return this.#zipCode }

  // ===== SETTERS =====
  set street(v) { this.#street = v }
  set number(v) { this.#number = v }
  set neighborhood(v) { this.#neighborhood = v }
  set city(v) { this.#city = v }
  set uf(v) { this.#uf = v }
  set region(v) { this.#region = v }
  set zipCode(v) { this.#zipCode = v }

  // (id normalmente não muda, mas posso adicionar setter se quiser)

  // ===== MÉTODOS DE NEGÓCIO =====

  /**
   * Retorna o endereço completo em formato legível.
   */
  getFullAddress() {
    return `${this.#street}, ${this.#number}, ${this.#neighborhood}, ${this.#city} - ${this.#uf}`
  }

  /**
   * Retorna um resumo curto do endereço.
   */
  summary() {
    return `${this.#city}/${this.#uf} — ${this.#neighborhood}`
  }

  /**
   * Prepara para envio à API.
   */
  toRequestPayload() {
    return {
      street: this.#street,
      number: this.#number,
      neighborhood: this.#neighborhood,
      city: this.#city,
      uf: this.#uf,
      region: this.#region,
      zipCode: this.#zipCode,
    }
  }

  /**
   * Constrói a entidade a partir de dados crus vindos da API.
   */
  static fromApi(apiData) {
    if (!apiData) return null

    return new Address({
      id: apiData.id,
      street: apiData.street,
      number: apiData.number,
      neighborhood: apiData.neighborhood,
      city: apiData.city,
      uf: apiData.uf,
      region: apiData.region,
      zipCode: apiData.zipCode,
    })
  }
}
