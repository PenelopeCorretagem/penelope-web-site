/**
 * appointmentApi.js
 * Serviço para consumir a API de agendamentos (appointments) do cal-service
 */

// IMPORTANTE: Usar CAL_SERVICE_URL, não a API_URL (que aponta para penelope-api-rest)
// Cal-service não usa /api/v1, acessa direto em /appointments
const BASE_URL = `${import.meta.env.VITE_CAL_SERVICE_URL || 'http://localhost:8090'}/appointments`

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

  // Compatibilidade com consumidores legados que esperam o formato content/pageable
  return {
    ...responseData,
    appointments,
    content: appointments,
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
  // Não faz transformação — apenas retorna os dados brutos do cal-service
  // Os dados já vêm estruturados e com todos os campos necessários
  return appointments.map(appt => ({
    id: appt.id,
    date: appt.startDateTime, // ISO string
    time: new Date(appt.startDateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    title: appt.estate?.title || (appt.estateId ? `Imóvel #${appt.estateId}` : 'Agendamento'),
    client: appt.client?.name || (appt.clientId ? `Cliente #${appt.clientId}` : 'Cliente não informado'),
  }))
}
