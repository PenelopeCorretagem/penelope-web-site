import { IMAGE_TYPE_BY_DESCRIPTION } from '@constant/imageTypes'
import { getEstateTypeByKey } from '@constant/estateTypes'
import { RealEstateAdvertisement } from '@entity/RealEstateAdvertisement'
import { User } from '@entity/User'
import { Address } from '@entity/Address'
import { Estate } from '@entity/Estate'
import { Feature } from '@entity/Feature'
import { ImageEstate } from '@entity/ImageEstate'
import { ImageEstateType } from '@entity/ImageEstateType'

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

    const estate = data.property
      ? new Estate({
        id: data.property.id,
        title: data.property.title,
        description: data.property.description,
        area: data.property.area,
        numberOfRooms: data.property.numberOfRooms,
        type: getEstateTypeByKey(data.property.type),
        images: data.property.images
          ? data.property.images.map(
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
        address: data.property.address
          ? new Address({
            id: data.property.address.id,
            street: data.property.address.street,
            number: data.property.address.number,
            neighborhood: data.property.address.neighborhood,
            city: data.property.address.city,
            uf: data.property.address.uf,
            region: data.property.address.region,
            zipCode: data.property.address.zipCode,
          })
          : null,
        standAddress: data.property.addressStand
          ? new Address({
            id: data.property.addressStand.id,
            street: data.property.addressStand.street,
            number: data.property.addressStand.number,
            neighborhood: data.property.addressStand.neighborhood,
            city: data.property.addressStand.city,
            uf: data.property.addressStand.uf,
            region: data.property.addressStand.region,
            zipCode: data.property.addressStand.zipCode,
          })
          : null,
        features: data.property.amenities
          ? data.property.amenities.map(
            feature =>
              new Feature({
                id: feature.id,
                description: feature.description,
              })
          )
          : [],
      })
      : null

    const responsible = data.responsible
      ? new User({
        id: data.responsible.id,
        name: data.responsible.name,
        email: data.responsible.email,
        phone: data.responsible.phone,
        creci: data.responsible.creci || null,
        cpf: data.responsible.cpf,
        dateBirth: data.responsible.dateBirth,
        monthlyIncome: data.responsible.monthlyIncome,
        accessLevel: data.responsible.accessLevel,
        active: data.responsible.active,
        dateCreation: data.responsible.dateCreation,
      })
      : null

    const creator = data.creator
      ? new User({
        id: data.creator.id,
        name: data.creator.name,
        email: data.creator.email,
        phone: data.creator.phone,
        creci: data.creator.creci,
        cpf: data.creator.cpf,
        dateBirth: data.creator.dateBirth,
        monthlyIncome: data.creator.monthlyIncome,
        accessLevel: data.creator.accessLevel,
        active: data.creator.active,
        dateCreation: data.creator.dateCreation,
      })
      : null

    return new RealEstateAdvertisement({
      id: data.id,
      active: data.active,
      emphasis: data.emphasis,
      createdAt: data.createdAt,
      endDate: data.endDate,
      creator,
      responsible,
      estate,
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
      emphasis: advertisement.emphasis,
      createdAt: advertisement.createdAt,
      endDate: advertisement.endDate,
      creator: advertisement.creator
        ? {
          id: advertisement.creator.id,
          name: advertisement.creator.name,
          email: advertisement.creator.email,
          phone: advertisement.creator.phone,
          creci: advertisement.creator.creci,
          cpf: advertisement.creator.cpf,
          dateBirth: advertisement.creator.dateBirth,
          monthlyIncome: advertisement.creator.monthlyIncome,
          accessLevel: advertisement.creator.accessLevel,
          active: advertisement.creator.active,
          dateCreation: advertisement.creator.dateCreation,
        }
        : null,
      responsible: advertisement.responsible
        ? {
          id: advertisement.responsible.id,
          name: advertisement.responsible.name,
          email: advertisement.responsible.email,
          phone: advertisement.responsible.phone,
          creci: advertisement.responsible.creci,
          cpf: advertisement.responsible.cpf,
          dateBirth: advertisement.responsible.dateBirth,
          monthlyIncome: advertisement.responsible.monthlyIncome,
          accessLevel: advertisement.responsible.accessLevel,
          active: advertisement.responsible.active,
          dateCreation: advertisement.responsible.dateCreation,
        }
        : null,
      property: advertisement.estate
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
              zipCode: advertisement.estate.address.zipCode,
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
              zipCode: advertisement.estate.standAddress.zipCode,
            }
            : null,
          amenities: advertisement.estate.Features
            ? advertisement.estate.Features.map(diff => ({
              id: diff.id,
              description: diff.description,
            }))
            : [],
        }
        : null,
    }


  }
}
