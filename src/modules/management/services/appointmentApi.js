/**
 * appointmentApi.js
 * Serviço para consumir a API de agendamentos (appointments)
 */

const resolveAppointmentsBaseUrl = () => {
  const baseFromEnv = import.meta.env.APPOINTMENTS_API_URL
    || (import.meta.env.API_URL || '').replace(/\/api\/v1\/?$/, '')
    || 'http://localhost:8080'

  const normalizedBase = String(baseFromEnv).replace(/\/$/, '')
  return /\/appointments$/.test(normalizedBase)
    ? normalizedBase
    : `${normalizedBase}/appointments`
}

const BASE_URL = resolveAppointmentsBaseUrl()

/**
 * Busca agendamentos com paginação e filtros
 * @param {Object} params - Parâmetros de consulta
 * @param {boolean} params.onlyActive - Retorna apenas agendamentos ativos (default: true)
 * @param {number} params.page - Número da página (default: 0)
 * @param {number} params.size - Tamanho da página (default: 100 para buscar todos)
 * @param {string} params.sortBy - Campo de ordenação (default: 'startDateTime')
 * @param {string} params.sortDir - Direção de ordenação: 'asc' ou 'desc' (default: 'asc')
 * @returns {Promise<Object>} Retorna o objeto completo da API com content, pageable, etc.
 */
export async function fetchAppointments({
  onlyActive = true,
  page = 0,
  size = 100,
  sortBy,
  sortDir,
  status,
  clientId,
  estateAgentId,
  estateId,
  startDateTime,
  endDateTime,
} = {}) {
  const params = new URLSearchParams()

  params.set('page', String(page))
  params.set('size', String(size))

  if (status) params.set('status', status)
  if (clientId) params.set('clientId', String(clientId))
  if (estateAgentId) params.set('estateAgentId', String(estateAgentId))
  if (estateId) params.set('estateId', String(estateId))
  if (startDateTime) params.set('startDateTime', startDateTime)
  if (endDateTime) params.set('endDateTime', endDateTime)

  if (sortBy) params.set('sortBy', sortBy)
  if (sortDir) params.set('sortDir', sortDir)

  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  const response = await fetch(`${BASE_URL}?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  })

  if (!response.ok) {
    throw new Error(`Erro ao buscar agendamentos: ${response.status} ${response.statusText}`)
  }

  const responseData = await response.json()
  const appointments = Array.isArray(responseData?.appointments) ? responseData.appointments : []
  const filteredAppointments = onlyActive
    ? appointments.filter(appt => !['CANCELLED', 'CONCLUDED'].includes(appt?.status))
    : appointments

  // Compatibilidade com consumidores legados que esperam o formato content/pageable
  return {
    ...responseData,
    appointments: filteredAppointments,
    content: filteredAppointments,
    pageable: {
      pageNumber: responseData?.page ?? 0,
      pageSize: responseData?.size ?? size,
      totalElements: responseData?.totalElements ?? 0,
      totalPages: responseData?.totalPages ?? 0,
    },
  }
}

/**
 * Transforma os dados da API para o formato esperado pelo AppointmentModel
 * @param {Array} appointments - Array de appointments retornado pela API
 * @returns {Array} Array no formato { id, date, time, title, client }
 */
export function mapAppointmentsToModel(appointments) {
  return appointments.map(appt => ({
    id: appt.id,
    date: appt.startDateTime, // ISO string
    time: new Date(appt.startDateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    title: appt.estate?.title || (appt.estateId ? `Imóvel #${appt.estateId}` : 'Agendamento'),
    client: appt.client?.name || (appt.clientId ? `Cliente #${appt.clientId}` : 'Cliente não informado'),
  }))
}
