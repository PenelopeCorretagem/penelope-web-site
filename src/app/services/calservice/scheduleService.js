import * as scheduleApi from '@api-calservice/scheduleApi'
import { handleScheduleError } from '@responses/calservice/ScheduleResponse'

export const getAllSchedules = async () => {
  try {
    const response = await scheduleApi.getSchedules()
    return Array.isArray(response) ? response : []
  } catch (error) {
    throw handleScheduleError(error, 'Listagem')
  }
}
