import { RouterModel } from '@routes/RouterModel'

/**
 * NavMenuModel manages navigation menu items, user actions, and footer links
 * dynamically based on authentication status. It integrates with RouterModel
 * to generate route-aware menu configurations for different sections of the application.
 *
 * @class
 *
 * @param {boolean} [isAuthenticated=false] - Indicates whether the current user is authenticated.
 *
 * @property {boolean} isAuthenticated - Tracks user authentication status.
 * @property {boolean} isMobileMenuOpen - Controls the visibility of the mobile navigation menu.
 * @property {RouterModel} routerModel - Instance of RouterModel providing route paths.
 *
 * @example
 * const navMenu = new NavMenuModel(true);
 * const menuItems = navMenu.getMenuItems();
 * const userActions = navMenu.getUserActions();
 */
export class NavMenuModel {
  constructor(isAuthenticated = false) {
    this.isAuthenticated = isAuthenticated
    this.isMobileMenuOpen = false
    this.routerModel = RouterModel.getInstance()
  }

  // Métodos privados para configuração de items
  #createMenuItem(config) {
    return {
      requiresAuth: false,
      ...config
    }
  }

  #createUserAction(config) {
    return {
      requiresAuth: false,
      shape: 'circle',
      iconOnly: true,
      ...config
    }
  }

  // Configuração de menu items
  #getPublicMenuItems() {
    const routes = this.routerModel.getAllRoutes()

    return [
      this.#createMenuItem({
        id: 'home',
        label: 'Home',
        icon: 'House',
        route: routes.HOME,
      }),
      this.#createMenuItem({
        id: 'properties',
        label: 'Imóveis',
        icon: 'Search',
        route: routes.PROPERTIES,
      }),
      this.#createMenuItem({
        id: 'about',
        label: 'Sobre',
        route: routes.ABOUT,
      }),
      this.#createMenuItem({
        id: 'contacts',
        label: 'Contatos',
        route: routes.CONTACTS,
      }),
    ]
  }

  #getAuthenticatedMenuItems() {
    const routes = this.routerModel.getAllRoutes()

    return [
      this.#createMenuItem({
        id: 'schedule',
        label: 'Agenda',
        route: routes.SCHEDULE,
        requiresAuth: true,
      }),
    ]
  }

  #getGuestUserActions() {
    const routes = this.routerModel.getAllRoutes()

    return [
      this.#createUserAction({
        id: 'login',
        label: 'Login',
        icon: 'User',
        route: routes.LOGIN,
      }),
    ]
  }

  #getAuthenticatedUserActions() {
    const routes = this.routerModel.getAllRoutes()

    return [
      this.#createUserAction({
        id: 'profile',
        label: 'Perfil',
        icon: 'User',
        route: routes.PROFILE,
        requiresAuth: true,
      }),
      this.#createUserAction({
        id: 'settings',
        label: 'Configurações',
        icon: 'Settings',
        route: routes.SETTINGS,
        requiresAuth: true,
      }),
      this.#createUserAction({
        id: 'logout',
        label: 'Logout',
        icon: 'LogOut',
        route: routes.HOME,
        requiresAuth: true,
        isLogoutAction: true,
      }),
    ]
  }

  // Métodos públicos
  /**
   * Returns the complete list of navigation menu items.
   * Combines public items with authenticated-only items if the user is logged in.
   *
   * @returns {Array<Object>} List of menu items.
   *
   * @example
   * const items = navMenu.getMenuItems();
   * // → [{ id: 'home', label: 'Home', ... }, { id: 'schedule', label: 'Agenda', ... }]
   */
  getMenuItems() {
    const publicItems = this.#getPublicMenuItems()
    const authItems = this.isAuthenticated ? this.#getAuthenticatedMenuItems() : []
    return [...publicItems, ...authItems]
  }

  /**
   * Returns available user actions based on authentication status.
   * Includes login for guests or profile/settings/logout for authenticated users.
   *
   * @returns {Array<Object>} List of user action items.
   *
   * @example
   * const actions = navMenu.getUserActions();
   * // → [{ id: 'login', label: 'Login', ... }] or [{ id: 'profile', label: 'Perfil', ... }]
   */
  getUserActions() {
    return this.isAuthenticated
      ? this.#getAuthenticatedUserActions()
      : this.#getGuestUserActions()
  }

  /**
   * Updates the authentication state and modifies available menu items accordingly.
   *
   * @param {boolean} isAuthenticated - New authentication status.
   *
   * @example
   * navMenu.setAuthenticationStatus(true);
   */
  setAuthenticationStatus(isAuthenticated) {
    this.isAuthenticated = isAuthenticated
  }

  /**
   * Toggles the visibility of the mobile navigation menu.
   *
   * @example
   * navMenu.toggleMobileMenu();
   */
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  /**
   * Closes the mobile navigation menu by setting its state to false.
   *
   * @example
   * navMenu.closeMobileMenu();
   */
  closeMobileMenu() {
    this.isMobileMenuOpen = false
  }

  /**
   * Returns grouped footer sections (Geral, Vendas, Acesso, Contatos),
   * each containing its respective set of links.
   * The content adapts based on authentication status.
   *
   * @returns {Object} Footer sections object.
   * @returns {Array<Object>} return.geral - General navigation links.
   * @returns {Array<Object>} return.vendas - Sales-related links.
   * @returns {Array<Object>} return.acesso - Access and authentication links.
   * @returns {Array<Object>} return.contatos - Contact and social media links.
   *
   * @example
   * const footer = navMenu.getFooterSections();
   * console.log(footer.vendas);
   * // → [{ id: 'properties', text: 'Imóveis', to: '/properties' }, ...]
   */
  getFooterSections() {
    return {
      geral: this.#getGeneralFooterLinks(),
      vendas: this.#getSalesFooterLinks(),
      acesso: this.#getAccessFooterLinks(),
      contatos: this.#getContactFooterLinks()
    }
  }

  #getGeneralFooterLinks() {
    const routes = this.routerModel.getAllRoutes()

    const links = [
      { id: 'home', text: 'Home', to: routes.HOME },
      { id: 'about', text: 'Sobre', to: routes.ABOUT }
    ]

    if (this.isAuthenticated) {
      links.push(
        { id: 'profile', text: 'Perfil', to: routes.PROFILE },
        { id: 'settings', text: 'Configurações', to: routes.SETTINGS }
      )
    }

    return links.map(link => ({ ...link, onClick: () => {} }))
  }

  #getSalesFooterLinks() {
    const routes = this.routerModel.getAllRoutes()

    const links = [
      { id: 'properties', text: 'Imóveis', to: routes.PROPERTIES }
    ]

    if (this.isAuthenticated) {
      links.push({ id: 'schedule', text: 'Agenda', to: routes.SCHEDULE })
    }

    links.push({ id: 'chatbot', text: 'Chatbot', to: '#', disabled: true })

    return links.map(link => ({ ...link, onClick: () => {} }))
  }

  #getAccessFooterLinks() {
    const routes = this.routerModel.getAllRoutes()

    return [
      { id: 'login', text: 'Acessar', to: routes.LOGIN, onClick: () => {} },
      { id: 'register', text: 'Cadastrar', to: routes.REGISTER, onClick: () => {} }
    ]
  }

  #getContactFooterLinks() {
    return [
      { id: 'email', text: 'E-mail', to: 'mailto:contato@penelopeimoveis.com', onClick: () => {} },
      { id: 'facebook', text: 'Facebook', to: '#', onClick: () => {} },
      { id: 'whatsapp', text: 'WhatsApp', to: '#', onClick: () => {} },
      { id: 'instagram', text: 'Instagram', to: '#', onClick: () => {} }
    ]
  }
}
