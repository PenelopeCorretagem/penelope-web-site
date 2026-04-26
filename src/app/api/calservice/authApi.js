import axiosInstance from '@api/axiosInstance'

const CAL_SERVICE_BASE_URL = import.meta.env.CAL_SERVICE_URL

export const login = async ({ email, password }) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  }, {
    baseURL: CAL_SERVICE_BASE_URL,
  })

  return response.data
}

export const validateToken = async (token = null) => {
  const response = await axiosInstance.post('/auth/validate-token', {
    token,
  }, {
    baseURL: CAL_SERVICE_BASE_URL,
  })

  return response.data
}