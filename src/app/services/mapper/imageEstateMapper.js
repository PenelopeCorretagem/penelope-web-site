import { ImageEstate } from '../../model/entities/ImageEstate'
import { ImageEstateType } from '../../model/entities/ImageEstateType'

export const imageEstateMapper = {
  /**
   * Converte dados da API para entidade ImageEstate
   */
  toEntity: (data) => {
    if (!data) return null

    // Criar um tipo baseado na string do backend
    let type = null
    if (data.type) {
      if (typeof data.type === 'string') {
        // Mapear string para objeto de tipo
        const typeMap = {
          'Capa': { id: 1, description: 'Capa' },
          'Galeria': { id: 2, description: 'Galeria' },
          'Planta': { id: 3, description: 'Planta' }
        }
        const typeInfo = typeMap[data.type]
        if (typeInfo) {
          type = new ImageEstateType(typeInfo)
        }
      } else {
        type = new ImageEstateType(data.type)
      }
    }

    return new ImageEstate({
      id: data.id,
      url: data.url,
      type: type,
      estate: data.estate, // Referência simples, não mapeia para evitar referência circular
    })
  },

  /**
   * Converte lista de dados da API para lista de entidades ImageEstate
   */
  toEntityList: (dataList) => {
    if (!Array.isArray(dataList)) return []
    return dataList.map((data) => imageEstateMapper.toEntity(data)).filter(Boolean)
  },

  /**
   * Converte entidade ImageEstate para payload de requisição
   */
  toRequestPayload: (imageEstate) => {
    if (!imageEstate) return null

    return {
      url: imageEstate.url,
      typeId: imageEstate.type?.id,
      estateId: imageEstate.estate?.id,
    }
  },
}
