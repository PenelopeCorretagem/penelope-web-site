import { User } from '@dtos/User'
import { normalizeAccessLevel } from '@constant/accessLevels'

export const userMapper = {
  toEntity(data) {
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
      accessLevel: normalizeAccessLevel(data.accessLevel),
      active: data.active !== undefined ? data.active : true,
      dateCreation: data.dateCreation,
    })
  },

  toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => userMapper.toEntity(data)).filter(Boolean)
  },

  toRequestPayload(user) {
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
      accessLevel: normalizeAccessLevel(user.accessLevel),
    }
  },
}
