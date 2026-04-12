/**
 * AppointmentCalMapper.js
 * Converte dados da API cal-service para entidades AppointmentCal
 */

import { AppointmentCal } from '@dtos/AppointmentCal'

export class AppointmentCalMapper {
  /**
   * Converte dados da API para uma instância de AppointmentCal
   * @param {object} data - Dados brutos da API
   * @returns {AppointmentCal|null}
   */
  static toEntity(data) {
    if (!data) return null
    return AppointmentCal.fromApi(data)
  }

  /**
   * Converte uma lista de dados da API para entidades AppointmentCal
   * @param {Array} dataList - Array de dados brutos
   * @returns {Array<AppointmentCal>}
   */
  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => AppointmentCalMapper.toEntity(data))
  }

  /**
   * Converte lista paginada de dados da API
   * @param {object} paginatedData - { content: [...], pageable: {...} }
   * @returns {Object} { content: AppointmentCal[], pageable: {...} }
   */
  static toPaginatedEntityList(paginatedData) {
    if (!paginatedData) return { content: [], pageable: {} }
    return {
      content: AppointmentCalMapper.toEntityList(paginatedData.content || []),
      pageable: paginatedData.pageable || {},
    }
  }
}
