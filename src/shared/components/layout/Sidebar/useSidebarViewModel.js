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

  // Sincroniza status de admin com o modelo
  useEffect(() => {
    model.setAdminStatus(isAdmin)
  }, [isAdmin, model])

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
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userRole')
    window.location.href = model.getHomeRoute()
  }, [model])

  return {
    // Estado
    isOpen,
    menuItems: model.getMenuItems(),
    homeRoute: model.getHomeRoute(),

    // Verificações
    isRouteActive,

    // Comandos
    toggleSidebar,
    navigateTo,
    handleLogout,
  }
}
