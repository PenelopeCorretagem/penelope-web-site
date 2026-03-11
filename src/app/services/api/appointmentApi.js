import axiosInstance from './axiosInstance'
import { AppointmentMapper } from '@mapper/AppointmentMapper'

/**
 * Lista agendamentos com filtros opcionais e paginação.
 * @param {object} filters - Filtros de busca
 * @returns {Promise<{content: Appointment[], pageable: object}>} Lista paginada de entidades Appointment.
 */
export const getAllAppointments = async (filters = {}) => {
  try {
    const params = {
      clientId: filters.clientId,
      estateAgentId: filters.estateAgentId,
      estateId: filters.estateId,
      status: filters.status,
      startDate: filters.startDate,
      endDate: filters.endDate,
      clientEmail: filters.clientEmail,
      agentEmail: filters.agentEmail,
      estateTitle: filters.estateTitle,
      hasCalBooking: filters.hasCalBooking,
      onlyActive: filters.onlyActive,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      page: filters.page,
      size: filters.size,
    }

    const response = await axiosInstance.get('/appointments', { params })
    return AppointmentMapper.toPaginatedEntityList(response.data)
  } catch (error) {
    console.error('❌ [APPOINTMENTS API] Erro ao listar agendamentos:', error)
    throw error
  }
}

/**
 * Busca um agendamento específico por ID.
 * @param {number} id - O ID do agendamento.
 * @returns {Promise<Appointment>} Entidade Appointment.
 */
export const getAppointmentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/appointments/${id}`)
    return AppointmentMapper.toEntity(response.data)
  } catch (error) {
    console.error(`❌ [APPOINTMENTS API] Erro ao buscar agendamento ${id}:`, error)
    throw error
  }
}

/**
 * Reagenda um agendamento existente.
 * @param {number} id - O ID do agendamento.
 * @param {object} rescheduleData - Dados do reagendamento { startDateTime, endDateTime, durationMinutes }
 * @returns {Promise<Appointment>} Entidade Appointment atualizada.
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  try {
    const response = await axiosInstance.patch(`/appointments/${id}/reschedule`, rescheduleData)
    return AppointmentMapper.toEntity(response.data)
  } catch (error) {
    console.error(`❌ [APPOINTMENTS API] Erro ao reagendar agendamento ${id}:`, error)
    throw error
  }
}

/**
 * Cancela um agendamento via Cal.com.
 * @param {number} id - O ID do agendamento.
 * @param {string} reason - Motivo do cancelamento (opcional).
 * @returns {Promise<object>} Resposta da API.
 */
export const cancelAppointment = async (id, reason = null) => {
  try {
    const params = reason ? { reason } : {}
    const response = await axiosInstance.post(`/appointments/${id}/cancel`, null, { params })
    return response.data
  } catch (error) {
    console.error(`❌ [APPOINTMENTS API] Erro ao cancelar agendamento ${id}:`, error)
    throw error
  }
}

/**
 * Confirmação via Cal.com (retorna 405 - Não permitido).
 * @param {number} id - O ID do agendamento.
 * @returns {Promise<void>} Lança erro 405.
 */
export const confirmAppointment = async (id) => {
  try {
    await axiosInstance.post(`/appointments/${id}/confirm`)
  } catch (error) {
    if (error.response?.status === 405) {
      throw new Error('Confirmação deve ser feita via Cal.com')
    }
    console.error(`❌ [APPOINTMENTS API] Erro ao confirmar agendamento ${id}:`, error)
    throw error
  }
}

/**
 * Finalização via Cal.com (retorna 405 - Não permitido).
 * @param {number} id - O ID do agendamento.
 * @returns {Promise<void>} Lança erro 405.
 */
export const completeAppointment = async (id) => {
  try {
    await axiosInstance.post(`/appointments/${id}/complete`)
  } catch (error) {
    if (error.response?.status === 405) {
      throw new Error('Finalização deve ser feita via Cal.com')
    }
    console.error(`❌ [APPOINTMENTS API] Erro ao finalizar agendamento ${id}:`, error)
    throw error
  }
}
