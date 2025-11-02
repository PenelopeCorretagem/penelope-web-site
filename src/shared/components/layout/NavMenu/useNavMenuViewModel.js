import { useState, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { NavMenuModel } from '@shared/components/layout/NavMenu/NavMenuModel'
import {
  getNavMenuThemeClasses,
  getNavMenuItemsThemeClasses,
  getNavMenuUserActionsThemeClasses,
  getNavMenuHamburgerThemeClasses,
  getNavMenuFooterThemeClasses,
  getNavMenuFooterSectionThemeClasses,
  getNavMenuFooterLinkThemeClasses,
  getNavMenuItemThemeClasses,
  getNavMenuActionThemeClasses,
} from '@shared/styles/theme'

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
export function useNavMenuViewModel(isAuthenticated = false) {
  /** @type {NavMenuModel} Instância do modelo do menu. */
  const [model] = useState(() => new NavMenuModel(isAuthenticated))
  const [, forceUpdate] = useState(0)
  const location = useLocation()

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
    refresh()
  }, [isAuthenticated, model, refresh])

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
   * Fecha o menu mobile e força atualização.
   * O scroll para o topo é gerenciado pelo componente ScrollToTop.
   *
   * @function
   * @example
   * handleItemClick()
   */
  const handleItemClick = useCallback(() => {
    model.closeMobileMenu()
    refresh()
  }, [model, refresh])

  /**
   * Executa o processo de logout.
   * - Reseta scroll para o topo;
   * - Remove token JWT do `localStorage`;
   * - Atualiza estado de autenticação;
   * - Fecha o menu mobile;
   * - Redireciona para a home (`/`).
   *
   * @function
   * @example
   * handleLogout()
   */
  const handleLogout = useCallback(() => {
    window.scrollTo(0, 0)
    localStorage.removeItem('jwtToken')
    model.setAuthenticationStatus(false)
    model.closeMobileMenu()
    window.location.href = '/'
  }, [model])

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
    getNavMenuThemeClasses({ className })

  /**
   * Retorna classes para a lista de itens de menu.
   * @param {boolean} [isMobile=false] - Define se é versão mobile.
   * @param {string} [className=''] - Classes adicionais.
   * @returns {string} Classes CSS.
   */
  const getMenuItemsClasses = (isMobile = false, className = '') =>
    getNavMenuItemsThemeClasses({ isMobile, className })

  /**
   * Retorna classes para a área de ações do usuário (login, perfil, etc).
   * @param {boolean} [isMobile=false]
   * @param {string} [className='']
   * @returns {string}
   */
  const getUserActionsClasses = (isMobile = false, className = '') =>
    getNavMenuUserActionsThemeClasses({ isMobile, className })

  /**
   * Retorna classes para o botão "hamburger" do menu mobile.
   * @param {string} [className='']
   * @returns {string}
   */
  const getHamburgerClasses = (className = '') =>
    getNavMenuHamburgerThemeClasses({ className })

  /**
   * Retorna classes para um item do menu principal.
   * @param {Object} item - Item de menu.
   * @param {boolean} [isActive=false] - Indica se está ativo.
   * @returns {string}
   */
  const getItemClasses = (item, isActive = false) =>
    getNavMenuItemThemeClasses({
      isActive,
      requiresAuth: item.requiresAuth,
      isAuthenticated: model.isAuthenticated,
      isMobileMenuOpen: model.isMobileMenuOpen,
      variant: item.variant,
    })

  /**
   * Retorna classes para ações de usuário (botões de perfil, logout, etc).
   * @param {Object} action - Objeto da ação.
   * @returns {string}
   */
  const getActionClasses = (action) =>
    getNavMenuActionThemeClasses({
      shape: action.shape,
      requiresAuth: action.requiresAuth,
      isAuthenticated: model.isAuthenticated,
      isMobileMenuOpen: model.isMobileMenuOpen,
      variant: action.variant,
    })

  /**
   * Retorna classes para o rodapé do menu.
   * @param {string} [className='']
   * @returns {string}
   */
  const getFooterClasses = (className = '') =>
    getNavMenuFooterThemeClasses({ className })

  /**
   * Retorna classes para uma seção do rodapé.
   * @param {string} [className='']
   * @returns {string}
   */
  const getFooterSectionClasses = (className = '') =>
    getNavMenuFooterSectionThemeClasses({ className })

  /**
   * Retorna classes para links do rodapé.
   * @param {boolean} [disabled=false]
   * @param {string} [className='']
   * @returns {string}
   */
  const getFooterLinkClasses = (disabled = false, className = '') =>
    getNavMenuFooterLinkThemeClasses({ disabled, className })

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
  }
}
