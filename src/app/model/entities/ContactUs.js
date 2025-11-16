export class ContactUs {
  constructor({
    nome,
    name,
    email,
    assunto,
    subject,
    mensagem,
    message,
  }) {
    this.nome = nome || name
    this.email = email
    this.assunto = assunto || subject
    this.mensagem = mensagem || message
  }

  /**
   * Valida se todos os campos obrigatórios estão preenchidos
   */
  isValid() {
    return Boolean(
      this.nome &&
      this.email &&
      this.assunto &&
      this.mensagem
    )
  }

  /**
   * Converte para o formato esperado pela API (request)
   */
  toRequestPayload() {
    return {
      nome: this.nome,
      email: this.email,
      assunto: this.assunto,
      mensagem: this.mensagem,
    }
  }
}
