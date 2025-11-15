import { User } from '../../model/entities/User'

export const userMapper = {
  /**
   * Converte dados da API para entidade User
   * Suporta tanto campos em português quanto em inglês
   */
  toEntity: (data) => {
    if (!data) return null
    return new User(data)
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
