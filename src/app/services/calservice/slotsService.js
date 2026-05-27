import * as slotsApi from '@api-calservice/slotsApi'
import { handleSlotError } from '@responses/calservice/SlotResponse'

export const getAvailableSlots = async (eventTypeId, start, end) => {
  if (!eventTypeId) throw new Error('O eventTypeId é obrigatório para buscar horários disponíveis.')
  if (!start) throw new Error('A data inicial é obrigatória para buscar horários disponíveis.')
  if (!end) throw new Error('A data final é obrigatória para buscar horários disponíveis.')

  try {
    const response = await slotsApi.getSlots(eventTypeId, start, end)
    return response
  } catch (error) {
    throw handleSlotError(error, 'Consulta de horários')
  }
}
