import { User } from '../../model/entities/User'

export const userMapper = {
  /**
   * Converte dados da API para entidade User
   * Suporta tanto campos em português quanto em inglês
   */
  toEntity: (data) => {
    if (!data) return null

    // Log detalhado para debug
    if (!data.id && import.meta.env.DEV) {
      console.log('⚠️ [MAPPER] Dados sem ID:', {
        keys: Object.keys(data),
        email: data.email,
        allData: data,
      })
    }

    // Tentar extrair ID de campos alternativos
    const userId = data.id || data.userId || data.user_id || data.ID

    return new User({
      ...data,
      id: userId,
    })
  },

  /**
   * Converte lista de dados da API para lista de entidades User
   */
  toEntityList: (dataList) => {
    if (!Array.isArray(dataList)) return []
    return dataList.map((data) => userMapper.toEntity(data))
  },

  /**
   * Converte entidade User para payload de requisição
   */
  toRequestPayload: (user) => {
    if (!user) return null
    if (user instanceof User) {
      return user.toRequestPayload()
    }
    // Se for um objeto simples, converte para User primeiro
    const userEntity = new User(user)
    return userEntity.toRequestPayload()
  },
}
