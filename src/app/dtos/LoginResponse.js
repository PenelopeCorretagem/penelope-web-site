/**
 * LoginResponse.js
 * DTO de resposta do login do cal-service.
 */

export class LoginResponse {
  #token
  #userId
  #accessLevel

  constructor({ token = null, userId = null, accessLevel = '' }) {
    this.#token = token
    this.#userId = userId
    this.#accessLevel = accessLevel
  }

  get token() { return this.#token }
  get userId() { return this.#userId }
  get accessLevel() { return this.#accessLevel }

  isAdmin() {
    return this.#accessLevel === 'ADMIN'
  }

  static fromApi(data) {
    if (!data) return null

    return new LoginResponse({
      token: data.token,
      userId: data.userId,
      accessLevel: data.accessLevel,
    })
  }
}