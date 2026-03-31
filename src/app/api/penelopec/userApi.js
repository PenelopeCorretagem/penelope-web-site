import axiosInstance from '@api/axiosInstance'

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
  const response = await axiosInstance.post('/users', userData)
  return response.data
}

/**
 * Lista todos os usuários cadastrados.
 * @returns {Promise<object[]>} Dados brutos dos usuários
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/users')
    return response.data
  } catch (error) {
    console.error('❌ [USERS API] Erro ao buscar usuários:', error.message)
    throw error
  }
}

/**
 * Busca um usuário específico por ID.
 * @param {number} id - O ID do usuário
 * @returns {Promise<object>} Dados brutos do usuário
 */
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error(`❌ [USERS API] Erro ao buscar usuário ${id}:`, error)
    throw error
  }
}

/**
 * Atualiza os dados de um usuário específico.
 * @param {number} id - O ID do usuário
 * @param {object} userData - Dados atualizados do usuário
 * @returns {Promise<object>} Dados brutos do usuário atualizado
 */
export const updateUser = async (id, userData) => {
  const response = await axiosInstance.patch(`/users/${id}`, userData)
  return response.data
}

/**
 * Remove um usuário específico por ID.
 * @param {number} id - O ID do usuário
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  await axiosInstance.delete(`/users/${id}`)
}

/**
 * Alias para compatibilidade com nomenclatura anterior
 */
export const registerUser = createUser
