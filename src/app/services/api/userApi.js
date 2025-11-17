import axiosInstance from './axiosInstance'
import { userMapper } from '../mapper/userMapper'

/**
 * Registra um novo usuário.
 * @param {object} userData - Dados do usuário { nomeCompleto, email, senha, cpf, dtNascimento, phone }
 * @returns {Promise<User>} Entidade User.
 */
export const registerUser = async (userData) => {
  const payload = userMapper.toRequestPayload(userData)
  const response = await axiosInstance.post('/users', payload)
  return userMapper.toEntity(response.data)
}

/**
 * Lista todos os usuários cadastrados.
 * @returns {Promise<User[]>} Lista de entidades User.
 */
export const getAllUsers = async () => {
  try {
    console.log('📋 [USERS API] Buscando usuários...')
    const response = await axiosInstance.get('/users')

    console.log('📋 [USERS API] Resposta:', {
      status: response.status,
      count: response.data?.length || 0
    })

    return userMapper.toEntityList(response.data)
  } catch (error) {
    console.error('❌ [USERS API] Erro ao buscar usuários:', error.message)
    throw error
  }
}

/**
 * Busca um usuário específico por ID.
 * @param {number} id - O ID do usuário.
 * @returns {Promise<User>} Entidade User.
 */
export const getUserById = async (id) => {
  try {
    console.log(`📋 [USERS API] Buscando usuário com ID: ${id}`)
    const response = await axiosInstance.get(`/users/${id}`)
    console.log('📋 [USERS API] Usuário encontrado:', response.data)
    return userMapper.toEntity(response.data)
  } catch (error) {
    console.error(`❌ [USERS API] Erro ao buscar usuário ${id}:`, error)
    throw error
  }
}

/**
 * Atualiza os dados de um usuário específico.
 * @param {number} id - O ID do usuário.
 * @param {object} userData - Dados atualizados do usuário.
 * @returns {Promise<User>} Entidade User atualizada.
 */
export const updateUser = async (id, userData) => {
  const payload = userMapper.toRequestPayload(userData)
  const response = await axiosInstance.patch(`/users/${id}`, payload)
  return userMapper.toEntity(response.data)
}

/**
 * Remove um usuário específico por ID.
 * @param {number} id - O ID do usuário.
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  await axiosInstance.delete(`/users/${id}`)
}

/**
 * Lista usuários que possuem CRECI (corretores).
 * @returns {Promise<User[]>} Lista de entidades User com CRECI.
 */
export const getUsersWithCreci = async () => {
  try {
    console.log('📋 [USERS API] Buscando usuários com CRECI...')

    const allUsers = await getAllUsers()
    console.log('📋 [USERS API] Total usuários:', allUsers.length)

    const usersWithCreci = allUsers.filter(user => {
      const hasCreci = user.hasCreci()
      const isActive = user.isActive()

      if (hasCreci) {
        console.log(`👤 [USERS API] Usuário com CRECI: ${user.name} (${user.creci}) - Ativo: ${isActive}`)
      }

      return hasCreci && isActive
    })

    console.log('📋 [USERS API] Usuários com CRECI ativos:', usersWithCreci.length)

    return usersWithCreci
  } catch (error) {
    console.error('❌ [USERS API] Erro ao buscar usuários com CRECI:', error)
    return []
  }
}
