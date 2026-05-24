import * as eventTypeApi from '@api-calservice/eventTypeApi'
import { EventTypeMapper } from '@mappers/EventTypeMapper'
import { EventType } from '@dtos/EventType'
import { handleEventTypeError } from '@responses/calservice/EventTypeResponse'

export const getAllEventTypes = async (filters = {}) => {
  try {
    const response = await eventTypeApi.listEventTypes(filters)
    const rawList = response?.content || response?.eventTypes || response || []
    return EventTypeMapper.toEntityList(rawList)
  } catch (error) {
    throw handleEventTypeError(error, 'Listagem')
  }
}

export const getEventTypeById = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para buscar um tipo de evento')

  try {
    const response = await eventTypeApi.getEventTypeById(id)
    return EventTypeMapper.toEntity(response)
  } catch (error) {
    throw handleEventTypeError(error, 'Busca')
  }
}

export const createEventType = async (eventTypeData) => {
  if (!eventTypeData)
    throw new Error('Os dados do tipo de evento são obrigatórios')
  if (!eventTypeData.title)
    throw new Error('O título é obrigatório')
  if (!eventTypeData.lengthInMinutes)
    throw new Error('A duração é obrigatória')

  try {
    const payload = eventTypeData instanceof EventType
      ? eventTypeData.toRequestPayload()
      : eventTypeData

    const response = await eventTypeApi.createEventType(payload)
    return EventTypeMapper.toEntity(response)
  } catch (error) {
    throw handleEventTypeError(error, 'Criação')
  }
}

export const updateEventType = async (id, updateData) => {
  if (!id)
    throw new Error('O ID é obrigatório para atualizar um tipo de evento')
  if (!updateData)
    throw new Error('Os dados de atualização são obrigatórios')

  try {
    const payload = updateData instanceof EventType
      ? updateData.toRequestPayload()
      : updateData

    const response = await eventTypeApi.updateEventType(id, payload)
    return EventTypeMapper.toEntity(response)
  } catch (error) {
    throw handleEventTypeError(error, 'Atualização')
  }
}

export const deleteEventType = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para deletar um tipo de evento')

  try {
    await eventTypeApi.deleteEventType(id)
  } catch (error) {
    throw handleEventTypeError(error, 'Exclusão')
  }
}

export const toggleEventTypeVisibility = async (id) => {
  if (!id)
    throw new Error('O ID é obrigatório para alternar a visibilidade')

  try {
    const response = await eventTypeApi.toggleEventTypeVisibility(id)
    return EventTypeMapper.toEntity(response)
  } catch (error) {
    throw handleEventTypeError(error, 'Alternar Visibilidade')
  }
}
