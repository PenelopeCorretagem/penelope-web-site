import axiosInstance from '@api/axios/axiosInstance'

const CAL_SERVICE_BASE_URL = import.meta.env.CAL_SERVICE_URL

export const getSlots = async (eventTypeId, start, end) => {
  const params = new URLSearchParams()
  if (eventTypeId !== undefined && eventTypeId !== null) params.append('eventTypeId', String(eventTypeId))
  if (start) params.append('start', start)
  if (end) params.append('end', end)

  const response = await axiosInstance.get('/appointments/slots', {
    baseURL: CAL_SERVICE_BASE_URL,
    params,
  })
  return response.data
}
