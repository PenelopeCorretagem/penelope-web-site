import { Amenity } from '@dtos/Amenity'

/**
 * AmenityMapper - Converte dados da API para entidades e vice-versa
 *
 * RESPONSABILIDADES:
 * - Converter DTO da API → Entidade Amenity
 * - Converter Entidade Amenity → Payload de request
 * - Manter transformação de dados centralizada
 */
export class AmenityMapper {
  /**
   * Converte DTO da API para Entidade Amenity
   * @param {Object} data - Dados da API
   * @returns {Amenity}
   */
  static toEntity(data) {
    if (!data) return null

    return new Amenity({
      id: data.id,
      description: data.description,
      icon: data.icon,
    })
  }

  /**
   * Converte lista de DTOs para lista de Entidades
   * @param {Array} dataList - Lista de dados da API
   * @returns {Array<Amenity>}
   */
  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => this.toEntity(data))
  }

  /**
   * Converte resposta paginada da API para entidades com metadados de paginação
   * @param {Object} paginatedData - Dados paginados da API
   * @returns {Object} { content: Amenity[], pageable: {...} }
   */
  static toPaginatedEntityList(paginatedData) {
    if (!paginatedData) return { content: [], pageable: null }

    const content = paginatedData.content || paginatedData.amenities || []
    const pageable = paginatedData.pageable || {
      pageNumber: paginatedData.page ?? 0,
      pageSize: paginatedData.pageSize ?? 10,
      totalElements: paginatedData.totalElements ?? 0,
      totalPages: paginatedData.totalPages ?? 0,
    }

    return {
      content: AmenityMapper.toEntityList(content),
      pageable,
    }
  }

  /**
   * Converte Entidade Amenity para payload de request
   * @param {Amenity} entity - Entidade Amenity
   * @returns {Object}
   */
  static toRequest(entity) {
    if (!entity) return null
    return entity.toRequestPayload()
  }
}
