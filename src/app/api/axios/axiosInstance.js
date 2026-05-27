import axios from 'axios'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

// Interceptor para adicionar token nas requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = authSessionUtil.get()
    const method = config.method?.toLowerCase()
    const url = config.url || ''

    // Não adiciona Authorization em rotas públicas
    const publicRoutes = ['/auth/login', '/users/forgot-password']
    const isPublicRoute = publicRoutes.some(route => url.includes(route))

    // Cadastro público usa POST /users; só trata como público quando não há token.
    const isPublicRegister = method === 'post' && url.includes('/users') && !token

    if (token && !isPublicRoute && !isPublicRegister) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
