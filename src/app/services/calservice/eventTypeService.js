/**
 * eventTypeService.js
 * Serviço de negócio para gerenciar event types
 */

import * as eventTypeApi from '@api-calservice/eventTypeApi'
import { EventTypeMapper } from '@mappers/EventTypeMapper'

/**
 * Lista todos os event types
 * @param {object} filters - Filtros de paginação { page, size }
 * @returns {Promise<EventType[]>} Array de event types
 */
export const getAllEventTypes = async (filters = {}) => {
  const response = await eventTypeApi.listEventTypes(filters)
  return EventTypeMapper.toEntityList(response.content || response.eventTypes || response)
}

/**
 * Busca um event type por ID
 * @param {number} id - ID do event type
 * @returns {Promise<EventType>} Entidade EventType
 */
export const getEventTypeById = async (id) => {
  const response = await eventTypeApi.getEventTypeById(id)
  return EventTypeMapper.toEntity(response)
}

/**
 * Cria um novo event type
 * @param {object} eventTypeData - Dados do event type
 * @returns {Promise<EventType>} Event type criado
 */
export const createEventType = async (eventTypeData) => {
  const response = await eventTypeApi.createEventType(eventTypeData)
  return EventTypeMapper.toEntity(response)
}

/**
 * Atualiza um event type
 * @param {number} id - ID do event type
 * @param {object} updateData - Dados a atualizar
 * @returns {Promise<EventType>} Event type atualizado
 */
export const updateEventType = async (id, updateData) => {
  const response = await eventTypeApi.updateEventType(id, updateData)
  return EventTypeMapper.toEntity(response)
}

/**
 * Deleta um event type
 * @param {number} id - ID do event type
 * @returns {Promise<void>}
 */
export const deleteEventType = async (id) => {
  return await eventTypeApi.deleteEventType(id)
}

/**
 * Toggle visibility de um event type
 * @param {number} id - ID do event type
 * @returns {Promise<EventType>} Event type com visibility atualizada
 */
export const toggleEventTypeVisibility = async (id) => {
  const response = await eventTypeApi.toggleEventTypeVisibility(id)
  return EventTypeMapper.toEntity(response)
}
