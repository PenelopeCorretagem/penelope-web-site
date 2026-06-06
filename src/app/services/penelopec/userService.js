import * as userApi from '@api-penelopec/userApi'
import { userMapper } from '@mappers/userMapper'
import { User } from '@dtos/User'
import { handleUserError } from '@responses/penelopec/UserResponse'

export const createUser = async (userData) => {
  if (!userData)
    throw new Error('Os dados do usuário são obrigatórios')
  if (!userData.name)
    throw new Error('O nome é obrigatório')
  if (!userData.email)
    throw new Error('O e-mail é obrigatório')

  try {
    const payload = userData instanceof User
      ? userMapper.toRequestPayload(userData)
      : userData

    const response = await userApi.createUser(payload)
    return userMapper.toEntity(response)
  } catch (error) {
    throw handleUserError(error, 'Criação')
  }
}

export const getAllUsers = async (page = 1, pageSize = 10) => {
  try {
    const response = await userApi.getAllUsers(page, pageSize)
    const rawList = response?.content || response?.data || response || []
    return userMapper.toEntityList(rawList)
  } catch (error) {
    throw handleUserError(error, 'Listagem')
  }
}

export const getUserById = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para buscar um usuário')

  try {
    const response = await userApi.getUserById(id)
    return userMapper.toEntity(response)
  } catch (error) {
    throw handleUserError(error, 'Busca')
  }
}

export const updateUser = async (id, userData) => {
  if (!id)
    throw new Error('O ID é obrigatório para atualizar um usuário')
  if (!userData)
    throw new Error('Os dados de atualização são obrigatórios')

  try {
    const payload = userData instanceof User
      ? userMapper.toRequestPayload(userData)
      : userData

    const response = await userApi.updateUser(id, payload)
    return userMapper.toEntity(response)
  } catch (error) {
    throw handleUserError(error, 'Atualização')
  }
}

export const deleteUser = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para excluir um usuário')

  try {
    await userApi.deleteUser(id)
  } catch (error) {
    throw handleUserError(error, 'Exclusão')
  }
}

export const forgotPassword = async (email) => {
  if (!email)
    throw new Error('O e-mail é obrigatório para recuperação de senha')

  try {
    const response = await userApi.forgotPassword(email)
    return response?.message || response
  } catch (error) {
    throw handleUserError(error, 'Recuperação de Senha')
  }
}

export const getUserProfile = async () => {
  try {
    const response = await userApi.getUserProfile()
    return userMapper.toEntity(response)
  } catch (error) {
    throw handleUserError(error, 'Busca de Perfil')
  }
}

/**
 * Lista corretores ativos — usuários com CRECI e status ativo, 
 * filtrando apenas os do tipo CORRETOR ou ADMIN.
 * Usado para popular selects de responsável em anúncios e agendamentos.
 */
export const getUsersWithCreci = async () => {
  const users = await getAllUsers()
  return users.filter(user => user.hasCreci() && user.isActive() && (user.isBroker() || user.isAdmin()))
}
