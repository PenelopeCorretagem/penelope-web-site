import axiosInstance from '@api/axiosInstance'

const resolveAppointmentsBaseUrl = () => {
  const baseFromEnv = import.meta.env.APPOINTMENTS_API_URL
    || (import.meta.env.API_URL || '').replace(/\/api\/v1\/?$/, '')
    || 'http://localhost:8080'

  const normalizedBase = String(baseFromEnv).replace(/\/$/, '')
  return /\/appointments$/.test(normalizedBase)
    ? normalizedBase
    : `${normalizedBase}/appointments`
}

const APPOINTMENTS_BASE_URL = resolveAppointmentsBaseUrl()
const buildAppointmentsUrl = (suffix = '') => `${APPOINTMENTS_BASE_URL}${suffix}`

/**
 * Camada de API - Responsável apenas por requisições HTTP
 * Retorna dados brutos sem transformação de negócio
 */

/**
 * Lista agendamentos com filtros opcionais.
 * @param {object} filters - Filtros de busca
 * @returns {Promise<object>} Dados brutos (com paginação)
 */
export const getAllAppointments = async (filters = {}) => {
  try {
    const params = {
      clientId: filters.clientId,
      estateAgentId: filters.estateAgentId,
      estateId: filters.estateId,
      status: filters.status,
      startDateTime: filters.startDateTime || filters.startDate,
      endDateTime: filters.endDateTime || filters.endDate,
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

    const response = await axiosInstance.get(buildAppointmentsUrl(), { params })
    return response.data
  } catch (error) {
    console.error('❌ [APPOINTMENTS API] Erro ao listar agendamentos:', error)
    throw error
  }
}

/**
 * Busca um agendamento específico por ID.
 * @param {number} id - O ID do agendamento
 * @returns {Promise<object>} Dados brutos do agendamento
 */
export const getAppointmentById = async (id) => {
  try {
    const response = await axiosInstance.get(buildAppointmentsUrl(`/${id}`))
    return response.data
  } catch (error) {
    console.error(`❌ [APPOINTMENTS API] Erro ao buscar agendamento ${id}:`, error)
    throw error
  }
}

/**
 * Reagenda um agendamento existente.
 * @param {number} id - O ID do agendamento
 * @param {object} rescheduleData - Dados do reagendamento
 * @returns {Promise<object>} Dados brutos do agendamento atualizado
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  try {
    const response = await axiosInstance.patch(buildAppointmentsUrl(`/${id}/reschedule`), rescheduleData)
    return response.data
  } catch (error) {
    console.error(`❌ [APPOINTMENTS API] Erro ao reagendar agendamento ${id}:`, error)
    throw error
  }
}

/**
 * Cancela um agendamento.
 * @param {number} id - O ID do agendamento
 * @param {string} reason - Motivo do cancelamento (opcional)
 * @returns {Promise<object>} Resposta bruta da API
 */
export const cancelAppointment = async (id, reason = null) => {
  try {
    const payload = reason ? { reason } : null
    const response = await axiosInstance.post(buildAppointmentsUrl(`/${id}/cancel`), payload)
    return response.data
  } catch (error) {
    console.error(`❌ [APPOINTMENTS API] Erro ao cancelar agendamento ${id}:`, error)
    throw error
  }
}

/**
 * Cria um novo agendamento.
 * @param {object} appointmentData - Dados do agendamento
 * @returns {Promise<object>} Dados brutos do agendamento criado
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post(buildAppointmentsUrl(), appointmentData)
    return response.data
  } catch (error) {
    console.error('❌ [APPOINTMENTS API] Erro ao criar agendamento:', error)
    throw error
  }
}


/**
 * Finaliza um agendamento.
 * @param {number} id - O ID do agendamento.
 * @returns {Promise<void>}
 */
export const completeAppointment = async (id) => {
  try {
    await axiosInstance.post(buildAppointmentsUrl(`/${id}/conclude`))
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error('Não foi possível concluir o agendamento no estado atual')
    }
    console.error(`❌ [APPOINTMENTS API] Erro ao finalizar agendamento ${id}:`, error)
    throw error
  }
}
