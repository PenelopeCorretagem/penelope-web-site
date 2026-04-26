import axiosInstance from '@api/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

/**
 * Camada de API - Responsável apenas por requisições HTTP
 * Retorna dados brutos sem transformação de negócio
 */

/**
 * Realiza o login do usuário.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
  }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })

  return response.data
}

/**
 * Registra um novo usuário.
 * @param {object} userData - { name, email, password, accessLevel }
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const register = async (userData) => {
  const response = await axiosInstance.post('/users', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    accessLevel: userData.accessLevel || 'CLIENTE',
  }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })

  return response.data
}

/**
 * Valida o token de recuperação.
 * @param {string} token
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const validateResetToken = async (token) => {
  const response = await axiosInstance.post('/auth/validate-reset-token', { token }, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Reseta a senha com o token.
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const resetPassword = async (token, newPassword) => {
  const response = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}
