import axiosInstance from '@api/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

/**
 * Camada de API - Responsável apenas por requisições HTTP
 * Retorna dados brutos sem transformação de negócio
 */

/**
 * Cria um novo usuário na API.
 * @param {object} userData - Dados do usuário
 * @returns {Promise<object>} Dados brutos da resposta
 */
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Lista todos os usuários cadastrados.
 * @returns {Promise<object[]>} Dados brutos dos usuários
 */
export const getAllUsers = async () => {
  const response = await axiosInstance.get('/users', { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Busca um usuário específico por ID.
 * @param {number} id - O ID do usuário
 * @returns {Promise<object>} Dados brutos do usuário
 */
export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Atualiza os dados de um usuário específico.
 * @param {number} id - O ID do usuário
 * @param {object} userData - Dados atualizados do usuário
 * @returns {Promise<object>} Dados brutos do usuário atualizado
 */
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/users/${id}`, userData, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data
}

/**
 * Remove um usuário específico por ID.
 * @param {number} id - O ID do usuário
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  await axiosInstance.delete(`/users/${id}`, { baseURL: PENELOPEC_API_BASE_URL })
}

/**
 * Solicita recuperação de senha.
 * @param {string} email
 * @returns {Promise<string|object>} Mensagem da API ou payload bruto
 */
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/users/forgot-password', { email }, { baseURL: PENELOPEC_API_BASE_URL })
  return response.data?.message || response.data
}

/**
 * Alias para compatibilidade com nomenclatura anterior
 */
export const registerUser = createUser
