/**
 * appointmentApi.js
 * API client para gerenciar appointments no cal-service
 */

import axiosInstance from '@api/axiosInstance'

const CAL_SERVICE_BASE_URL = import.meta.env.CAL_SERVICE_URL

const parsePaginatedAppointments = (data) => ({
  ...data,
  appointments: data?.content || data?.appointments || [],
})

/**
 * Lista appointments com filtros opcionais
 * @param {object} filters - Filtros: clientId, estateAgentId, estateId, status, startDateTime, endDateTime, pagination
 * @returns {Promise<Object>} Objeto com appointments[], page, size, totalElements, totalPages
 */
export const listAppointments = async (filters = {}) => {
  const userRole = sessionStorage.getItem('userRole')
  const authenticatedUserId = sessionStorage.getItem('userId')

  const normalizedFilters = {
    ...filters,
  }

  if (userRole === 'CLIENTE') {
    if (!authenticatedUserId) {
      throw new Error('Não foi possível identificar o cliente autenticado para listar os agendamentos')
    }
    normalizedFilters.clientId = authenticatedUserId
  }

  const params = new URLSearchParams()
  if (normalizedFilters.clientId) params.append('clientId', normalizedFilters.clientId)
  if (normalizedFilters.estateAgentId) params.append('estateAgentId', normalizedFilters.estateAgentId)
  if (normalizedFilters.estateId) params.append('estateId', normalizedFilters.estateId)
  if (normalizedFilters.status) params.append('status', normalizedFilters.status)
  // Cal-Api usa startDateTime e endDateTime, não dateFrom/dateTo
  if (normalizedFilters.startDateTime) params.append('startDateTime', normalizedFilters.startDateTime)
  if (normalizedFilters.endDateTime) params.append('endDateTime', normalizedFilters.endDateTime)
  if (normalizedFilters.dateFrom) params.append('startDateTime', normalizedFilters.dateFrom) // backward compatibility
  if (normalizedFilters.dateTo) params.append('endDateTime', normalizedFilters.dateTo) // backward compatibility
  if (normalizedFilters.page !== undefined) params.append('page', normalizedFilters.page)
  if (normalizedFilters.size !== undefined) params.append('size', normalizedFilters.size)

  const response = await axiosInstance.get('/appointments', {
    baseURL: CAL_SERVICE_BASE_URL,
    params,
  })
  return parsePaginatedAppointments(response.data)
}

/**
 * Busca um appointment específico por ID
 * @param {number} id - ID do appointment
 * @returns {Promise<object>} Dados do appointment
 */
export const getAppointmentById = async (id) => {
  const response = await axiosInstance.get(`/appointments/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Cria um novo appointment
 * @param {object} appointmentData - Dados do appointment { eventTypeId, clientId, estateAgentId, startDateTime, attendeeName, attendeeEmail, notes }
 * @returns {Promise<object>} Appointment criado com bookingUid
 */
export const createAppointment = async (appointmentData) => {
  const response = await axiosInstance.post('/appointments', appointmentData, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Reagenda um appointment
 * @param {number} id - ID do appointment
 * @param {object} rescheduleData - { startDateTime, reason }
 * @returns {Promise<object>} Appointment atualizado
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  const response = await axiosInstance.patch(`/appointments/${id}/reschedule`, rescheduleData, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Confirma um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<object>} Appointment atualizado com status CONFIRMED
 */
export const confirmAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/confirm`, null, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Marca um appointment como concluído
 * @param {number} id - ID do appointment
 * @returns {Promise<object>} Appointment atualizado com status CONCLUDED
 */
export const concludeAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/conclude`, null, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Cancela um appointment
 * @param {number} id - ID do appointment
 * @param {string} reason - Motivo da cancelamento (opcional)
 * @returns {Promise<object>} Appointment cancelado
 */
export const cancelAppointment = async (id, reason = null) => {
  const payload = reason ? { reason } : null
  const response = await axiosInstance.post(`/appointments/${id}/cancel`, payload, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Deleta um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (id) => {
  const userRole = sessionStorage.getItem('userRole')
  if (userRole !== 'ADMINISTRADOR') {
    throw new Error('Apenas usuários ADMINISTRADOR podem excluir agendamentos')
  }

  await axiosInstance.delete(`/appointments/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
}

/**
 * Transforma os dados da API para o formato esperado pelo AppointmentModel
 * @param {Array} appointments - Array de appointments retornado pela API
 * @returns {Array} Array no formato { id, date, time, title, client }
 */
export function mapAppointmentsToModel(appointments) {
  const appointmentsList = Array.isArray(appointments)
    ? appointments
    : appointments?.appointments || appointments?.content || []

  return appointmentsList.map(appt => ({
    id: appt.id,
    date: appt.startDateTime, // ISO string
    time: new Date(appt.startDateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    title: appt.estate?.title || (appt.estateId ? `Imóvel #${appt.estateId}` : 'Agendamento'),
    client: appt.client?.name || (appt.clientId ? `Cliente #${appt.clientId}` : 'Cliente não informado'),
  }))
}
