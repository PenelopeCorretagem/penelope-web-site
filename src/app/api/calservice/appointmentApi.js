/**
 * appointmentApi.js
 * Camada HTTP pura. Sem validações de negócio. Sem mapeamento.
 * Recebe e devolve dados brutos da API.
 */
import axiosInstance from '@api/axios/axiosInstance'

const CAL_SERVICE_BASE_URL = import.meta.env.CAL_SERVICE_URL

export const getAllAppointments = async (params = new URLSearchParams()) => {
  const response = await axiosInstance.get('/appointments', {
    baseURL: CAL_SERVICE_BASE_URL,
    params,
  })
  return response.data
}

export const getAppointmentById = async (id) => {
  const response = await axiosInstance.get(`/appointments/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const createAppointment = async (payload) => {
  const response = await axiosInstance.post('/appointments', payload, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const rescheduleAppointment = async (id, rescheduleData) => {
  const response = await axiosInstance.patch(`/appointments/${id}/reschedule`, rescheduleData, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const confirmAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/confirm`, null, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const concludeAppointment = async (id) => {
  const response = await axiosInstance.post(`/appointments/${id}/conclude`, null, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const cancelAppointment = async (id, reason = null) => {
  const response = await axiosInstance.post(`/appointments/${id}/cancel`, { reason }, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}

export const deleteAppointment = async (id) => {
  const response = await axiosInstance.delete(`/appointments/${id}`, {
    baseURL: CAL_SERVICE_BASE_URL,
  })
  return response.data
}
