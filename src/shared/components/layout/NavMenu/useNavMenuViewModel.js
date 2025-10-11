import { useState, useCallback, useMemo, useEffect } from 'react'
import { NavMenuModel } from '@shared/components/layout/NavMenu/NavMenuModel'
import { routerService } from '@routes/RouterService'

/**
 * NavMenuViewModel - Gerencia a lógica do menu e navegação da aplicação
 * Integra com RouterService para navegação e controle de estado do menu
 */
class NavMenuViewModel {
  /**
   * @param {Object} model - NavMenuModel para gerenciar estado do menu
   * @param {Object} routerService - Serviço de roteamento opcional
   */
  constructor(model, routerService = null) {
    this.model = model
    this.routerService = routerService
    this.errors = []
  }

  /**
   * Getters - Propriedades computadas que refletem o estado do modelo
   */
  get menuItems() {
    return this.model.getMenuItems()
  }

  get userActions() {
    return this.model.getUserActions()
  }

  get activeItem() {
    return this.model.activeItem
  }

  get isMobileMenuOpen() {
    return this.model.isMobileMenuOpen
  }

  toggleMobileMenu() {
    this.model.isMobileMenuOpen = !this.model.isMobileMenuOpen
  }

  closeMobileMenu() {
    this.model.isMobileMenuOpen = false
  }

  get currentRoute() {
    return this.routerService?.route || '/'
  }

  get isAuthenticated() {
    return this.model.isAuthenticated
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  /**
   * Footer-specific getters
   */
  get footerSections() {
    return this.model.getFooterSections()
  }

  getFooterItem(sectionName, itemId) {
    return this.model.getFooterItem(sectionName, itemId)
  }

  /**
   * Navega para um item específico do menu
   * @param {string} itemId - ID do item do menu
   * @returns {Object} Resultado da navegação
   */
  navigateToItem = itemId => {
    // Reseta o item ativo atual antes de navegar
    this.model.setActiveItem(null)

    // Valida se o item pode ser acessado
    const validation = this.model.validateMenuItem(itemId)

    if (!validation.valid) {
      this.addError(validation.error)
      return { success: false, error: validation.error }
    }

    // Atualiza o modelo primeiro
    this.model.setActiveItem(itemId)
    this.clearErrors()

    // Navega via router service se disponível
    if (this.routerService && validation.item.route) {
      try {
        const routeResult = this.routerService.navigateTo(validation.item.route)
        // Handle the case where routeResult is undefined or doesn't have success property
        if (routeResult && routeResult.success === false) {
          this.addError('Erro na navegação')
          return { success: false, error: 'Erro na navegação' }
        }

        // If routeResult is undefined or doesn't have success property, assume success
        // This maintains backward compatibility with your current router implementation
      } catch (error) {
        this.addError(`Erro na navegação: ${  error.message}`)
        return { success: false, error: `Erro na navegação: ${  error.message}` }
      }
    }

    return {
      success: true,
      item: validation.item,
      route: validation.item.route,
    }
  }
  /**
   * Navega diretamente para uma rota específica
   * @param {string} route - Rota de destino
   * @returns {Object} Resultado da navegação
   */
  navigateToRoute = route => {
    if (!this.routerService) {
      this.addError('Router service não disponível')
      return { success: false, error: 'Router service não disponível' }
    }

    // Encontra o item do menu correspondente à rota
    const allItems = [...this.menuItems, ...this.userActions]
    const item = allItems.find(i => i.route === route)

    if (item) {
      // Valida se pode acessar o item
      const validation = this.model.validateMenuItem(item.id)
      if (!validation.valid) {
        this.addError(validation.error)
        return { success: false, error: validation.error }
      }

      this.model.setActiveItem(item.id)
    } else {
      this.addError(`Nenhum item do menu encontrado para rota ${route}`)
    }

    // Navega
    const result = this.routerService.navigateTo(route)
    this.clearErrors()

    return result
  }

  /**
   * Manipula mudanças de rota externas (browser back/forward)
   * @param {string} route - Nova rota
   */
  handleRouteChange = route => {
    const allItems = [...this.menuItems, ...this.userActions]

    let matchingItem = allItems.find(item => item.route === route)

    // Se não encontrou correspondência exata, tenta correspondência por padrão
    if (!matchingItem) {
      matchingItem = allItems.find(item => {
        if (!item.route) return false

        // Verifica se a rota do item tem parâmetros (contém :)
        if (item.route.includes(':')) {
          const pattern = item.route.replace(/:[^/]+/g, '[^/]+')
          const regex = new RegExp(`^${pattern}$`)
          const matches = regex.test(route)
          return matches
        }

        // Verifica se é uma rota base (ex: /imoveis pode corresponder a /imoveis/123)
        if (route.startsWith(`${item.route}/`) && item.route !== '/') {
          return true
        }

        return false
      })
    }

    if (matchingItem) {
      // Verifica se o item pode ser acessado
      const validation = this.model.validateMenuItem(matchingItem.id)

      if (validation.valid) {
        this.model.setActiveItem(matchingItem.id)
        this.clearErrors()
      } else {
        this.addError(`Item ${matchingItem.id} não pode ser acessado: ${validation.error}`)

        // Se não pode acessar, redireciona para home
        this.model.setActiveItem('home')
        if (this.routerService) {
          this.routerService.navigateTo('/')
        }
      }
    } else {
      this.addError(`Nenhum item do menu corresponde à rota ${route}`)

      // Para rotas que não correspondem a itens do menu, define um estado neutro
      // mas não redireciona (pode ser uma página válida que não está no menu)
      this.model.setActiveItem(null) // ou manter o atual sem mudança
      this.clearErrors()
    }
  }
  /**
   * Verifica se um item específico está ativo
   * @param {string} itemId - ID do item a verificar
   * @returns {boolean} Status de ativação do item
   */
  isItemActive = itemId => {
    const isActive = this.model.activeItem === itemId
    return isActive
  }

  /**
   * Verifica se uma rota está ativa
   * @param {string} route - Rota a verificar
   * @returns {boolean} Status de ativação da rota
   */
  isRouteActive = route => {
    return this.routerService?.route === route
  }

  /**
   * Atualiza o estado de autenticação e redireciona se necessário
   * @param {boolean} isAuthenticated - Novo estado de autenticação
   * @returns {Object} Resultado da operação
   */
  setAuthentication = isAuthenticated => {
    const wasAuthenticated = this.model.isAuthenticated
    this.model.setAuthenticationStatus(isAuthenticated)

    // Se perdeu autenticação e está em página protegida, redireciona
    if (wasAuthenticated && !isAuthenticated) {
      const currentItem = this.model.getItemById(this.activeItem)
      if (currentItem && currentItem.requiresAuth) {
        this.navigateToItem('home')
      }
    }

    return { success: true, changed: wasAuthenticated !== isAuthenticated }
  }

  /**
   * Realiza o logout do usuário e redireciona para home
   * @returns {Object} Resultado da operação
   */
  logout = () => {
    const wasAuthenticated = this.model.isAuthenticated

    // Limpar o token JWT do localStorage
    localStorage.removeItem('jwtToken')

    // Atualizar estado de autenticação
    this.model.setAuthenticationStatus(false)

    // Forçar redirecionamento para home e recarregar a página
    window.location.href = '/'

    return { success: true, changed: wasAuthenticated }
  }

  /**
   * Retorna um snapshot do estado atual para uso em hooks
   * @returns {Object} Estado atual do menu
   */
  getSnapshot() {
    return {
      menuItems: this.menuItems,
      userActions: this.userActions,
      activeItem: this.activeItem,
      currentRoute: this.currentRoute,
      isAuthenticated: this.isAuthenticated,
      hasErrors: this.hasErrors,
      errorMessages: this.errorMessages,
      isMobileMenuOpen: this.isMobileMenuOpen,
    }
  }

  /**
   * Gerenciamento de Erros
   */
  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    if (this.errors.length > 0) {

      this.errors = []
    }
  }
}

export function useNavMenuViewModel(isAuthenticated = false, _variant = 'navigation') {
  const [viewModel] = useState(() => {
    const model = new NavMenuModel(isAuthenticated)
    return new NavMenuViewModel(model, routerService)
  })

  // eslint-disable-next-line no-unused-vars
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  const [snapshot, setSnapshot] = useState(() => viewModel.getSnapshot())
  const [isLoading, setIsLoading] = useState(false)

  const updateSnapshot = useCallback(() => {
    const newSnapshot = viewModel.getSnapshot()
    setSnapshot(newSnapshot)
  }, [viewModel])

  // Sincroniza estado de autenticação quando muda
  useEffect(() => {
    const result = viewModel.setAuthentication(isAuthenticated)

    if (result && result.changed) {
      updateSnapshot()
    }
  }, [isAuthenticated, viewModel, updateSnapshot])

  useEffect(() => {
    const handleRouteChange = ({ route, _previous }) => {
      viewModel.handleRouteChange(route)
      updateSnapshot()
    }

    const removeListener =
      routerService.addRouteChangeListener(handleRouteChange)

    // Inicializa com a rota atual e força uma verificação
    setTimeout(() => {
      const currentRoute = routerService.route
      viewModel.handleRouteChange(currentRoute)
      updateSnapshot()
    }, 0)

    return () => {
      if (typeof removeListener === 'function') {
        removeListener()
      } else {
        routerService.removeRouteChangeListener(handleRouteChange)
      }
    }
  }, [viewModel, updateSnapshot])

  const commands = useMemo(
    () => ({
      handleItemClick: _itemId => {
        setIsLoading(true)
        setTimeout(() => {
          updateSnapshot()
          setIsLoading(false)
        }, 100)
      },

      setAuthentication: isAuth => {

        const result = viewModel.setAuthentication(isAuth)
        if (result && result.changed) {
          updateSnapshot()
        }
        return result
      },

      logout: () => {
        const result = viewModel.logout()
        if (result && result.changed) {
          updateSnapshot()
        }
        return result
      },

      clearErrors: () => {
        viewModel.clearErrors()
        updateSnapshot()
      },

      navigateToRoute: route => {
        const result = viewModel.navigateToRoute(route)
        if (result && result.success) {
          updateSnapshot()
        }
        return result
      },

      goBack: () => {
        return routerService.goBack()
      },
    }),
    [viewModel, updateSnapshot]
  )


  return {
    // Estado observável
    menuItems: snapshot.menuItems,
    userActions: snapshot.userActions,
    activeItem: snapshot.activeItem,
    currentRoute: snapshot.currentRoute,
    isAuthenticated: snapshot.isAuthenticated,
    hasErrors: snapshot.hasErrors,
    errorMessages: snapshot.errorMessages,
    isLoading,
    isMobileMenuOpen: snapshot.isMobileMenuOpen,

    // Footer-specific data
    footerSections: viewModel.footerSections,
    getFooterItem: viewModel.getFooterItem.bind(viewModel),

    // Comandos
    ...commands,

    // Funções auxiliares
    isItemActive: itemId => {
      const isActive = viewModel.isItemActive(itemId)
      return isActive
    },

    isRouteActive: route => viewModel.isRouteActive(route),

    // Mobile menu controls
    toggleMobileMenu: () => {
      viewModel.toggleMobileMenu()
      updateSnapshot()
    },

    closeMobileMenu: () => {
      viewModel.closeMobileMenu()
      updateSnapshot()
    },
  }
}

export { NavMenuViewModel }
