import { Appointment } from '@dtos/Appointment'

export class AppointmentMapper {
  /**
   * Converte dados da API para uma instância de Appointment
   * @param {Object} data Dados brutos da API
   * @returns {Appointment|null}
   */
  static toEntity(data) {
    if (!data) return null

    return Appointment.fromApi(data)
  }

  /**
   * Converte uma lista de dados da API para entidades Appointment
   * @param {Array} dataList Lista de dados da API
   * @returns {Array<Appointment>}
   */
  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => AppointmentMapper.toEntity(data))
  }

  /**
   * Converte dados paginados da API para formato estruturado
   * @param {Object} paginatedData Dados paginados da API
   * @returns {Object} { content: Appointment[], pageable: {...} }
   */
  static toPaginatedEntityList(paginatedData) {
    if (!paginatedData) return { content: [], pageable: null }

    const content = paginatedData.content || paginatedData.appointments || []
    const pageable = paginatedData.pageable || {
      pageNumber: paginatedData.page ?? 0,
      pageSize: paginatedData.size ?? 0,
      totalElements: paginatedData.totalElements ?? 0,
      totalPages: paginatedData.totalPages ?? 0,
    }

    return {
      content: AppointmentMapper.toEntityList(content),
      pageable,
    }
  }
}
