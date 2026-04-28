/**
 * authService.js
 * Serviço de negócio para autenticação no cal-service.
 */

import * as authApi from '@api-calservice/authApi'
import { CalServiceAuthMapper } from '@mappers/CalServiceAuthMapper'

export const login = async (credentials) => {
  const response = await authApi.login(credentials)
  return CalServiceAuthMapper.toLoginResponse(response)
}

export const validateToken = async (token) => {
  const response = await authApi.validateToken(token)
  return CalServiceAuthMapper.toValidateTokenResponse(response)
}