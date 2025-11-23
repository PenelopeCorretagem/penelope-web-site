/**
 * Representa um formulário de contato enviado pelo usuário.
 */
export class ContactUs {
  // ===== PRIVATE FIELDS =====
  #name
  #email
  #subject
  #message

  constructor({
    nome,
    name,
    email,
    assunto,
    subject,
    mensagem,
    message,
  }) {
    this.#name = nome || name || ''
    this.#email = email || ''
    this.#subject = assunto || subject || ''
    this.#message = mensagem || message || ''
  }

  // ===== GETTERS =====
  get name() { return this.#name }
  get email() { return this.#email }
  get subject() { return this.#subject }
  get message() { return this.#message }

  // ===== SETTERS =====
  set name(v) { this.#name = v }
  set email(v) { this.#email = v }
  set subject(v) { this.#subject = v }
  set message(v) { this.#message = v }

  // ===== MÉTODOS =====

  /**
   * Verifica se todos os campos obrigatórios estão presentes.
   */
  isValid() {
    return Boolean(
      this.#name &&
      this.#email &&
      this.#subject &&
      this.#message
    )
  }

  /**
   * Retorna um pequeno resumo da mensagem (útil para logs e dashboards).
   */
  summary() {
    return `${this.#name} — ${this.#subject}: ${this.#message.slice(0, 30)}...`
  }

  /**
   * Converte para o formato esperado pela API.
   */
  toRequestPayload() {
    return {
      nome: this.#name,
      email: this.#email,
      assunto: this.#subject,
      mensagem: this.#message,
    }
  }

  /**
   * Constrói um ContactUs a partir de dados da API.
   */
  static fromApi(apiData) {
    if (!apiData) return null

    return new ContactUs({
      nome: apiData.nome,
      email: apiData.email,
      assunto: apiData.assunto,
      mensagem: apiData.mensagem,
    })
  }
}
