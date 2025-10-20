import { useState, useCallback, useEffect } from 'react'
import { NavMenuModel } from '@shared/components/layout/NavMenu/NavMenuModel'
import { routerService } from '@routes/RouterService'
import {
  getNavMenuThemeClasses,
  getNavMenuItemsThemeClasses,
  getNavMenuUserActionsThemeClasses,
  getNavMenuHamburgerThemeClasses,
  getNavMenuFooterThemeClasses,
  getNavMenuFooterSectionThemeClasses,
  getNavMenuFooterLinkThemeClasses,
} from '@shared/styles/theme'

/**
 * NavMenuViewModel - Gerencia apresentação do NavMenu
 */
class NavMenuViewModel {
  constructor(model = new NavMenuModel()) {
    this.model = model
    this.routerService = routerService
  }

  // Delegação para o Model
  get menuItems() { return this.model.getMenuItems() }
  get userActions() { return this.model.getUserActions() }
  get isAuthenticated() { return this.model.isAuthenticated }
  get footerSections() { return this.model.getFooterSections() }
  get isMobileMenuOpen() { return this.model.isMobileMenuOpen }

  // Classes CSS
  getMenuContainerClasses(className = '') {
    return getNavMenuThemeClasses({ className })
  }

  getMenuItemsClasses(isMobile = false, className = '') {
    return getNavMenuItemsThemeClasses({ isMobile, className })
  }

  getUserActionsClasses(isMobile = false, className = '') {
    return getNavMenuUserActionsThemeClasses({ isMobile, className })
  }

  getHamburgerClasses(className = '') {
    return getNavMenuHamburgerThemeClasses({ className })
  }

  getFooterClasses(className = '') {
    return getNavMenuFooterThemeClasses({ className })
  }

  getFooterSectionClasses(className = '') {
    return getNavMenuFooterSectionThemeClasses({ className })
  }

  getFooterLinkClasses(disabled = false, className = '') {
    return getNavMenuFooterLinkThemeClasses({ disabled, className })
  }

  // Ações
  toggleMobileMenu() {
    this.model.isMobileMenuOpen = !this.model.isMobileMenuOpen
  }

  closeMobileMenu() {
    this.model.isMobileMenuOpen = false
  }

  logout() {
    localStorage.removeItem('jwtToken')
    this.model.setAuthenticationStatus(false)
    window.location.href = '/'
  }
}

/**
 * Hook principal do NavMenu - LÓGICA SIMPLIFICADA
 */
export function useNavMenuViewModel(isAuthenticated = false) {
  const [viewModel] = useState(() => {
    const model = new NavMenuModel(isAuthenticated)
    return new NavMenuViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  // Sincroniza autenticação
  useEffect(() => {
    viewModel.model.setAuthenticationStatus(isAuthenticated)
    refresh()
  }, [isAuthenticated, viewModel, refresh])

  const commands = {
    handleItemClick: () => {
      refresh()
    },

    logout: () => {
      viewModel.logout()
      refresh()
    },

    toggleMobileMenu: () => {
      viewModel.toggleMobileMenu()
      refresh()
    },

    closeMobileMenu: () => {
      viewModel.closeMobileMenu()
      refresh()
    },
  }

  return {
    // Data
    menuItems: viewModel.menuItems,
    userActions: viewModel.userActions,
    isAuthenticated: viewModel.isAuthenticated,
    footerSections: viewModel.footerSections,
    isMobileMenuOpen: viewModel.isMobileMenuOpen,

    // CSS helpers
    getMenuContainerClasses: (className) => viewModel.getMenuContainerClasses(className),
    getMenuItemsClasses: (isMobile, className) => viewModel.getMenuItemsClasses(isMobile, className),
    getUserActionsClasses: (isMobile, className) => viewModel.getUserActionsClasses(isMobile, className),
    getHamburgerClasses: (className) => viewModel.getHamburgerClasses(className),
    getFooterClasses: (className) => viewModel.getFooterClasses(className),
    getFooterSectionClasses: (className) => viewModel.getFooterSectionClasses(className),
    getFooterLinkClasses: (disabled, className) => viewModel.getFooterLinkClasses(disabled, className),

    // Commands
    ...commands,
  }
}

export { NavMenuViewModel }
