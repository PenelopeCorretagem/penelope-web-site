import { useState, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavMenuModel } from '@shared/components/layout/NavMenu/NavMenuModel'
import { RouterModel } from '@routes/RouterModel'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'

// Classes Tailwind diretas para NavMenu
const NAV_MENU_CONTAINER_CLASSES = 'flex items-center justify-end md:justify-between w-full h-fit'
const NAV_MENU_ITEMS_DESKTOP_CLASSES = 'items-center gap-2 flex-1 justify-center hidden md:flex'
const NAV_MENU_ITEMS_MOBILE_CLASSES = 'md:hidden flex absolute top-full left-0 right-0 flex-col bg-white shadow-lg p-4 z-50'
const NAV_MENU_USER_ACTIONS_DESKTOP_CLASSES = 'items-center gap-2 w-fit hidden md:flex'
const NAV_MENU_USER_ACTIONS_MOBILE_CLASSES = 'md:hidden flex absolute top-[calc(100%+var(--menu-items-height))] left-0 right-0 justify-center bg-white shadow-lg p-4 z-50'
const NAV_MENU_HAMBURGER_CLASSES = 'hidden max-md:flex items-center justify-center w-10 h-10 text-2xl cursor-pointer transition-colors duration-200 hover:text-primary-600'
const NAV_MENU_FOOTER_CLASSES = 'grid grid-cols-1 gap-6 items-start justify-items-center md:flex md:flex-row md:items-start md:justify-between md:w-full md:h-fit md:gap-0'
const NAV_MENU_FOOTER_SECTION_CLASSES = 'flex flex-col items-center md:items-start gap-2 text-sm md:text-base'
const NAV_MENU_FOOTER_LINK_ENABLED_CLASSES = 'text-default-dark hover:text-distac-primary hover:underline transition-colors duration-200 uppercase cursor-pointer text-sm md:text-base'
const NAV_MENU_FOOTER_LINK_DISABLED_CLASSES = 'cursor-not-allowed opacity-50 text-gray-500'

// Helpers para NavMenu Item e Action com lógica condicional
function getNavMenuItemClasses(item, isActive, isAuthenticated, isMobileMenuOpen) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-title font-medium uppercase text-[12px] md:text-[16px] leading-none transition-all duration-200 rounded-sm px-4 py-2'
  const authClasses = item.requiresAuth && !isAuthenticated ? 'opacity-50 pointer-events-none' : ''
  const scaleClasses = isActive ? 'scale-105 bg-distac-primary text-default-light' : 'bg-default-light-terciary text-default-dark hover:scale-105 hover:bg-distac-primary hover:text-default-light'
  const mobileClasses = isMobileMenuOpen ? 'w-full justify-center' : ''
  return `${baseClasses} ${authClasses} ${scaleClasses} ${mobileClasses}`
}

function getNavMenuActionClasses(action, isAuthenticated, isMobileMenuOpen) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-title font-medium uppercase text-[12px] md:text-[16px] leading-none transition-all duration-200'
  const authClasses = action.requiresAuth && !isAuthenticated ? 'opacity-50 pointer-events-none' : ''
  const shapeClasses = action.shape === 'circle' ? 'rounded-full p-3' : 'rounded-sm px-4 py-2'
  const colorClasses = 'bg-default-light-terciary text-default-dark hover:scale-105 hover:bg-distac-primary hover:text-default-light'
  const mobileClasses = isMobileMenuOpen ? 'w-full justify-center' : ''
  return `${baseClasses} ${authClasses} ${shapeClasses} ${colorClasses} ${mobileClasses}`
}


/**
 * Hook de ViewModel do componente de Navegação (NavMenuView).
 *
 * Este hook é responsável por:
 * - Gerenciar o estado do menu (itens, ações, autenticação e menu mobile);
 * - Integrar o modelo `NavMenuModel` com a camada de visualização (`NavMenuView`);
 * - Fornecer funções auxiliares para renderização temática (CSS/Tailwind);
 * - Controlar ações de navegação e logout.
 *
 * Implementa o padrão **MVVM (Model–View–ViewModel)**.
 *
 * @param {boolean} [isAuthenticated=false] - Define se o usuário está autenticado.
 *
 * @returns {Object} ViewModel contendo estado, comandos e helpers de estilo.
 *
 * @example
 * const viewModel = useNavMenuViewModel(true)
 * viewModel.menuItems.map(item => console.log(item.label))
 */
export function useNavMenuViewModel(isAuthenticated = false, isAdmin = false) {
  /** @type {NavMenuModel} Instância do modelo do menu. */
  const [model] = useState(() => new NavMenuModel(isAuthenticated, isAdmin))
  const [routerModel] = useState(() => RouterModel.getInstance())
  const [, forceUpdate] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  /**
   * Força atualização manual do componente.
   * Útil para sincronizar estado interno do modelo com o React.
   *
   * @function
   * @private
   */
  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  /**
   * Sincroniza o estado de autenticação com o modelo sempre que `isAuthenticated` mudar.
   *
   * @effect
   */
  useEffect(() => {
    model.setAuthenticationStatus(isAuthenticated)
    model.setAdminStatus(isAdmin)
    refresh()
  }, [isAuthenticated, isAdmin, model, refresh])

  /**
   * Verifica se uma rota está ativa com base na URL atual.
   *
   * @function
   * @param {string} route - Caminho da rota a verificar.
   * @returns {boolean} `true` se a rota for a atual, senão `false`.
   *
   * @example
   * isItemActive('/about') // true se o usuário estiver em /about
   */
  const isItemActive = useCallback((route) => {
    if (!route) return false
    return route === '/'
      ? location.pathname === '/'
      : location.pathname === route || location.pathname.startsWith(`${route}/`)
  }, [location.pathname])

  /**
 * Fecha o menu mobile e navega para a rota clicada.
 * Se a rota clicada for EXATAMENTE a rota atual (sem filhos), recarrega.
 * Evita o bug de recarregar /imoveis/{id} ao clicar em /imoveis.
 */
  const handleItemClick = useCallback((routePath) => {
    model.closeMobileMenu()

    if (routePath && location.pathname === routePath) {
      window.location.href = routePath
      return
    }

    refresh()
  }, [model, refresh, location.pathname])

  /**
   * Executa o processo de logout.
   * - Dispara transição visual
   * - Reseta scroll para o topo
   * - Remove token JWT
   * - Atualiza estado de autenticação
   * - Fecha o menu mobile
   * - Redireciona para a home
   *
   * @function
   * @example
   * handleLogout()
   */
  const handleLogout = useCallback(() => {
      window.dispatchEvent(new CustomEvent('authTransition', {
        detail: { type: 'logout', message: 'Encerrando sua sessão...' }
      }))

      setTimeout(() => {
        window.scrollTo(0, 0)
        authSessionUtil.clear()
        model.setAuthenticationStatus(false)
        model.closeMobileMenu()

        setTimeout(() => {
          window.location.href = routerModel.getRoute('HOME')
        }, 300)
      }, 300)
    }, [model, routerModel])

  /**
   * Alterna o estado de abertura do menu mobile.
   *
   * @function
   * @example
   * toggleMobileMenu()
   */
  const toggleMobileMenu = useCallback(() => {
    model.toggleMobileMenu()
    refresh()
  }, [model, refresh])

  /**
   * Fecha o menu mobile forçadamente.
   *
   * @function
   * @example
   * closeMobileMenu()
   */
  const closeMobileMenu = useCallback(() => {
    model.closeMobileMenu()
    refresh()
  }, [model, refresh])

  /**
   * Retorna classes temáticas para o container principal do menu.
   * @param {string} [className=''] - Classes adicionais opcionais.
   * @returns {string} Classes CSS combinadas.
   */
  const getMenuContainerClasses = (className = '') =>
    `${NAV_MENU_CONTAINER_CLASSES} ${className}`.trim()

  /**
   * Retorna classes para a lista de itens de menu.
   * @param {boolean} [isMobile=false] - Define se é versão mobile.
   * @param {string} [className=''] - Classes adicionais.
   * @returns {string} Classes CSS.
   */
  const getMenuItemsClasses = (isMobile = false, className = '') =>
    `${isMobile ? NAV_MENU_ITEMS_MOBILE_CLASSES : NAV_MENU_ITEMS_DESKTOP_CLASSES} ${className}`.trim()

  /**
   * Retorna classes para a área de ações do usuário (login, perfil, etc).
   * @param {boolean} [isMobile=false]
   * @param {string} [className='']
   * @returns {string}
   */
  const getUserActionsClasses = (isMobile = false, className = '') =>
    `${isMobile ? NAV_MENU_USER_ACTIONS_MOBILE_CLASSES : NAV_MENU_USER_ACTIONS_DESKTOP_CLASSES} ${className}`.trim()

  /**
   * Retorna classes para o botão "hamburger" do menu mobile.
   * @param {string} [className='']
   * @returns {string}
   */
  const getHamburgerClasses = (className = '') =>
    `${NAV_MENU_HAMBURGER_CLASSES} ${className}`.trim()

  /**
   * Retorna classes para um item do menu principal.
   * @param {Object} item - Item de menu.
   * @param {boolean} [isActive=false] - Indica se está ativo.
   * @returns {string}
   */
  const getItemClasses = (item, isActive = false) =>
    getNavMenuItemClasses(item, isActive, model.isAuthenticated, model.isMobileMenuOpen)

  /**
   * Retorna classes para ações de usuário (botões de perfil, logout, etc).
   * @param {Object} action - Objeto da ação.
   * @returns {string}
   */
  const getActionClasses = (action) =>
    getNavMenuActionClasses(action, model.isAuthenticated, model.isMobileMenuOpen)

  /**
   * Retorna classes para o rodapé do menu.
   * @param {string} [className='']
   * @returns {string}
   */
  const getFooterClasses = (className = '') =>
    `${NAV_MENU_FOOTER_CLASSES} ${className}`.trim()

  /**
   * Retorna classes para uma seção do rodapé.
   * @param {string} [className='']
   * @returns {string}
   */
  const getFooterSectionClasses = (className = '') =>
    `${NAV_MENU_FOOTER_SECTION_CLASSES} ${className}`.trim()

  /**
   * Retorna classes para links do rodapé.
   * @param {boolean} [disabled=false]
   * @param {string} [className='']
   * @returns {string}
   */
  const getFooterLinkClasses = (disabled = false, className = '') =>
    `${disabled ? NAV_MENU_FOOTER_LINK_DISABLED_CLASSES : NAV_MENU_FOOTER_LINK_ENABLED_CLASSES} ${className}`.trim()

  return {
    // Estado
    menuItems: model.getMenuItems(),
    userActions: model.getUserActions(),
    isAuthenticated: model.isAuthenticated,
    footerSections: model.getFooterSections(),
    isMobileMenuOpen: model.isMobileMenuOpen,

    // Helpers de estado
    isItemActive,

    // CSS helpers
    getMenuContainerClasses,
    getMenuItemsClasses,
    getUserActionsClasses,
    getHamburgerClasses,
    getItemClasses,
    getActionClasses,
    getFooterClasses,
    getFooterSectionClasses,
    getFooterLinkClasses,

    // Ações
    handleItemClick,
    handleLogout,
    toggleMobileMenu,
    closeMobileMenu,
    getSectionTitle: (key) => model.getSectionTitle(key),
    getFooterSectionMobileOrder: (key) => model.getFooterSectionMobileOrder(key),
  }
}
