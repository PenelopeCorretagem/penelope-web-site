import axios from 'axios'

// Usa URL completa para debug - funciona mesmo sem proxy
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
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

    // Log simplificado apenas para debug
    console.log(`🚀 [AXIOS] ${config.method?.toUpperCase()} ${config.url}`)

    return config
  },
  (error) => {
    console.error('❌ [AXIOS] Request error:', error.message)
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de resposta
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ [AXIOS] ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ [AXIOS] ${error.response?.status || 'ERROR'} ${error.config?.url}:`, error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance
