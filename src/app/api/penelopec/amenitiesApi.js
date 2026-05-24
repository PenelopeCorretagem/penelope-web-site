import axiosInstance from '@api/axios/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL
const API_URL = '/amenities'

export const getAllAmenities = async (page = 1, pageSize = 10, name = '', sort = '', initial = '') => {
  const response = await axiosInstance.get(API_URL, {
    baseURL: PENELOPEC_API_BASE_URL,
    params: { page, pageSize, name, sort, initial },
  })
  return response.data
}

export const getAmenityById = async (id) => {
  const response = await axiosInstance.get(`${API_URL}/${id}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const createAmenity = async (payload) => {
  const response = await axiosInstance.post(API_URL, payload, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const updateAmenity = async (id, payload) => {
  const response = await axiosInstance.patch(`${API_URL}/${id}`, payload, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const deleteAmenity = async (id) => {
  await axiosInstance.delete(`${API_URL}/${id}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
}
