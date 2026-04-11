/**
 * appointmentApi.js
 * Serviço para consumir a API de agendamentos (appointments) do cal-service
 */

const BASE_CAL_SERVICE_URL = import.meta.env.VITE_CAL_SERVICE_URL || 'http://localhost:8080'
const BASE_URL = `${BASE_CAL_SERVICE_URL.replace(/\/$/, '')}/appointments`

/**
 * Busca agendamentos com paginação e filtros via cal-service
 * @param {Object} params - Parâmetros de consulta
 * @param {number} params.page - Número da página (default: 0)
 * @param {number} params.size - Tamanho da página (default: 100 para buscar todos)
 * @param {Long} params.clientId - Filtro por ID do cliente (opcional)
 * @param {Long} params.estateAgentId - Filtro por ID do agente (opcional)
 * @param {Long} params.estateId - Filtro por ID do empreendimento (opcional)
 * @param {String} params.status - Filtro por status (opcional)
 * @param {String} params.startDateTime - Data/hora inicial ISO (opcional)
 * @param {String} params.endDateTime - Data/hora final ISO (opcional)
 * @returns {Promise<Object>} Retorna { appointments[], page, size, totalElements, totalPages }
 */
export async function fetchAppointments({
  page = 0,
  size = 100,
  clientId = null,
  estateAgentId = null,
  estateId = null,
  status = null,
  startDateTime = null,
  endDateTime = null,
} = {}) {
  const params = new URLSearchParams()
  
  // Adiciona apenas parâmetros com valores definidos
  if (page !== null) params.append('page', String(page))
  if (size !== null) params.append('size', String(size))
  if (clientId !== null) params.append('clientId', String(clientId))
  if (estateAgentId !== null) params.append('estateAgentId', String(estateAgentId))
  if (estateId !== null) params.append('estateId', String(estateId))
  if (status !== null) params.append('status', status)
  if (startDateTime !== null) params.append('startDateTime', startDateTime)
  if (endDateTime !== null) params.append('endDateTime', endDateTime)

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

  return response.json()
}

/**
 * Transforma os dados da API (AppointmentCal DTO) em entidades reutilizáveis
 * @param {Array} appointments - Array de appointments retornado pela API cal-service
 * @returns {Array} Array de AppointmentCal com dados preservados integralmente
 */
export function mapAppointmentsToModel(appointments) {
  // Não faz transformação — apenas retorna os dados brutos do cal-service
  // Os dados já vêm estruturados e com todos os campos necessários
  return appointments.map(appt => ({
    id: appt.id,
    bookingUid: appt.bookingUid,
    eventTypeId: appt.eventTypeId,
    clientId: appt.clientId,
    estateAgentId: appt.estateAgentId,
    estateId: appt.estateId,
    durationMinutes: appt.durationMinutes || 60,
    status: appt.status || 'PENDING',
    startDateTime: typeof appt.startDateTime === 'string' ? new Date(appt.startDateTime) : appt.startDateTime,
    endDateTime: typeof appt.endDateTime === 'string' ? new Date(appt.endDateTime) : appt.endDateTime,
    title: appt.title || 'Agendamento',
    createdAt: appt.createdAt ? new Date(appt.createdAt) : null,
    updatedAt: appt.updatedAt ? new Date(appt.updatedAt) : null,
  }))
}
