/**
 * CalServiceAuthMapper.js
 * Converte respostas de autenticação do cal-service para DTOs do front.
 */

import { LoginResponse } from '@dtos/LoginResponse'
import { ValidateTokenResponse } from '@dtos/ValidateTokenResponse'

export class CalServiceAuthMapper {
  static toLoginResponse(data) {
    if (!data) return null
    return LoginResponse.fromApi(data)
  }

  static toValidateTokenResponse(data) {
    if (!data) return null
    return ValidateTokenResponse.fromApi(data)
  }
}