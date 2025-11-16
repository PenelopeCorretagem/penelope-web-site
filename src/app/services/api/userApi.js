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
  const response = await axiosInstance.get('/users')

  // Log detalhado dos dados brutos
  console.log('📋 [USERS API] Usuários retornados (brutos):', response.data)
  if (response.data && response.data.length > 0) {
    console.log('📋 [USERS API] Primeiro usuário (exemplo):', response.data[0])
    console.log('📋 [USERS API] Keys do primeiro usuário:', Object.keys(response.data[0]))
  }

  return userMapper.toEntityList(response.data)
}

/**
 * Busca um usuário específico por ID.
 * @param {number} id - O ID do usuário.
 * @returns {Promise<User>} Entidade User.
 */
export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`)
  return userMapper.toEntity(response.data)
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
