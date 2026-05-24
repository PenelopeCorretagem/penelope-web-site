import { ImageEstate } from '@dtos/ImageEstate'
import { ImageEstateType } from '@dtos/ImageEstateType'

export const imageEstateMapper = {
  toEntity(data) {
    if (!data) return null

    // O setter de ImageEstate.type já normaliza string, number ou objeto —
    // não precisa de typeMap aqui
    return new ImageEstate({
      id: data.id,
      url: data.url,
      type: data.type ?? null,
    })
  },

  toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => imageEstateMapper.toEntity(data)).filter(Boolean)
  },

  toRequestPayload(imageEstate) {
    if (!imageEstate) return null

    return {
      url: imageEstate.url,
      typeId: imageEstate.getTypeId(),
    }
  },
}
