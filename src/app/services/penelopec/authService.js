import * as authApi from '@api-penelopec/authApi'
import { userMapper } from '@mappers/userMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de autenticação e conversão de dados
 */

/**
 * Realiza o login do usuário.
 * @param {object} credentials - { email, password }
 * @returns {Promise<{token: string, id: number, accessLevel: string}>} Dados de login transformados
 */
export const login = async (credentials) => {
  const response = await authApi.login(credentials)

  const result = {
    token: response.token,
    id: response.id,
    accessLevel: response.accessLevel
  }
  return result
}

/**
 * Registra um novo usuário.
 * @param {object} userData - { name, email, password }
 * @returns {Promise<User>} Entidade User criada
 */
export const register = async (userData) => {
  const response = await authApi.register(userData)
  return userMapper.toEntity(response)
}

/**
 * Valida o token de recuperação.
 * @param {string} token
 * @returns {Promise<object>} Resposta da API
 */
export const validateResetToken = async (token) => {
  return await authApi.validateResetToken(token)
}

/**
 * Reseta a senha com o token.
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<object>} Resposta da API
 */
export const resetPassword = async (token, newPassword) => {
  return await authApi.resetPassword(token, newPassword)
}
