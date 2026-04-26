/**
 * ValidateTokenResponse.js
 * DTO de resposta da validação de token do cal-service.
 */

export class ValidateTokenResponse {
  #email
  #accessLevel

  constructor({ email = '', accessLevel = '' }) {
    this.#email = email
    this.#accessLevel = accessLevel
  }

  get email() { return this.#email }
  get accessLevel() { return this.#accessLevel }

  isAdmin() {
    return this.#accessLevel === 'ADMIN'
  }

  static fromApi(data) {
    if (!data) return null

    return new ValidateTokenResponse({
      email: data.email,
      accessLevel: data.accessLevel,
    })
  }
}