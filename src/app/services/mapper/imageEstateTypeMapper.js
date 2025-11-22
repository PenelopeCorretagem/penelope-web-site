import { ImageEstateType } from '../../model/entities/ImageEstateType'
import { imageEstateMapper } from './imageEstateMapper'

export const imageEstateTypeMapper = {
  /**
   * Converte dados da API para entidade ImageEstateType
   */
  toEntity: (data) => {
    if (!data) return null

    return new ImageEstateType({
      id: data.id,
      description: data.description,
      images: data.images ? imageEstateMapper.toEntityList(data.images) : [],
    })
  },

  /**
   * Converte lista de dados da API para lista de entidades ImageEstateType
   */
  toEntityList: (dataList) => {
    if (!Array.isArray(dataList)) return []
    return dataList.map((data) => imageEstateTypeMapper.toEntity(data)).filter(Boolean)
  },

  /**
   * Converte entidade ImageEstateType para payload de requisição
   */
  toRequestPayload: (imageEstateType) => {
    if (!imageEstateType) return null

    return {
      description: imageEstateType.description,
    }
  },
}
