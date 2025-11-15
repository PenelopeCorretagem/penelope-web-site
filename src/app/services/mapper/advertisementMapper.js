import { Advertisement } from '../../model/entities/Advertisement'

export const advertisementMapper = {
  toEntity: (data) => {
    if (!data) return null
    return new Advertisement(data)
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
      description: advertisement.property?.description || advertisement.description,
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
