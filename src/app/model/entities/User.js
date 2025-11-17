export class User {
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
    this.id = id
    this.name = name
    this.email = email
    this.phone = phone
    this.creci = creci
    this.cpf = cpf
    this.dateBirth = dateBirth
    this.monthlyIncome = monthlyIncome
    this.accessLevel = accessLevel
    this.active = active !== undefined ? active : true
    this.dateCreation = dateCreation
  }

  /**
   * Verifica se o usuário tem CRECI
   */
  hasCreci() {
    return Boolean(this.creci && this.creci.trim() !== '')
  }

  /**
   * Retorna nome com CRECI se disponível
   */
  getDisplayName() {
    return this.creci ? `${this.name} (CRECI: ${this.creci})` : this.name
  }

  /**
   * Verifica se o usuário está ativo
   */
  isActive() {
    return this.active === true
  }

  /**
   * Converte para payload de requisição
   */
  toRequestPayload() {
    return {
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      dateBirth: this.dateBirth,
      phone: this.phone,
      creci: this.creci,
      monthlyIncome: this.monthlyIncome,
      accessLevel: this.accessLevel,
    }
  }
}
