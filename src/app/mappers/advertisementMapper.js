import { IMAGE_TYPE_BY_DESCRIPTION } from '@constant/imageTypes'
import { getEstateTypeByKey } from '@constant/estateTypes'
import { Advertisement } from '@dtos/Advertisement'
import { User } from '@dtos/User'
import { Address } from '@dtos/Address'
import { Estate } from '@dtos/Estate'
import { Feature } from '@dtos/Feature'
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

    const mapFeatureToEntity = (featureData) => {
      if (!featureData) return null

      if (typeof featureData === 'number') {
        return new Feature({
          id: featureData,
          description: '',
          icon: '',
        })
      }

      return new Feature({
        id: featureData.id,
        description: featureData.description,
        icon: featureData.icon,
      })
    }

    const amenitiesSource = data.estate?.amenities ?? data.estate?.amenitiesIds ?? []

    const estate = data.estate
      ? new Estate({
        id: data.estate.id,
        title: data.estate.title,
        description: data.estate.description,
        area: data.estate.area,
        numberOfRooms: data.estate.numberOfRooms,
        type: getEstateTypeByKey(data.estate.type),
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
          .map(mapFeatureToEntity)
          .filter(Boolean),
      })
      : null

    const responsible = data.responsible
      ? new User({
        id: data.responsible.id,
        name: data.responsible.name,
        email: null,
        phone: null,
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
        email: null,
        phone: null,
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
      featured: data.featured ?? data.emphasis,
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

    return {
      id: advertisement.id,
      active: advertisement.active,
      featured: advertisement.featured,
      createdAt: advertisement.createdAt,
      endDate: advertisement.endDate,
      creatorId: advertisement.creator?.id || null,
      responsibleId: advertisement.responsible?.id || null,
      estate: advertisement.estate
        ? {
          id: advertisement.estate.id,
          title: advertisement.estate.title,
          description: advertisement.estate.description,
          area: advertisement.estate.area,
          numberOfRooms: advertisement.estate.numberOfRooms,
          type: advertisement.estate.type?.key || null,
          images: advertisement.estate.images
            ? advertisement.estate.images.map(img => ({
              id: img.id,
              url: img.url,
              type: img.type?.description,
            }))
            : [],
          address: advertisement.estate.address
            ? {
              id: advertisement.estate.address.id,
              street: advertisement.estate.address.street,
              number: advertisement.estate.address.number,
              neighborhood: advertisement.estate.address.neighborhood,
              city: advertisement.estate.address.city,
              uf: advertisement.estate.address.uf,
              region: advertisement.estate.address.region,
              // Use 'cep' in the outgoing API payload and include complement if exists
              cep: advertisement.estate.address.zipCode,
              complement: advertisement.estate.address.complement,
            }
            : null,
          amenities: advertisement.estate.amenities
            ? advertisement.estate.amenities.map(diff => ({
              id: diff.id,
              description: diff.description,
            }))
            : [],
        }
        : null,
      // include eventTypeId if present in the entity
      eventTypeId: advertisement.eventTypeId
        ? {
          id: advertisement.eventTypeId.id,
          title: advertisement.eventTypeId.title,
          slug: advertisement.eventTypeId.slug,
        }
        : null,
    }


  }
}
