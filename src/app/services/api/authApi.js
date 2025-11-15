import axiosInstance from './axiosInstance'

/**
 * Autentica um usuário.
 * @param {object} credentials - Credenciais do usuário { email, senha }
 * @returns {Promise<object>} Objeto com token { token: string }
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', {
    email: credentials.email,
    senha: credentials.senha,
  })

  // A resposta do backend é { token: "..." }
  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }

  return response.data
}

/**
 * Solicita a recuperação de senha.
 * @param {string} email - O e-mail do usuário.
 * @returns {Promise<object>} Mensagem de confirmação
 */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', {
    email,
  })

  // Backend retorna string direta: "Se o e-mail estiver cadastrado..."
  return {
    message: response.data,
    success: true,
  }
}

/**
 * Verifica a validade de um token de redefinição de senha.
 * @param {string} token - Token de redefinição.
 * @returns {Promise<object>} Confirmação de validade
 */
export const validateResetToken = async (token) => {
  const response = await axiosInstance.post('/auth/validate-token', {
    token,
  })

  // Backend retorna string: "Token é válido."
  return {
    message: response.data,
    valid: true,
  }
}

/**
 * Atualiza a senha do usuário utilizando um token válido de redefinição.
 * @param {object} data - { token, newPassword }
 * @returns {Promise<object>} Confirmação da redefinição
 */
export const resetPassword = async ({ token, newPassword }) => {
  const response = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  })

  // Backend retorna string: "Senha redefinida com sucesso."
  return {
    message: response.data,
    success: true,
  }
}

/**
 * Faz logout removendo o token
 */
export const logout = () => {
  localStorage.removeItem('authToken')
}
