import * as authApi from '@api-penelopec/authApi'
import { userMapper } from '@mappers/userMapper'
import { normalizeAccessLevel } from '@constant/accessLevels'
import { handleAuthError } from '@responses/penelopec/AuthResponse'

export const login = async (credentials) => {
  if (!credentials?.email)
    throw new Error('O e-mail é obrigatório')
  if (!credentials?.password)
    throw new Error('A senha é obrigatória')

  try {
    const response = await authApi.login(credentials)

    return {
      token: response.token,
      id: response.id,
      accessLevel: normalizeAccessLevel(response.accessLevel),
    }
  } catch (error) {
    throw handleAuthError(error, 'Login')
  }
}

export const register = async (userData) => {
  if (!userData?.name)
    throw new Error('O nome é obrigatório')
  if (!userData?.email)
    throw new Error('O e-mail é obrigatório')
  if (!userData?.password)
    throw new Error('A senha é obrigatória')

  try {
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      accessLevel: normalizeAccessLevel(userData.accessLevel),
    }

    const response = await authApi.register(payload)
    return userMapper.toEntity(response)
  } catch (error) {
    throw handleAuthError(error, 'Registro')
  }
}

export const validateResetToken = async (token) => {
  if (!token)
    throw new Error('O token é obrigatório')

  try {
    return await authApi.validateResetToken(token)
  } catch (error) {
    throw handleAuthError(error, 'Validação de Token')
  }
}

export const resetPassword = async (token, newPassword) => {
  if (!token)
    throw new Error('O token é obrigatório')
  if (!newPassword)
    throw new Error('A nova senha é obrigatória')

  try {
    return await authApi.resetPassword(token, newPassword)
  } catch (error) {
    throw handleAuthError(error, 'Recuperação de Senha')
  }
}
