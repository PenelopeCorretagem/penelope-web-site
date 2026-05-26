/**
 * advertisementApi.js
 * Camada HTTP pura. Sem tratamento de erro de negócio. Sem transformação.
 */
import axiosInstance from '@api/axios/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

export const getAllAdvertisements = async (filters = {}) => {
  const params = {
    city: filters.city,
    region: filters.region,
    type: filters.type,
    numberOfRooms: filters.numberOfRooms,
    active: filters.active,
    area: filters.area,
    title: filters.title,
    createdAt: filters.createdAt,
    featured: filters.featured,
  }

  const response = await axiosInstance.get('/advertisements', {
    params,
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const getAdvertisementById = async (id) => {
  const response = await axiosInstance.get(`/advertisements/${id}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const createAdvertisement = async (advertisementRequest) => {
  const response = await axiosInstance.post('/advertisements', advertisementRequest, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const updateAdvertisement = async (id, advertisementData) => {
  const response = await axiosInstance.put(`/advertisements/${id}`, advertisementData, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const updateAdvertisementStatus = async (id, active) => {
  const response = await axiosInstance.patch(`/advertisements/${id}/status`, { active }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const deleteAdvertisement = async (id) => {
  await axiosInstance.delete(`/advertisements/${id}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
}
