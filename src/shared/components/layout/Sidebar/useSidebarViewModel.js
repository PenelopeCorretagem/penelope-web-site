import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SidebarModel } from './SidebarModel'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'

/**
 * useSidebarViewModel - Hook ViewModel para Sidebar
 *
 * RESPONSABILIDADES:
 * - Gerenciar estado do sidebar (aberto/fechado)
 * - Fornecer métodos de navegação
 * - Calcular estado ativo dos itens
 * - Gerenciar logout
 * - Expor informações do usuário
 *
 * @param {boolean} isAdmin - Se usuário é admin
 * @param {boolean} initialOpen - Estado inicial do sidebar (padrão: false)
 * @returns {Object} ViewModel com estado e comandos
 */
export function useSidebarViewModel(isAdmin = false, initialOpen = false) {
  const navigate = useNavigate()
  const location = useLocation()
  const [model] = useState(() => new SidebarModel(isAdmin))
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('')

  // Sincroniza status de admin com o modelo E força re-render
  useEffect(() => {
    model.setAdminStatus(isAdmin)
    setForceUpdate(prev => prev + 1) // Força re-render dos menu items
  }, [isAdmin, model])

  // Recuperar informações do usuário do sessionStorage
  useEffect(() => {
    const { email, role } = authSessionUtil.get()
    setUserEmail(email ?? '')
    setUserRole(role ?? 'CLIENTE')
  }, [])

  // Escutar mudanças de auth para atualizar sidebar
  useEffect(() => {
    const handleAuthChange = () => {
      const { email, role } = authSessionUtil.get()
      setUserEmail(email ?? '')
      setUserRole(role ?? 'CLIENTE')
      setForceUpdate(prev => prev + 1)
    }

    const handleStorageChange = (event) => {
      if (['jwtToken', 'userRole', 'userId', 'userEmail'].includes(event.key)) {
        handleAuthChange()
      }
    }

    window.addEventListener('authChanged', handleAuthChange)
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('authChanged', handleAuthChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  /**
   * Alterna estado de abertura do sidebar
   */
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  /**
   * Navega para uma rota específica
   * @param {string} path - Caminho da rota
   */
  const navigateTo = useCallback((path) => {
    if (path && location.pathname === path) {
      window.location.href = window.location.pathname
      return
    }
    navigate(path)
  }, [navigate, location.pathname])

  /**
   * Verifica se uma rota está ativa
   * @param {string} path - Caminho da rota
   * @returns {boolean}
   */
  const isRouteActive = useCallback((path) => {
    return location.pathname === path
  }, [location.pathname])

  /**
   * Executa logout
   * - Dispara transição visual
   * - Remove tokens
   * - Redireciona para home
   */
  const handleLogout = useCallback(() => {
    window.dispatchEvent(new CustomEvent('authTransition', {
      detail: { type: 'logout', message: 'Encerrando sua sessão...' }
    }))

    setTimeout(() => {
      authSessionUtil.clear()
      window.dispatchEvent(new CustomEvent('authChanged'))

      setTimeout(() => {
        window.location.href = model.getHomeRoute()
      }, 300)
    }, 300)
  }, [model])

  return {
    // Estado
    isOpen,
    menuItems: model.getMenuItems(), // Será recalculado quando forceUpdate mudar
    homeRoute: model.getHomeRoute(),
    userEmail,
    userRole,

    // Verificações
    isRouteActive,

    // Comandos
    toggleSidebar,
    navigateTo,
    handleLogout,
  }
}
