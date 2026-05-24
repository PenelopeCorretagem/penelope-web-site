import axiosInstance from '@api/axios/axiosInstance'

const PENELOPEC_API_BASE_URL = import.meta.env.PENELOPEC_URL

export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
  }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const register = async (userData) => {
  const response = await axiosInstance.post('/users', userData, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const validateResetToken = async (token) => {
  const response = await axiosInstance.post('/auth/validate-reset-token', { token }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}

export const resetPassword = async (token, newPassword) => {
  const response = await axiosInstance.post('/auth/reset-password', {
    token,
    newPassword,
  }, {
    baseURL: PENELOPEC_API_BASE_URL,
  })
  return response.data
}
