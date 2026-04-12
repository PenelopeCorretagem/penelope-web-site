/**
 * EventTypeMapper.js
 * Converte dados da API do cal-service para entidades EventType
 */

import { EventType } from '@dtos/EventType'

export class EventTypeMapper {
  /**
   * Converte dados da API para uma instância de EventType
   * @param {object} data - Dados brutos da API
   * @returns {EventType|null}
   */
  static toEntity(data) {
    if (!data) return null
    return EventType.fromApi(data)
  }

  /**
   * Converte uma lista de dados da API para entidades EventType
   * @param {Array} dataList - Array de dados brutos
   * @returns {Array<EventType>}
   */
  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => EventTypeMapper.toEntity(data))
  }

  /**
   * Converte lista paginada de dados da API
   * @param {object} paginatedData - { content: [...], pageable: {...} }
   * @returns {Object} { content: EventType[], pageable: {...} }
   */
  static toPaginatedEntityList(paginatedData) {
    if (!paginatedData) return { content: [], pageable: {} }
    return {
      content: EventTypeMapper.toEntityList(paginatedData.content || []),
      pageable: paginatedData.pageable || {},
    }
  }
}
