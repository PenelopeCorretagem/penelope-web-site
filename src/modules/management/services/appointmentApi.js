/**
 * appointmentApi.js
 * Serviço para consumir a API de agendamentos (appointments)
 */

const BASE_URL = 'http://localhost:8081/api/v1/appointments'

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
  sortBy = 'startDateTime',
  sortDir = 'asc',
} = {}) {
  const params = new URLSearchParams({
    onlyActive: String(onlyActive),
    page: String(page),
    size: String(size),
    sortBy,
    sortDir,
  })

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
 * Transforma os dados da API para o formato esperado pelo AppointmentModel
 * @param {Array} appointments - Array de appointments retornado pela API
 * @returns {Array} Array no formato { id, date, time, title, client }
 */
export function mapAppointmentsToModel(appointments) {
  return appointments.map(appt => ({
    id: appt.id,
    date: appt.startDateTime, // ISO string
    time: new Date(appt.startDateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    title: appt.estate?.title || 'Agendamento',
    client: appt.client?.name || 'Cliente não informado',
  }))
}
