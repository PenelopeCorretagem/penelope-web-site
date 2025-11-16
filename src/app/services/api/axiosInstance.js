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

    console.log('📡 [REQUEST]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      hasAuth: !!config.headers.Authorization,
      headers: config.headers
    })

    return config
  },
  (error) => {
    console.error('❌ [REQUEST ERROR]', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de resposta
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ [RESPONSE]', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    })
    return response
  },
  (error) => {
    const errorDetails = {
      url: error.config?.url,
      method: error.config?.method,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown',
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    }

    console.error('❌ [RESPONSE ERROR]', errorDetails)

    // Redireciona apenas em 401 fora das rotas de autenticação
    if (error.response?.status === 401) {
      const isAuthRequest = error.config?.url?.includes('/auth/')
      if (!isAuthRequest) {
        console.warn('🔒 Token inválido, redirecionando para login')
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        setTimeout(() => {
          window.location.href = '/auth'
        }, 1000)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
