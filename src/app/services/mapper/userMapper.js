import { User } from '../../model/entities/User'

export const userMapper = {
  /**
   * Converte dados da API para entidade User
   * Suporta tanto campos em português quanto em inglês
   */
  toEntity: (data) => {
    if (!data) return null

    console.log('🔍 [USER MAPPER] User data:', {
      id: data.id,
      name: data.name,
      email: data.email,
      creci: data.creci,
      active: data.active
    })

    return new User({
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      creci: data.creci,
      cpf: data.cpf,
      dateBirth: data.dateBirth,
      monthlyIncome: data.monthlyIncome,
      accessLevel: data.accessLevel,
      active: data.active !== undefined ? data.active : true,
      dateCreation: data.dateCreation,
    })
  },

  /**
   * Converte lista de dados da API para lista de entidades User
   */
  toEntityList: (dataList) => {
    if (!Array.isArray(dataList)) {
      console.warn('⚠️ [USER MAPPER] Dados não são array:', dataList)
      return []
    }

    const mapped = dataList.map((data) => userMapper.toEntity(data)).filter(Boolean)

    console.log(`✅ [USER MAPPER] ${mapped.length}/${dataList.length} usuários mapeados`)

    return mapped
  },

  /**
   * Converte entidade User para payload de requisição
   */
  toRequestPayload: (user) => {
    if (!user) return null

    if (user instanceof User) {
      return user.toRequestPayload()
    }

    return {
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      dateBirth: user.dateBirth,
      phone: user.phone,
      creci: user.creci,
      monthlyIncome: user.monthlyIncome,
      accessLevel: user.accessLevel,
    }
  },
}
