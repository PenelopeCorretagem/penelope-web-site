export class ContactUs {
  #name
  #email
  #subject
  #message

  constructor({ name, email, subject, message }) {
    this.#name = name ?? ''
    this.#email = email ?? ''
    this.#subject = subject ?? ''
    this.#message = message ?? ''
  }

  get name() { return this.#name }
  get email() { return this.#email }
  get subject() { return this.#subject }
  get message() { return this.#message }

  set name(v) { this.#name = v }
  set email(v) { this.#email = v }
  set subject(v) { this.#subject = v }
  set message(v) { this.#message = v }

  // ===== LÓGICA DE DOMÍNIO =====

  isValid() {
    return Boolean(
      this.#name?.trim() &&
      this.#email?.trim() &&
      this.#subject?.trim() &&
      this.#message?.trim()
    )
  }
}
