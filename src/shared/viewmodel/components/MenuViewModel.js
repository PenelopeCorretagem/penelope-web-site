/**
 * MenuViewModel - Gerencia a lógica do menu e navegação da aplicação
 * Integra com RouterService para navegação e controle de estado do menu
 */
export class MenuViewModel {
  /**
   * @param {Object} model - MenuModel para gerenciar estado do menu
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
   * Navega para um item específico do menu
   * @param {string} itemId - ID do item do menu
   * @returns {Object} Resultado da navegação
   */
  navigateToItem = itemId => {
    console.log(`📍 MenuViewModel: navegando para item ${itemId}`)

    // Valida se o item pode ser acessado
    const validation = this.model.validateMenuItem(itemId)

    if (!validation.valid) {
      console.error(`❌ Validação falhou: ${validation.error}`)
      this.addError(validation.error)
      return { success: false, error: validation.error }
    }

    // Atualiza o modelo primeiro
    this.model.setActiveItem(itemId)
    this.clearErrors()

    console.log(`✅ Item ${itemId} validado, rota: ${validation.item.route}`)

    // Navega via router service se disponível
    if (this.routerService && validation.item.route) {
      const routeResult = this.routerService.navigateTo(validation.item.route)

      console.log(`🔀 Resultado da navegação:`, routeResult)

      if (!routeResult.success) {
        this.addError('Erro na navegação')
        return { success: false, error: 'Erro na navegação' }
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
    console.log(`📍 MenuViewModel: navegando diretamente para rota ${route}`)

    if (!this.routerService) {
      this.addError('Router service não disponível')
      return { success: false, error: 'Router service não disponível' }
    }

    // Encontra o item do menu correspondente à rota
    const allItems = [...this.menuItems, ...this.userActions]
    const item = allItems.find(i => i.route === route)

    if (item) {
      console.log(`📌 Item encontrado para rota: ${item.id}`)

      // Valida se pode acessar o item
      const validation = this.model.validateMenuItem(item.id)
      if (!validation.valid) {
        this.addError(validation.error)
        return { success: false, error: validation.error }
      }

      this.model.setActiveItem(item.id)
    } else {
      console.log(`⚠️ Nenhum item do menu encontrado para rota ${route}`)
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
    console.log(`🔄 MenuViewModel: lidando com mudança de rota para ${route}`)

    // Encontra o item correspondente à rota atual
    const allItems = [...this.menuItems, ...this.userActions]
    const matchingItem = allItems.find(item => item.route === route)

    if (matchingItem) {
      console.log(`📌 Item encontrado: ${matchingItem.id}`)

      // Verifica se o item pode ser acessado
      const validation = this.model.validateMenuItem(matchingItem.id)

      if (validation.valid) {
        this.model.setActiveItem(matchingItem.id)
        this.clearErrors()
        console.log(`✅ Item ${matchingItem.id} ativado`)
      } else {
        console.log(
          `❌ Item ${matchingItem.id} não pode ser acessado: ${validation.error}`
        )

        // Se não pode acessar, redireciona para home
        this.model.setActiveItem('home')
        if (this.routerService) {
          this.routerService.navigateTo('/')
        }
      }
    } else {
      console.log(`⚠️ Nenhum item do menu corresponde à rota ${route}`)
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
    console.log(`🎯 Item ${itemId} está ativo: ${isActive}`)
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

    console.log(
      `🔐 Autenticação mudou: ${wasAuthenticated} -> ${isAuthenticated}`
    )

    // Se perdeu autenticação e está em página protegida, redireciona
    if (wasAuthenticated && !isAuthenticated) {
      const currentItem = this.model.getItemById(this.activeItem)
      if (currentItem && currentItem.requiresAuth) {
        console.log(`🚫 Item atual requer auth, redirecionando para home`)
        this.navigateToItem('home')
      }
    }

    return { success: true, changed: wasAuthenticated !== isAuthenticated }
  }

  /**
   * Realiza o logout do usuário e redireciona se necessário
   * @returns {Object} Resultado da operação
   */
  logout = () => {
    const wasAuthenticated = this.model.isAuthenticated
    this.model.setAuthenticationStatus(false)

    console.log(`👋 Logout realizado`)

    // Se estava em página que requer auth, volta para home
    const currentItem = this.model.getItemById(this.activeItem)
    if (currentItem && currentItem.requiresAuth) {
      this.navigateToItem('home')
    }

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
    }
  }

  /**
   * Gerenciamento de Erros
   */
  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
      console.error(`🚨 Erro adicionado: ${message}`)
    }
  }

  clearErrors() {
    if (this.errors.length > 0) {
      console.log(`🧹 Limpando ${this.errors.length} erro(s)`)
      this.errors = []
    }
  }
}
