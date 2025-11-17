import { Advertisement } from '../../model/entities/Advertisement'
import { User } from '../../model/entities/User'
import { Address } from '../../model/entities/Address'
import { Estate } from '../../model/entities/Estate'

export const advertisementMapper = {
  toEntity: (data) => {
    if (!data) return null

    return new Advertisement({
      id: data.id,
      active: data.active,
      emphasis: data.emphasis,
      createdAt: data.createdAt,
      endDate: data.endDate,
      creator: data.creator ? new User(data.creator) : null,
      responsible: data.responsible ? new User(data.responsible) : null,
      property: data.property ? new Estate({
        ...data.property,
        address: data.property.address ? new Address(data.property.address) : null,
        standAddress: data.property.standAddress ? new Address(data.property.standAddress) : null,
      }) : null,
    })
  },

  toEntityList: (dataList) => {
    if (!Array.isArray(dataList)) return []
    return dataList.map((data) => advertisementMapper.toEntity(data))
  },

  /**
   * Converte uma entidade Advertisement para o formato do card de propriedade
   */
  toPropertyCard: (advertisement) => {
    if (!advertisement) return null

    const { city, neighborhood } = advertisement.getFormattedAddress()

    return {
      id: advertisement.id,
      title: city,
      subtitle: neighborhood,
      description: advertisement.property?.description || '',
      category: advertisement.property?.type?.toLowerCase() || 'apartamento',
      differences: advertisement.getFeatures(),
      imageLink: advertisement.getCoverImageUrl(),
    }
  },

  /**
   * Converte uma lista de entidades Advertisement para cards de propriedade
   */
  toPropertyCardList: (advertisements) => {
    if (!Array.isArray(advertisements)) return []
    return advertisements.map((ad) => advertisementMapper.toPropertyCard(ad))
  },
}
