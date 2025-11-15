import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para adicionar token de autenticação
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor para tratamento de erros
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
