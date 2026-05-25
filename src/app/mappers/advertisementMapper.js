import { IMAGE_TYPE_BY_DESCRIPTION } from '@constant/imageTypes'
import { getEstateTypeByFriendlyName, getEstateTypeByKey } from '@constant/estateTypes'
import { Advertisement } from '@dtos/Advertisement'
import { User } from '@dtos/User'
import { Address } from '@dtos/Address'
import { Estate } from '@dtos/Estate'
import { Amenity } from '@dtos/Amenity'
import { ImageEstate } from '@dtos/ImageEstate'
import { ImageEstateType } from '@dtos/ImageEstateType'

/**

* AdvertisementMapper
* ---
* Classe responsável por mapear dados da API para entidades do sistema
* e entidades do sistema para dados da API.
  */
export class AdvertisementMapper {
  /**

  * Converte dados da API para uma instância de Advertisement
  * @param {Object} data Dados brutos da API
  * @returns {Advertisement|null}
    */
  static toEntity(data) {
    if (!data) return null

    const mapImageTypeToEntity = (imageType) => {
      if (!imageType) return null

      if (typeof imageType === 'object') {
        return imageType
      }

      if (typeof imageType !== 'string') {
        return null
      }

      const normalizedType = imageType.trim().toLowerCase()
      const normalizedMap = {
        capa: 'Capa',
        cover: 'Capa',
        galeria: 'Galeria',
        gallery: 'Galeria',
        planta: 'Planta',
        floor_plan: 'Planta',
        floorplan: 'Planta',
        video: 'Video',
        vídeo: 'Video',
        video_url: 'Video',
      }

      const mappedDescription = normalizedMap[normalizedType]
      if (!mappedDescription) return null

      return IMAGE_TYPE_BY_DESCRIPTION[mappedDescription] || null
    }

    const mapAddressToEntity = (addressData) => {
      if (!addressData) return null

      return new Address({
        id: addressData.id,
        street: addressData.street,
        number: addressData.number,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        uf: addressData.uf,
        region: addressData.region,
        zipCode: addressData.zipCode ?? addressData.cep,
        complement: addressData.complement || null,
      })
    }

    const mapAmenityToEntity = (AmenityData) => {
      if (!AmenityData) return null

      if (typeof AmenityData === 'number') {
        return new Amenity({
          id: AmenityData,
          description: '',
          icon: '',
        })
      }

      return new Amenity({
        id: AmenityData.id,
        description: AmenityData.description,
        icon: AmenityData.icon,
      })
    }

    const amenitiesSource = data.estate?.amenities ?? data.estate?.amenitiesIds ?? []

    const estateTypeValue = data.estate?.type
    const estateType = getEstateTypeByFriendlyName(estateTypeValue)
      || getEstateTypeByKey(String(estateTypeValue || '').toUpperCase())

    const estate = data.estate
      ? new Estate({
        id: data.estate.id,
        title: data.estate.title,
        description: data.estate.description,
        area: data.estate.area,
        numberOfRooms: data.estate.numberOfRooms,
        type: estateType,
        images: data.estate.images
          ? data.estate.images.map(
            img => {
              const mappedImageType = mapImageTypeToEntity(img.type)
              if (!mappedImageType) return null

              return new ImageEstate({
                id: img.id,
                url: img.url,
                type: new ImageEstateType(mappedImageType),
              })
            }
          ).filter(Boolean)
          : [],
        address: mapAddressToEntity(data.estate.address),
        amenities: amenitiesSource
          .map(mapAmenityToEntity)
          .filter(Boolean),
      })
      : null

    const responsible = data.responsible
      ? new User({
        id: data.responsible.id,
        name: data.responsible.name,
        email: data.responsible.email,
        phone: data.responsible.cellphone || null,
        creci: null,
        cpf: null,
        dateBirth: null,
        monthlyIncome: null,
        accessLevel: null,
        active: null,
        dateCreation: null,
      })
      : null

    const creator = data.creator
      ? new User({
        id: data.creator.id,
        name: data.creator.name,
        email: data.creator.email,
        phone: data.creator.cellphone || null,
        creci: null,
        cpf: null,
        dateBirth: null,
        monthlyIncome: null,
        accessLevel: null,
        active: null,
        dateCreation: null,
      })
      : null

    return new Advertisement({
      id: data.id,
      active: data.active,
      featured: data.featured ?? data.emphasis ?? false,
      createdAt: data.createdAt,
      endDate: data.endDate,
      creator,
      responsible,
      estate,
      eventTypeId: data.eventTypeId
        ? {
          id: data.eventTypeId.id,
          title: data.eventTypeId.title,
        }
        : null,
    })
  }

  /**

* Converte uma lista de dados da API para entidades Advertisement
* @param {Array} dataList Lista de dados da API
* @returns {Array<Advertisement>}
  */
  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => AdvertisementMapper.toEntity(data))
  }

  /**

* Converte uma instância de Advertisement para o formato da API
* @param {Advertisement} advertisement
* @returns {Object|null}
  */
  static toApiData(advertisement) {
    if (!advertisement) return null

    const estate = advertisement.estate
    const estateAddress = estate?.address

    return {
      active: advertisement.active,
      featured: advertisement.featured,
      creatorId: advertisement.creator?.id || null,
      responsibleId: advertisement.responsible?.id || null,
      estate: estate
        ? {
          title: estate.title,
          description: estate.description,
          area: estate.area ?? 0,
          numberOfRooms: estate.numberOfRooms ?? 0,
          type: estate.type?.key || estate.type?.description || estate.type || null,
          address: estateAddress
            ? {
              id: estateAddress.id ?? null,
              street: estateAddress.street,
              number: estateAddress.number,
              neighborhood: estateAddress.neighborhood,
              city: estateAddress.city,
              uf: estateAddress.uf,
              zipCode: estateAddress.zipCode,
              complement: estateAddress.complement ?? '',
              region: estateAddress.region,
            }
            : null,
          amenitiesIds: Array.isArray(estate.amenities)
            ? estate.amenities
              .map(item => (typeof item === 'number' ? item : item?.id))
              .filter(id => id !== undefined && id !== null)
            : [],
          images: Array.isArray(estate.images)
            ? estate.images
              .map(img => ({
                url: img.url,
                type: img.type?.description || img.type || '',
              }))
              .filter(img => img.url)
            : [],
        }
        : null,
    }
  }
}
