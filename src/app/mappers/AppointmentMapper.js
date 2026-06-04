/**
 * AppointmentMapper.js
 * Responsável por converter dados brutos da API em instâncias de Appointment.
 * É o único lugar que conhece o contrato da API.
 *
 * O novo contrato do backend retorna dados já enriquecidos:
 * - client: { id, name, email }
 * - estateAgent: { id, name, creci }
 * - estate: { id, title, type: { key, friendlyName } }
 * - eventType: { id, title }
 */
import { Appointment } from '@dtos/Appointment'

export class AppointmentMapper {

  static toEntity(apiData) {
    if (!apiData) return null

    // Converte strings ISO 8601 em Date objects para uso interno
    const parseDateTime = (dateString) => {
      if (!dateString) return null
      if (dateString instanceof Date) return dateString
      return new Date(dateString)
    }

    return new Appointment({
      id: apiData.id,
      client: apiData.client ?? null,
      estateAgent: apiData.estateAgent ?? null,
      estate: apiData.estate ?? null,
      eventType: apiData.eventType ?? null,
      eventTypeId: apiData.eventTypeId || (apiData.eventType?.id ?? null),
      durationMinutes: apiData.durationMinutes,
      startDateTime: parseDateTime(apiData.startDateTime),
      endDateTime: parseDateTime(apiData.endDateTime),
      status: apiData.status,
      bookingUid: apiData.bookingUid || apiData.calBookingId,
      attendeeName: apiData.attendeeName || apiData.attendee?.name || '',
      attendeeEmail: apiData.attendeeEmail || apiData.attendee?.email || '',
      notes: apiData.notes || '',
      reason: apiData.reason || '',
      createdAt: parseDateTime(apiData.createdAt),
      updatedAt: parseDateTime(apiData.updatedAt),
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
