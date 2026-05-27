import axiosInstance from '@api/axios/axiosInstance'

const CAL_SERVICE_BASE_URL = import.meta.env.CAL_SERVICE_URL

export const getSchedules = async () => {
  const response = await axiosInstance.get('/appointments/schedules', {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}
