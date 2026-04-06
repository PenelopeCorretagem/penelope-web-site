/**
 * appointmentCalApi.js
 * API client para gerenciar appointments no cal-service
 */

const BASE_URL = import.meta.env.VITE_CAL_SERVICE_URL || 'http://localhost:8080/api/v1'

/**
 * Lista appointments com filtros opcionais
 * @param {object} filters - Filtros: clientId, estateAgentId, estateId, status, dateRange, pagination
 * @returns {Promise<Array>} Array de appointments
 */
export const listAppointments = async (filters = {}) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  const params = new URLSearchParams()
  if (filters.clientId) params.append('clientId', filters.clientId)
  if (filters.estateAgentId) params.append('estateAgentId', filters.estateAgentId)
  if (filters.estateId) params.append('estateId', filters.estateId)
  if (filters.status) params.append('status', filters.status)
  if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
  if (filters.dateTo) params.append('dateTo', filters.dateTo)
  if (filters.page !== undefined) params.append('page', filters.page)
  if (filters.size !== undefined) params.append('size', filters.size)

  const queryString = params.toString()
  const url = `${BASE_URL}/appointments${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao listar appointments: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ [CAL SERVICE] Erro ao listar appointments:', error)
    throw error
  }
}

/**
 * Busca um appointment específico por ID
 * @param {number} id - ID do appointment
 * @returns {Promise<object>} Dados do appointment
 */
export const getAppointmentById = async (id) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar appointment ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao buscar appointment ${id}:`, error)
    throw error
  }
}

/**
 * Cria um novo appointment
 * @param {object} appointmentData - Dados do appointment
 * @returns {Promise<object>} Appointment criado com bookingUid
 */
export const createAppointment = async (appointmentData) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(appointmentData),
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar appointment: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ [CAL SERVICE] Erro ao criar appointment:', error)
    throw error
  }
}

/**
 * Reagenda um appointment
 * @param {number} id - ID do appointment
 * @param {object} rescheduleData - { startDateTime, endDateTime }
 * @returns {Promise<object>} Appointment atualizado
 */
export const rescheduleAppointment = async (id, rescheduleData) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/appointments/${id}/reschedule`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(rescheduleData),
    })

    if (!response.ok) {
      throw new Error(`Erro ao reagendar appointment ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao reagendar appointment ${id}:`, error)
    throw error
  }
}

/**
 * Confirma um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<object>} Appointment atualizado com status CONFIRMED
 */
export const confirmAppointment = async (id) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/appointments/${id}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao confirmar appointment ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao confirmar appointment ${id}:`, error)
    throw error
  }
}

/**
 * Marca um appointment como concluído
 * @param {number} id - ID do appointment
 * @returns {Promise<object>} Appointment atualizado com status CONCLUDED
 */
export const concludeAppointment = async (id) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/appointments/${id}/conclude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao concluir appointment ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao concluir appointment ${id}:`, error)
    throw error
  }
}

/**
 * Cancela um appointment
 * @param {number} id - ID do appointment
 * @param {string} reason - Motivo da cancelamento (opcional)
 * @returns {Promise<object>} Appointment cancelado
 */
export const cancelAppointment = async (id, reason = null) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  const params = new URLSearchParams()
  if (reason) params.append('reason', reason)

  const queryString = params.toString()
  const url = `${BASE_URL}/appointments/${id}/cancel${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao cancelar appointment ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao cancelar appointment ${id}:`, error)
    throw error
  }
}

/**
 * Deleta um appointment
 * @param {number} id - ID do appointment
 * @returns {Promise<void>}
 */
export const deleteAppointment = async (id) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao deletar appointment ${id}: ${response.status}`)
    }
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao deletar appointment ${id}:`, error)
    throw error
  }
}
