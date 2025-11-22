import axiosInstance from './axiosInstance'

/**
 * Realiza o login do usuário.
 * @param {object} credentials - { email, senha }
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email: credentials.email,
      senha: credentials.senha,
    })

    // Se response.data for string, é só o token
    if (typeof response.data === 'string') {
      return {
        token: response.data,
        user: null,
        id: null
      }
    }

    // Extrair ID de todas as formas possíveis
    const extractedId = response.data.id ||
                       response.data.user?.id ||
                       response.data.usuario?.id ||
                       response.data.userId ||
                       null

    const result = {
      token: response.data.token || response.data,
      user: response.data.user || response.data.usuario || null,
      id: extractedId,
      accessLevel: response.data.accessLevel
    }
    return result
  } catch (error) {
    console.error('❌ [AUTH] Erro detalhado no login:', {
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
 * @param {object} userData - { nomeCompleto, email, senha }
 * @returns {Promise}
 */
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/users', {
      nomeCompleto: userData.nomeCompleto,
      email: userData.email,
      senha: userData.senha,
      accessLevel: 'CLIENTE',
    })

    return response.data
  } catch (error) {
    console.error('❌ [AUTH] Erro no registro:', error.response?.data)
    throw error
  }
}

/**
 * Solicita recuperação de senha.
 * @param {string} email
 * @returns {Promise<string>}
 */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email })
  return response.data
}

/**
 * Valida o token de recuperação.
 * @param {string} token
 * @returns {Promise<string>}
 */
export const validateResetToken = async (token) => {
  const response = await axiosInstance.post('/auth/validate-token', { token })
  return response.data
}

/**
 * Reseta a senha com o token.
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<string>}
 */
export const resetPassword = async (token, newPassword) => {
  const response = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  })
  return response.data
}
