/**
 * useAuthTransitionHandler - Hook helper para facilitar transições de auth em formulários
 *
 * RESPONSABILIDADES:
 * - Simplificar disparo de transições
 * - Gerenciar timing de salvamento de tokens
 * - Coordenar salvamento + transição + redirecionamento
 *
 * USO:
 * const { triggerLoginTransition, triggerLogoutTransition } = useAuthTransitionHandler()
 * 
 * // Em handleLoginSubmit
 * await triggerLoginTransition(async () => {
 *   const response = await loginAPI(credentials)
 *   return response
 * })
 *
 * @example
 * const { triggerLoginTransition } = useAuthTransitionHandler()
 * 
 * const handleSubmit = async (credentials) => {
 *   try {
 *     await triggerLoginTransition(async () => {
 *       const response = await api.login(credentials)
 *       return {
 *         token: response.data.token,
 *         userId: response.data.userId,
 *         userRole: response.data.role,
 *         userEmail: response.data.email
 *       }
 *     }, '/') // rota destino (opcional)
 *   } catch (error) {
 *     console.error('Login falhou:', error)
 *   }
 * }
 */

/**
 * Dispara transição de login com salvamento de tokens e redirecionamento
 * 
 * @param {Function} loginFn - Função assíncrona que faz login e retorna { token, userId, userRole, userEmail }
 * @param {string} redirectTo - Rota para redirecionar após transição (default: '/')
 * @returns {Promise<void>}
 */
export const useAuthTransitionHandler = () => {
  /**
   * Trigger login transition
   */
  const triggerLoginTransition = async (
    loginFn,
    redirectTo = '/'
  ) => {
    // 1. Disparar transição visual
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { 
        type: 'login', 
        message: 'Autenticando sua conta...' 
      }
    }))

    try {
      // 2. Executar função de login
      const authData = await loginFn()

      // 3. Salvar tokens com pequeno delay para garantir renderização da transição
      await new Promise(resolve => setTimeout(resolve, 300))

      if (authData) {
        sessionStorage.setItem('token', authData.token)
        sessionStorage.setItem('userId', authData.userId)
        sessionStorage.setItem('userRole', authData.userRole)
        sessionStorage.setItem('userEmail', authData.userEmail || '')
        sessionStorage.setItem('hadToken', 'true')
        
        // 4. Notificar mudança
        window.dispatchEvent(new CustomEvent('authChanged'))
      }

      // 5. Aguardar transição terminar antes de redirecionar
      await new Promise(resolve => setTimeout(resolve, 1200))

      // 6. Redirecionar
      window.location.href = redirectTo

    } catch (error) {
      // Em caso de erro, esconder transição
      window.dispatchEvent(new CustomEvent('authTransition', {
        detail: { 
          type: 'error', 
          message: 'Erro ao autenticar. Tente novamente.' 
        }
      }))
      
      // Re-lançar erro para ser tratado pelo chamador
      throw error
    }
  }

  /**
   * Trigger logout transition
   */
  const triggerLogoutTransition = async (redirectTo = '/') => {
    // 1. Disparar transição visual
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { 
        type: 'logout', 
        message: 'Encerrando sua sessão...' 
      }
    }))

    // 2. Aguardar renderização da transição
    await new Promise(resolve => setTimeout(resolve, 300))

    // 3. Remover tokens
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('userRole')
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('hadToken')

    // 4. Notificar mudança
    window.dispatchEvent(new CustomEvent('authChanged'))

    // 5. Aguardar transição terminar
    await new Promise(resolve => setTimeout(resolve, 1200))

    // 6. Redirecionar
    window.location.href = redirectTo
  }

  /**
   * Verificar status de transição
   */
  const isTransitioning = () => {
    // Pode ser expandido para retornar o hook do ViewModel
    return false
  }

  return {
    triggerLoginTransition,
    triggerLogoutTransition,
    isTransitioning,
  }
}
