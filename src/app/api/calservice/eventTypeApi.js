import axiosInstance from '@api/axios/axiosInstance'

const CAL_SERVICE_BASE_URL = import.meta.env.CAL_SERVICE_URL

export const listEventTypes = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.page !== undefined) params.append('page', filters.page)
  if (filters.size !== undefined) params.append('size', filters.size)

  const response = await axiosInstance.get('/event-types', {
    baseURL: CAL_SERVICE_BASE_URL,
    params,
  })
  return response.data
}

export const getEventTypeById = async (id) => {
  const response = await axiosInstance.get(`/event-types/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const createEventType = async (eventTypeData) => {
  const response = await axiosInstance.post('/event-types', eventTypeData, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const updateEventType = async (id, eventTypeData) => {
  const response = await axiosInstance.patch(`/event-types/${id}`, eventTypeData, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const deleteEventType = async (id) => {
  await axiosInstance.delete(`/event-types/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
}

export const toggleEventTypeVisibility = async (id) => {
  const response = await axiosInstance.patch(`/event-types/${id}/toggle-visibility`, null, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}
