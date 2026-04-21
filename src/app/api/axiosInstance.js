import axios from 'axios'

// Usa variável de ambiente para a URL base da API
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1'

console.log('🔧 [AXIOS_INSTANCE] Inicializando axiosInstance')
console.log('   Base URL:', baseURL)

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Interceptor para adicionar token nas requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token')
    const method = config.method?.toLowerCase()
    const url = config.url || ''

    console.log(`📤 [AXIOS_INSTANCE] ${method?.toUpperCase()} ${url}`)
    console.log('   Token:', token ? `presente (${token.substring(0, 20)}...)` : 'ausente')
    console.log('   URL completa:', `${config.baseURL}${url}`)

    // Não adiciona Authorization em rotas públicas
    const publicRoutes = ['/auth/login', '/users/forgot-password']
    const isPublicRoute = publicRoutes.some(route => url.includes(route))

    // Cadastro público usa POST /users; só trata como público quando não há token.
    const isPublicRegister = method === 'post' && url.includes('/users') && !token

    if (token && !isPublicRoute && !isPublicRegister) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('   ✅ Token adicionado ao header')
    } else {
      console.log('   ⚠️ Sem token/rota pública')
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
    console.log(`📥 [AXIOS_INSTANCE] Resposta: ${response.status} ${response.statusText}`)
    return response
  },
  (error) => {
    console.error(`❌ [AXIOS_INSTANCE] Erro: ${error.response?.status} ${error.message}`)
    console.error('   Dados do erro:', error.response?.data)
    return Promise.reject(error)
  }
)

export default axiosInstance
