/**
 * eventTypeApi.js
 * API client para gerenciar event types no cal-service
 */

const BASE_URL = import.meta.env.VITE_CAL_SERVICE_URL || 'http://localhost:8080/api/v1'

/**
 * Lista todos os event types
 * @returns {Promise<Array>} Array de event types
 */
export const listEventTypes = async () => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/event-types`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao listar event types: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ [CAL SERVICE] Erro ao listar event types:', error)
    throw error
  }
}

/**
 * Busca um event type por ID
 * @param {number} id - ID do event type
 * @returns {Promise<object>} Dados do event type
 */
export const getEventTypeById = async (id) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/event-types/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar event type ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao buscar event type ${id}:`, error)
    throw error
  }
}

/**
 * Cria um novo event type
 * @param {object} eventTypeData - Dados do event type
 * @returns {Promise<object>} Event type criado
 */
export const createEventType = async (eventTypeData) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/event-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(eventTypeData),
    })

    if (!response.ok) {
      throw new Error(`Erro ao criar event type: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ [CAL SERVICE] Erro ao criar event type:', error)
    throw error
  }
}

/**
 * Atualiza um event type
 * @param {number} id - ID do event type
 * @param {object} eventTypeData - Dados a atualizar
 * @returns {Promise<object>} Event type atualizado
 */
export const updateEventType = async (id, eventTypeData) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/event-types/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(eventTypeData),
    })

    if (!response.ok) {
      throw new Error(`Erro ao atualizar event type ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao atualizar event type ${id}:`, error)
    throw error
  }
}

/**
 * Delete um event type
 * @param {number} id - ID do event type
 * @returns {Promise<void>}
 */
export const deleteEventType = async (id) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/event-types/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao deletar event type ${id}: ${response.status}`)
    }
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao deletar event type ${id}:`, error)
    throw error
  }
}

/**
 * Toggle visibility de um event type
 * @param {number} id - ID do event type
 * @returns {Promise<object>} Event type atualizado
 */
export const toggleEventTypeVisibility = async (id) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('jwtToken')

  try {
    const response = await fetch(`${BASE_URL}/event-types/${id}/toggle-visibility`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ao toggle visibility do event type ${id}: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`❌ [CAL SERVICE] Erro ao toggle visibility do event type ${id}:`, error)
    throw error
  }
}
