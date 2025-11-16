export class User {
  constructor({
    id,
    nomeCompleto,
    name,
    email,
    senha,
    password,
    cpf,
    dtNascimento,
    dateBirth,
    rendaMensal,
    monthlyIncome,
    phone,
    creci,
    accessLevel,
    dataCriacao,
    dateCreation,
    ativo,
    active,
    appointmentsClient = [],
    appointmentsEstateAgent = [],
    passwordResetToken,
    passwordResetTokenExpiry,
  }) {
    // Validar ID
    if (!id && import.meta.env.DEV) {
      console.warn('⚠️ User criado sem ID:', { email, nomeCompleto: nomeCompleto || name })
    }

    this.id = id
    this.nomeCompleto = nomeCompleto || name
    this.email = email
    this.senha = senha || password
    this.cpf = cpf
    this.dtNascimento = dtNascimento || dateBirth
    this.rendaMensal = rendaMensal || monthlyIncome || 0
    this.phone = phone
    this.creci = creci
    this.accessLevel = accessLevel
    this.dataCriacao = dataCriacao || dateCreation
    this.ativo = ativo !== undefined ? ativo : active
    this.appointmentsClient = appointmentsClient
    this.appointmentsEstateAgent = appointmentsEstateAgent
    this.passwordResetToken = passwordResetToken
    this.passwordResetTokenExpiry = passwordResetTokenExpiry
  }

  /**
   * Verifica se o usuário está ativo
   */
  isActive() {
    return this.ativo === true
  }

  /**
   * Verifica se o usuário é administrador
   */
  isAdmin() {
    return this.accessLevel === 'ADMINISTRADOR'
  }

  /**
   * Verifica se o usuário é cliente
   */
  isClient() {
    return this.accessLevel === 'CLIENTE'
  }

  /**
   * Retorna o nome formatado
   */
  getFormattedName() {
    return this.nomeCompleto
  }

  /**
   * Converte para o formato esperado pela API (request)
   */
  toRequestPayload() {
    return {
      nomeCompleto: this.nomeCompleto,
      email: this.email,
      senha: this.senha,
      cpf: this.cpf,
      dtNascimento: this.dtNascimento,
      rendaMensal: this.rendaMensal,
      phone: this.phone,
      creci: this.creci,
      accessLevel: this.accessLevel,
      ativo: this.ativo,
    }
  }
}
