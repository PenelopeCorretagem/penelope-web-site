import { IMAGE_TYPE_BY_DESCRIPTION } from '@constant/imageTypes'
import { getEstateTypeByKey } from '@constant/estateTypes'
import { RealEstateAdvertisement } from '@dtos/RealEstateAdvertisement'
import { User } from '@dtos/User'
import { Address } from '@dtos/Address'
import { Estate } from '@dtos/Estate'
import { Feature } from '@dtos/Feature'
import { ImageEstate } from '@dtos/ImageEstate'
import { ImageEstateType } from '@dtos/ImageEstateType'

/**

* RealEstateAdvertisementMapper
* ---
* Classe responsável por mapear dados da API para entidades do sistema
* e entidades do sistema para dados da API.
  */
export class RealEstateAdvertisementMapper {
  /**

  * Converte dados da API para uma instância de RealEstateAdvertisement
  * @param {Object} data Dados brutos da API
  * @returns {RealEstateAdvertisement|null}
    */
  static toEntity(data) {
    if (!data) return null

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
            img =>
              new ImageEstate({
                id: img.id,
                url: img.url,
                type: new ImageEstateType(
                  IMAGE_TYPE_BY_DESCRIPTION[img.type]
                ),
              })
          )
          : [],
        address: data.estate.address
          ? new Address({
            id: data.estate.address.id,
            street: data.estate.address.street,
            number: data.estate.address.number,
            neighborhood: data.estate.address.neighborhood,
            city: data.estate.address.city,
            uf: data.estate.address.uf,
            region: data.estate.address.region,
            zipCode: data.estate.address.zipCode,
            complement: data.estate.address.complement || null,
          })
          : null,
        standAddress: data.estate.addressStand
          ? new Address({
            id: data.estate.addressStand.id,
            street: data.estate.addressStand.street,
            number: data.estate.addressStand.number,
            neighborhood: data.estate.addressStand.neighborhood,
            city: data.estate.addressStand.city,
            uf: data.estate.addressStand.uf,
            region: data.estate.addressStand.region,
            zipCode: data.estate.addressStand.zipCode,
            complement: data.estate.addressStand.complement || null,
          })
          : null,
        features: data.estate.amenitiesIds
          ? data.estate.amenitiesIds.map(
            feature =>
              new Feature({
                id: feature.id,
                description: feature.description,
                icon: feature.icon,
              })
          )
          : [],
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

    return new RealEstateAdvertisement({
      id: data.id,
      active: data.active,
      featured: data.featured,
      createdAt: data.createdAt,
      endDate: data.endDate,
      creator,
      responsible,
      estate,
      eventTypeId: data.eventTypeId
        ? {
          id: data.eventTypeId.id,
          title: data.eventTypeId.title,
          slug: data.eventTypeId.slug,
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
    return dataList.map(data => RealEstateAdvertisementMapper.toEntity(data))
  }

  /**

* Converte uma instância de RealEstateAdvertisement para o formato da API
* @param {RealEstateAdvertisement} advertisement
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
          addressStand: advertisement.estate.standAddress
            ? {
              id: advertisement.estate.standAddress.id,
              street: advertisement.estate.standAddress.street,
              number: advertisement.estate.standAddress.number,
              neighborhood: advertisement.estate.standAddress.neighborhood,
              city: advertisement.estate.standAddress.city,
              uf: advertisement.estate.standAddress.uf,
              region: advertisement.estate.standAddress.region,
              cep: advertisement.estate.standAddress.zipCode,
              complement: advertisement.estate.standAddress.complement,
            }
            : null,
          amenities: advertisement.estate.features
            ? advertisement.estate.features.map(diff => ({
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
