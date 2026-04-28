import { useState, useEffect, useCallback } from 'react'

/**
 * useAuthTransitionViewModel - Gerencia lógica de transição de autenticação
 *
 * RESPONSABILIDADES:
 * - Detectar mudanças de autenticação (login/logout)
 * - Controlar exibição da tela de transição
 * - Gerenciar status e mensagem
 * - Sincronizar com múltiplas abas
 *
 * FLUXO:
 * 1. Monitora sessionStorage para mudanças de token
 * 2. Ao detectar mudança, exibe a transição
 * 3. Após delay, oculta e libera navegação
 *
 * @returns {Object} { isTransitioning, status, message, showTransition, hideTransition }
 */
export function useAuthTransitionViewModel() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [status, setStatus] = useState('verifying') // 'login' | 'logout' | 'verifying'
  const [message, setMessage] = useState('')
  const [transitionDuration, setTransitionDuration] = useState(1500) // ms

  /**
   * Inicia transição com status customizado
   */
  const showTransition = useCallback((newStatus = 'verifying', customMessage = '') => {
    setStatus(newStatus)
    setMessage(customMessage)
    setIsTransitioning(true)

    // Auto-hide após duration
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, transitionDuration)

    return () => clearTimeout(timer)
  }, [transitionDuration])

  /**
   * Oculta transição imediatamente
   */
  const hideTransition = useCallback(() => {
    setIsTransitioning(false)
    setMessage('')
  }, [])

  /**
   * Detecta logout (token removido)
   */
  useEffect(() => {
    const handleLogout = () => {
      const hadToken = sessionStorage.getItem('token')
      
      // Se tinha token e agora não tem, é logout
      if (!hadToken && sessionStorage.getItem('hadToken') === 'true') {
        showTransition('logout', 'Encerrando sua sessão...')
      }

      sessionStorage.setItem('hadToken', hadToken ? 'true' : 'false')
    }

    // Verifica no carregamento inicial
    const initialToken = sessionStorage.getItem('token')
    sessionStorage.setItem('hadToken', initialToken ? 'true' : 'false')

    // Escuta evento customizado de logout
    window.addEventListener('authLogout', () => {
      showTransition('logout', 'Encerrando sua sessão...')
    })

    // Escuta mudanças no storage (outras abas)
    const handleStorageChange = (event) => {
      if (event.key === 'token') {
        if (!event.newValue && event.oldValue) {
          // Token foi removido = logout
          showTransition('logout', 'Encerrando sua sessão...')
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('authLogout', handleLogout)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [showTransition])

  /**
   * Detecta mudanças de autenticação customizadas
   */
  useEffect(() => {
    const handleAuthChange = (event) => {
      const { detail } = event
      if (detail?.type === 'login') {
        showTransition('login', detail?.message || 'Autenticando sua conta...')
      } else if (detail?.type === 'logout') {
        showTransition('logout', detail?.message || 'Encerrando sua sessão...')
      }
    }

    window.addEventListener('authTransition', handleAuthChange)

    return () => {
      window.removeEventListener('authTransition', handleAuthChange)
    }
  }, [showTransition])

  return {
    // Estado
    isTransitioning,
    status,
    message,

    // Comandos
    showTransition,
    hideTransition,
    setTransitionDuration,
  }
}
