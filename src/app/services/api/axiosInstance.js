import axios from 'axios'

// Usa variável de ambiente para a URL base da API
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Interceptor para adicionar token nas requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    // Não adiciona Authorization em rotas públicas
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/users']
    const isPublicRoute = publicRoutes.some(route => config.url?.includes(route))

    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de resposta
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
