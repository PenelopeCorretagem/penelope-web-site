import axiosInstance from './axiosInstance'

/**
 * Realiza o login do usuário.
 * @param {object} credentials - { email, senha }
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (credentials) => {
  try {
    console.log('🔐 [AUTH] Tentando login com:', {
      email: credentials.email,
      senhaLength: credentials.senha?.length,
    })

    const response = await axiosInstance.post('/auth/login', {
      email: credentials.email,
      senha: credentials.senha,
    })

    // Log extremamente detalhado
    console.log('✅ [AUTH API] Response status:', response.status)
    console.log('✅ [AUTH API] Response.data type:', typeof response.data)
    console.log('✅ [AUTH API] Response.data is string?', typeof response.data === 'string')
    console.log('✅ [AUTH API] Response.data keys:', response.data ? Object.keys(response.data) : 'N/A')
    console.log('✅ [AUTH API] Response.data completo:', response.data)
    console.log('✅ [AUTH API] Response.data.token:', response.data?.token)
    console.log('✅ [AUTH API] Response.data.id:', response.data?.id)
    console.log('✅ [AUTH API] Response.data.user:', response.data?.user)
    console.log('✅ [AUTH API] Response.data.usuario:', response.data?.usuario)

    // Se response.data for string, é só o token
    if (typeof response.data === 'string') {
      console.log('⚠️ [AUTH API] Response.data é string (token), retornando formato padrão')
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

    console.log('✅ [AUTH API] Retornando:', {
      hasToken: !!result.token,
      hasUser: !!result.user,
      hasId: !!result.id,
      id: result.id,
      accessLevel: result.accessLevel
    })

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
    console.log('📝 [AUTH] Tentando registro')

    const response = await axiosInstance.post('/users', {
      nomeCompleto: userData.nomeCompleto,
      email: userData.email,
      senha: userData.senha,
      accessLevel: 'CLIENTE',
    })

    console.log('✅ [AUTH] Registro bem-sucedido')
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
