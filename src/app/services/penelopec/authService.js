import * as authApi from '@api-penelopec/authApi'
import * as userApi from '@api-penelopec/userApi'
import { userMapper } from '@mappers/userMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de autenticação e conversão de dados
 */

/**
 * Realiza o login do usuário.
 * @param {object} credentials - { email, password }
 * @returns {Promise<{token: string, user: User|object, id: number}>} Dados de login transformados
 */
export const login = async (credentials) => {
  const response = await authApi.login(credentials)

  // Se response.data for string, é só o token
  if (typeof response === 'string') {
    return {
      token: response,
      user: null,
      id: null
    }
  }

  // Extrair ID de todas as formas possíveis
  const extractedId = response.id ||
                      response.user?.id ||
                      response.usuario?.id ||
                      response.userId ||
                      null

  // Mapear user se existir
  const mappedUser = response.user || response.usuario ?
    userMapper.toEntity(response.user || response.usuario) :
    null

  const result = {
    token: response.token || response,
    user: mappedUser,
    id: extractedId,
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
