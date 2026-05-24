import { ImageEstateType } from '@dtos/ImageEstateType'

export const imageEstateTypeMapper = {
  toEntity(data) {
    if (!data) return null

    return new ImageEstateType({
      id: data.id,
      description: data.description,
    })
  },

  toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => imageEstateTypeMapper.toEntity(data)).filter(Boolean)
  },

  toRequestPayload(imageEstateType) {
    if (!imageEstateType) return null

    return {
      description: imageEstateType.description,
    }
  },
}
