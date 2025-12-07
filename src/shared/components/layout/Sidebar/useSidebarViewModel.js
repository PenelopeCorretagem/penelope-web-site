import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SidebarModel } from './SidebarModel'

/**
 * useSidebarViewModel - Hook ViewModel para Sidebar
 *
 * RESPONSABILIDADES:
 * - Gerenciar estado do sidebar (aberto/fechado)
 * - Fornecer métodos de navegação
 * - Calcular estado ativo dos itens
 * - Gerenciar logout
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

  // Sincroniza status de admin com o modelo E força re-render
  useEffect(() => {
    model.setAdminStatus(isAdmin)
    setForceUpdate(prev => prev + 1) // Força re-render dos menu items
  }, [isAdmin, model])

  // Escutar mudanças de auth para atualizar sidebar
  useEffect(() => {
    const handleAuthChange = () => {
      setForceUpdate(prev => prev + 1)
    }

    const handleStorageChange = (event) => {
      if (['jwtToken', 'userRole', 'userId'].includes(event.key)) {
        setForceUpdate(prev => prev + 1)
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
    navigate(path)
  }, [navigate])

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
   * - Remove tokens
   * - Redireciona para home
   */
  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('jwtToken')
    sessionStorage.removeItem('userRole')
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userName')
    sessionStorage.removeItem('token')

    // Disparar evento de mudança de auth
    window.dispatchEvent(new CustomEvent('authChanged'))

    window.location.href = model.getHomeRoute()
  }, [model])

  return {
    // Estado
    isOpen,
    menuItems: model.getMenuItems(), // Será recalculado quando forceUpdate mudar
    homeRoute: model.getHomeRoute(),

    // Verificações
    isRouteActive,

    // Comandos
    toggleSidebar,
    navigateTo,
    handleLogout,
  }
}
