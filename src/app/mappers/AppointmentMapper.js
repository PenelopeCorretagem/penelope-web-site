/**
 * AppointmentMapper.js
 * Responsável por converter dados brutos da API em instâncias de Appointment.
 * É o único lugar que conhece o contrato da API.
 */
import { Appointment } from '@dtos/Appointment'

export class AppointmentMapper {

  static toEntity(apiData) {
    if (!apiData) return null

    return new Appointment({
      id: apiData.id,
      client: apiData.client
        ? { id: apiData.client.id, name: apiData.client.name }
        : apiData.clientId
          ? { id: apiData.clientId, name: `Cliente #${apiData.clientId}` }
          : null,
      estateAgent: apiData.estateAgent
        ? { id: apiData.estateAgent.id, name: apiData.estateAgent.name }
        : apiData.estateAgentId
          ? { id: apiData.estateAgentId, name: `Corretor #${apiData.estateAgentId}` }
          : null,
      estate: apiData.estate
        ? { id: apiData.estate.id, title: apiData.estate.title }
        : apiData.estateId
          ? { id: apiData.estateId, title: `Imóvel #${apiData.estateId}` }
          : null,
      durationMinutes: apiData.durationMinutes,
      startDateTime: apiData.startDateTime,
      endDateTime: apiData.endDateTime,
      status: apiData.status,
      calBookingId: apiData.calBookingId || apiData.bookingUid,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
    })
  }

  static toEntityList(dataList) {
    if (!Array.isArray(dataList)) return []
    return dataList.map(data => AppointmentMapper.toEntity(data))
  }

  static toPaginatedEntityList(paginatedData) {
    if (!paginatedData) return { content: [], pageable: null }

    const content = paginatedData.content || paginatedData.appointments || []
    const pageable = paginatedData.pageable ?? {
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
