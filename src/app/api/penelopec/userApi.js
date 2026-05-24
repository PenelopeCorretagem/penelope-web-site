import axiosInstance from '@api/axios/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const getAllUsers = async (page = 1, pageSize = 10) => {
  const response = await axiosInstance.get('/users', {
    baseURL: PENELOPEC_API_BASE_URL,
    params: { page, pageSize },
  })
  return response.data
}

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/users/${id}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/users/${id}`, userData, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const deleteUser = async (id) => {
  await axiosInstance.delete(`/users/${id}`, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
}

export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/users/forgot-password', { email }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/users/profile', {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}
