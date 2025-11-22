import { Advertisement } from '../../model/entities/Advertisement'
import { User } from '../../model/entities/User'
import { Address } from '../../model/entities/Address'
import { Estate } from '../../model/entities/Estate'
import { imageEstateMapper } from './imageEstateMapper'

export const advertisementMapper = {
  toEntity: (data) => {
    if (!data) return null

    // Enhanced image processing to preserve type information
    let processedProperty = null
    if (data.property) {
      // Ensure images maintain their type information
      const processedImages = data.property.images
        ? data.property.images.map((img) => ({
          ...img,
          // Ensure type is preserved as string, not just ID
          type: img.type || 'Galeria',
        }))
        : []

      processedProperty = new Estate({
        ...data.property,
        address: data.property.address ? new Address(data.property.address) : null,
        // Fix: Map addressStand to standAddress
        standAddress: data.property.addressStand ? new Address(data.property.addressStand) : null,
        images: processedImages,
      })
    }

    return new Advertisement({
      id: data.id,
      active: data.active,
      emphasis: data.emphasis,
      createdAt: data.createdAt,
      endDate: data.endDate,
      creator: data.creator ? new User(data.creator) : null,
      responsible: data.responsible ? new User(data.responsible) : null,
      property: processedProperty,
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
    const coverImageUrl = advertisement.getCoverImageUrl()

    console.log('🔄 [ADVERTISEMENT MAPPER] Converting to property card:', {
      id: advertisement.id,
      city,
      neighborhood,
      coverImageUrl,
      propertyType: advertisement.property?.type,
      totalImages: advertisement.property?.images?.length || 0,
    })

    return {
      id: advertisement.id,
      title: city || 'Cidade não informada',
      subtitle: neighborhood || 'Bairro não informado',
      description: advertisement.property?.description || 'Descrição não disponível',
      category: advertisement.property?.type?.toLowerCase() || 'disponivel',
      differences: advertisement.getFeatures(),
      imageLink: coverImageUrl,
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
