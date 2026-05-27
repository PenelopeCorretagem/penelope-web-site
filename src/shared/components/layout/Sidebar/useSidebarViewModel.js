import { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SidebarModel } from './SidebarModel'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'

/**
 * useSidebarViewModel - Hook ViewModel para Sidebar
 *
 * RESPONSABILIDADES:
 * - Gerenciar estado do sidebar (aberto/fechado)
 * - Controlar expansão de submenus e navegação
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
  const [expandedMenus, setExpandedMenus] = useState({}) // Movido da View para o ViewModel
  const [forceUpdate, setForceUpdate] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('')

  // Sincroniza status de admin com o modelo e força re-render
  useEffect(() => {
    const { role } = authSessionUtil.get()
    model.setAdminStatus(isAdmin)
    model.setUserRole(role ?? 'CLIENTE')
    setForceUpdate(prev => prev + 1)
  }, [isAdmin, model])

  // Recupera informações do usuário do sessionStorage
  useEffect(() => {
    const { email, role } = authSessionUtil.get()
    setUserEmail(email ?? '')
    setUserRole(role ?? 'CLIENTE')
    model.setUserRole(role ?? 'CLIENTE')
  }, [])

  // Auto-expandir o submenu se a rota atual for de um filho
  useEffect(() => {
    const menus = model.getMenuItems()
    const activeParent = menus.find(item =>
      item.children && item.children.some(child => location.pathname === child.path)
    )

    if (activeParent) {
      setExpandedMenus(prev => {
        if (prev[activeParent.id]) return prev
        return { ...prev, [activeParent.id]: true }
      })
    }
  }, [location.pathname, model, forceUpdate])

  // Escutar mudanças de auth para atualizar sidebar
  useEffect(() => {
    const handleAuthChange = () => {
      const { email, role } = authSessionUtil.get()
      setUserEmail(email ?? '')
      setUserRole(role ?? 'CLIENTE')
      model.setUserRole(role ?? 'CLIENTE')
      setForceUpdate(prev => prev + 1)
    }

    const handleStorageChange = (event) => {
      if (['token', 'userRole', 'userId', 'userEmail'].includes(event.key)) {
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

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const navigateTo = useCallback((path) => {
    if (path && location.pathname === path) {
      window.location.href = window.location.pathname
      return
    }
    navigate(path)
  }, [navigate, location.pathname])

  /**
   * Gerencia o clique nos itens do menu
   * Se tiver filhos: Abre o sidebar (se fechado) e alterna o submenu
   * Se não tiver: Navega para a rota
   */
  const handleItemClick = useCallback((item) => {
    const hasChildren = Array.isArray(item.children) && item.children.length > 0

    if (hasChildren) {
      if (!isOpen) {
        setIsOpen(true)
      }
      setExpandedMenus(prev => ({ ...prev, [item.id]: !prev[item.id] }))
    } else {
      navigateTo(item.path)
    }
  }, [isOpen, navigateTo])

  const isRouteActive = useCallback((path) => {
    return location.pathname === path
  }, [location.pathname])

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

  const menuItems = useMemo(() => model.getMenuItems(), [model, forceUpdate])

  return {
    isOpen,
    menuItems,
    homeRoute: model.getHomeRoute(),
    userEmail,
    userRole,
    expandedMenus,

    isRouteActive,

    toggleSidebar,
    navigateTo,
    handleItemClick,
    handleLogout,
  }
}
