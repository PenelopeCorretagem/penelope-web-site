import axiosInstance from '@api/axiosInstance'

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
  try {
    const response = await axiosInstance.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    })

    return response.data
  } catch (error) {
    console.error('❌ [AUTH API] Erro no login:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    })
    throw error
  }
}

/**
 * Registra um novo usuário.
 * @param {object} userData - { name, email, password, accessLevel }
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/users', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      accessLevel: userData.accessLevel || 'CLIENTE',
    })

    return response.data
  } catch (error) {
    console.error('❌ [AUTH API] Erro no registro:', error.response?.data)
    throw error
  }
}

/**
 * Solicita recuperação de senha.
 * @param {string} email
 * @returns {Promise<string|object>} Mensagem da API ou payload bruto
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/users/forgot-password', { email })
    return response.data?.message || response.data
  } catch (error) {
    // Compatibilidade com ambientes que expõem o endpoint via /auth
    if (error.response?.status === 404) {
      const fallbackResponse = await axiosInstance.post('/auth/forgot-password', { email })
      return fallbackResponse.data?.message || fallbackResponse.data
    }
    throw error
  }
}

/**
 * Valida o token de recuperação.
 * @param {string} token
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const validateResetToken = async (token) => {
  const response = await axiosInstance.post('/auth/validate-reset-token', { token })
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
  })
  return response.data
}
