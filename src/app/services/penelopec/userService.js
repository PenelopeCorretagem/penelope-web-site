import * as userApi from '@api-penelopec/userApi'
import { userMapper } from '@mappers/userMapper'

/**
 * Camada de Serviço - Orquestra a chamada à API e transformação de dados
 * Responsável por lógica de negócio e conversão de DTOs para entidades de domínio
 */

/**
 * Cria um novo usuário no sistema.
 * @param {object} userData - Dados do usuário
 * @returns {Promise<User>} Entidade User criada
 */
export const createUser = async (userData) => {
  const response = await userApi.createUser(userData)
  return userMapper.toEntity(response)
}

/**
 * Lista todos os usuários cadastrados.
 * @returns {Promise<User[]>} Lista de entidades User
 */
export const getAllUsers = async () => {
  const response = await userApi.getAllUsers()
  return userMapper.toEntityList(response)
}

/**
 * Busca um usuário específico por ID.
 * @param {number} id - ID do usuário
 * @returns {Promise<User>} Entidade User
 */
export const getUserById = async (id) => {
  const response = await userApi.getUserById(id)
  return userMapper.toEntity(response)
}

/**
 * Atualiza um usuário.
 * @param {number} id - ID do usuário
 * @param {object} userData - Dados atualizados
 * @returns {Promise<User>} Entidade User atualizada
 */
export const updateUser = async (id, userData) => {
  const response = await userApi.updateUser(id, userData)
  return userMapper.toEntity(response)
}

/**
 * Remove um usuário.
 * @param {number} id - ID do usuário
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  return await userApi.deleteUser(id)
}

/**
 * Alias para compatibilidade
 */
export const registerUser = createUser

/**
 * Lista usuários que possuem CRECI (corretores ativos).
 * @returns {Promise<User[]>} Lista de usuários com CRECI
 */
export const getUsersWithCreci = async () => {
  try {
    const users = await getAllUsers()
    return users.filter(user => user.hasCreci?.() && user.isActive?.())
  } catch {
    return []
  }
}
