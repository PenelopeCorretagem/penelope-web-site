/**
 * Representa um usuário do sistema com dados pessoais, acesso e status.
 *
 * Campos privados garantem encapsulamento e controle total sobre leituras e escritas.
 */
export class User {
  // ===== PRIVATE FIELDS =====
  #id
  #name
  #email
  #phone
  #creci
  #cpf
  #dateBirth
  #monthlyIncome
  #accessLevel
  #active
  #dateCreation

  constructor({
    id,
    name,
    email,
    phone,
    creci,
    cpf,
    dateBirth,
    monthlyIncome,
    accessLevel,
    active,
    dateCreation,
  }) {
    this.#id = id ?? null
    this.#name = name ?? ''
    this.#email = email ?? ''
    this.#phone = phone ?? ''
    this.#creci = creci ?? ''
    this.#cpf = cpf ?? ''
    this.#dateBirth = dateBirth ?? null
    this.#monthlyIncome = monthlyIncome ?? null
    this.#accessLevel = accessLevel ?? null
    this.#active = active !== undefined ? active : true
    this.#dateCreation = dateCreation ?? new Date().toISOString()
  }

  // ===== GETTERS =====
  get id() { return this.#id }
  get name() { return this.#name }
  get email() { return this.#email }
  get phone() { return this.#phone }
  get creci() { return this.#creci }
  get cpf() { return this.#cpf }
  get dateBirth() { return this.#dateBirth }
  get monthlyIncome() { return this.#monthlyIncome }
  get accessLevel() { return this.#accessLevel }
  get active() { return this.#active }
  get dateCreation() { return this.#dateCreation }

  // ===== SETTERS =====
  set name(v) { this.#name = v }
  set email(v) { this.#email = v }
  set phone(v) { this.#phone = v }
  set creci(v) { this.#creci = v }
  set cpf(v) { this.#cpf = v }
  set dateBirth(v) { this.#dateBirth = v }
  set monthlyIncome(v) { this.#monthlyIncome = v }
  set accessLevel(v) { this.#accessLevel = v }
  set active(v) { this.#active = v }
  // id e dateCreation normalmente não são setáveis — mas se quiser eu adiciono.

  // ===== MÉTODOS DE NEGÓCIO =====

  /**
   * Verifica se o usuário possui registro CRECI.
   */
  hasCreci() {
    return Boolean(this.#creci && this.#creci.trim() !== '')
  }

  /**
   * Retorna o nome com CRECI incluído, se existir.
   */
  getDisplayName() {
    return this.#creci ? `${this.#name} (CRECI: ${this.#creci})` : this.#name
  }

  /**
   * Verifica se o usuário está ativo no sistema.
   */
  isActive() {
    return this.#active === true
  }

  /**
   * Converte para payload aceito pela API.
   */
  toRequestPayload() {
    return {
      name: this.#name,
      email: this.#email,
      cpf: this.#cpf,
      dateBirth: this.#dateBirth,
      phone: this.#phone,
      creci: this.#creci,
      monthlyIncome: this.#monthlyIncome,
      accessLevel: this.#accessLevel,
    }
  }

  /**
   * Converte dados recebidos da API para instância da entidade.
   */
  static fromApi(apiData) {
    return new User({
      id: apiData.id,
      name: apiData.name,
      email: apiData.email,
      phone: apiData.phone,
      creci: apiData.creci,
      cpf: apiData.cpf,
      dateBirth: apiData.dateBirth,
      monthlyIncome: apiData.monthlyIncome,
      accessLevel: apiData.accessLevel,
      active: apiData.active,
      dateCreation: apiData.dateCreation,
    })
  }
}
