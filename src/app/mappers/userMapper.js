import { User } from '@dtos/User'

export const userMapper = {
  /**
   * Converte dados da API para entidade User
   * Suporta tanto campos em português quanto em inglês
   */
  toEntity: (data) => {
    if (!data) return null



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

    const payload = {
      name: user.name || user.nomeCompleto,
      email: user.email,
      cpf: user.cpf,
      dateBirth: user.dateBirth || user.dtNascimento,
      phone: user.phone,
      creci: user.creci,
      monthlyIncome: user.monthlyIncome || user.rendaMensal,
      accessLevel: user.accessLevel,
    }

    // Incluir senha se estiver presente
    if (user.senha) {
      payload.password = user.senha
    }

    return payload
  },
}
