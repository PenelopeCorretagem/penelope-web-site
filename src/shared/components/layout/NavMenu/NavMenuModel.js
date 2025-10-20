import { RouterModel } from '@routes/RouterModel'

export class NavMenuModel {
  constructor(isAuthenticated = false) {
    this.isAuthenticated = isAuthenticated
    this.isMobileMenuOpen = false
    this.routerModel = RouterModel.getInstance()
  }

  getBaseMenuItems() {
    const routes = this.routerModel.getMenuRoutes()

    return [
      {
        id: 'home',
        label: 'Home',
        icon: 'House',
        variant: 'default',
        route: routes.HOME,
        requiresAuth: false,
      },
      {
        id: 'properties',
        label: 'Imóveis',
        icon: 'Search',
        variant: 'destac',
        route: routes.PROPERTIES,
        requiresAuth: false,
      },
      {
        id: 'about',
        label: 'Sobre',
        variant: 'default',
        route: routes.ABOUT,
        requiresAuth: false,
      },
      {
        id: 'contacts',
        label: 'Contatos',
        variant: 'default',
        route: routes.CONTACTS,
        requiresAuth: false,
      },
    ]
  }

  getAuthMenuItems() {
    const routes = this.routerModel.getMenuRoutes()

    return [
      {
        id: 'schedule',
        label: 'Agenda',
        variant: 'default',
        route: routes.SCHEDULE,
        requiresAuth: true,
      },
    ]
  }

  getUserActions() {
    const userRoutes = this.routerModel.getUserActionRoutes()
    const authRoutes = this.routerModel.getAuthRoutes()

    if (!this.isAuthenticated) {
      return [
        {
          id: 'login',
          label: 'Login',
          icon: 'User',
          variant: 'destac',
          shape: 'circle',
          route: authRoutes.LOGIN,
          requiresAuth: false,
          iconOnly: true,
        },
      ]
    } else {
      return [
        {
          id: 'profile',
          label: 'Perfil',
          icon: 'User',
          variant: 'destac',
          shape: 'circle',
          route: userRoutes.PROFILE,
          requiresAuth: true,
          iconOnly: true,
        },
        {
          id: 'settings',
          label: 'Configurações',
          icon: 'Settings',
          variant: 'destac',
          shape: 'circle',
          route: userRoutes.SETTINGS,
          requiresAuth: true,
          iconOnly: true,
        },
        {
          id: 'logout',
          label: 'Logout',
          icon: 'LogOut',
          variant: 'default',
          shape: 'circle',
          route: '/',
          requiresAuth: true,
          iconOnly: true,
        },
      ]
    }
  }

  getMenuItems() {
    const baseItems = this.getBaseMenuItems()
    const authItems = this.isAuthenticated ? this.getAuthMenuItems() : []
    return [...baseItems, ...authItems]
  }

  setAuthenticationStatus(isAuthenticated) {
    this.isAuthenticated = isAuthenticated
  }

  getFooterSections() {
    const routes = this.routerModel.getMenuRoutes()
    const authRoutes = this.routerModel.getAuthRoutes()
    const userRoutes = this.routerModel.getUserActionRoutes()

    const geral = [
      {
        id: 'home',
        text: 'Home',
        to: routes.HOME,
        onClick: () => {}
      },
      {
        id: 'about',
        text: 'Sobre',
        to: routes.ABOUT,
        onClick: () => {}
      }
    ]

    if (this.isAuthenticated) {
      geral.push(
        {
          id: 'profile',
          text: 'Perfil',
          to: userRoutes.PROFILE,
          onClick: () => {}
        },
        {
          id: 'settings',
          text: 'Configurações',
          to: userRoutes.SETTINGS,
          onClick: () => {}
        }
      )
    }

    const vendas = [
      {
        id: 'properties',
        text: 'Imóveis',
        to: routes.PROPERTIES,
        onClick: () => {}
      }
    ]

    if (this.isAuthenticated) {
      vendas.push({
        id: 'schedule',
        text: 'Agenda',
        to: routes.SCHEDULE,
        onClick: () => {}
      })
    }

    vendas.push({
      id: 'chatbot',
      text: 'Chatbot',
      to: '#',
      disabled: true,
      onClick: () => {}
    })

    const acesso = [
      {
        id: 'login',
        text: 'Acessar',
        to: authRoutes.LOGIN,
        onClick: () => {}
      },
      {
        id: 'register',
        text: 'Cadastrar',
        to: authRoutes.REGISTER,
        onClick: () => {}
      }
    ]

    return {
      geral,
      vendas,
      acesso,
      contatos: [
        {
          id: 'email',
          text: 'E-mail',
          to: 'mailto:contato@penelopeimoveis.com',
          onClick: () => {}
        },
        {
          id: 'facebook',
          text: 'Facebook',
          to: '#',
          onClick: () => {}
        },
        {
          id: 'whatsapp',
          text: 'WhatsApp',
          to: '#',
          onClick: () => {}
        },
        {
          id: 'instagram',
          text: 'Instagram',
          to: '#',
          onClick: () => {}
        }
      ]
    }
  }
}
