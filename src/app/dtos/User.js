import { isAdminAccessLevel } from '@constant/accessLevels'

export class User {
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

  // ===== LÓGICA DE DOMÍNIO =====

  hasCreci() {
    return Boolean(this.#creci && this.#creci.trim() !== '')
  }

  isActive() {
    return this.#active === true
  }

  isAdmin() {
    return isAdminAccessLevel(this.#accessLevel)
  }

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
}
