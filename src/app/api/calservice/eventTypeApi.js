/**
 * eventTypeApi.js
 * API client para gerenciar event types no cal-service
 */

import axiosInstance from '@api/axiosInstance'

const CAL_SERVICE_BASE_URL = import.meta.env.CAL_SERVICE_URL

const parsePaginatedEventTypes = (data) => ({
  ...data,
  eventTypes: data?.content || data?.eventTypes || [],
})

/**
 * Lista todos os event types
 * @param {object} filters - Filtros de paginação { page, size }
 * @returns {Promise<Array>} Array de event types
 */
export const listEventTypes = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.page !== undefined) params.append('page', filters.page)
  if (filters.size !== undefined) params.append('size', filters.size)

  const response = await axiosInstance.get('/event-types', {
    baseURL: CAL_SERVICE_BASE_URL,
    params,
  })
  return parsePaginatedEventTypes(response.data)
}

/**
 * Busca um event type por ID
 * @param {number} id - ID do event type
 * @returns {Promise<object>} Dados do event type
 */
export const getEventTypeById = async (id) => {
  const response = await axiosInstance.get(`/event-types/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Cria um novo event type
 * @param {object} eventTypeData - Dados do event type
 * @returns {Promise<object>} Event type criado
 */
export const createEventType = async (eventTypeData) => {
  const response = await axiosInstance.post('/event-types', eventTypeData, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Atualiza um event type
 * @param {number} id - ID do event type
 * @param {object} eventTypeData - Dados a atualizar
 * @returns {Promise<object>} Event type atualizado
 */
export const updateEventType = async (id, eventTypeData) => {
  const response = await axiosInstance.patch(`/event-types/${id}`, eventTypeData, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

/**
 * Delete um event type
 * @param {number} id - ID do event type
 * @returns {Promise<void>}
 */
export const deleteEventType = async (id) => {
  await axiosInstance.delete(`/event-types/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
}

/**
 * Toggle visibility de um event type
 * @param {number} id - ID do event type
 * @returns {Promise<object>} Event type atualizado
 */
export const toggleEventTypeVisibility = async (id) => {
  const response = await axiosInstance.patch(`/event-types/${id}/toggle-visibility`, null, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}
