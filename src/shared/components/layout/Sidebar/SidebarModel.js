import { RouterModel } from '@routes/RouterModel'

/**
 * SidebarModel - Gerencia itens do menu lateral e permissões
 *
 * RESPONSABILIDADES:
 * - Definir estrutura dos itens do menu
 * - Filtrar itens baseado em permissões (user/admin)
 * - Fornecer rotas corretas do RouterModel
 */
export class SidebarModel {
  constructor(isAdmin = false) {
    this.isAdmin = isAdmin
    this.routerModel = RouterModel.getInstance()
  }

  /**
   * Retorna todos os itens de menu possíveis
   * @private
   */
  #getAllMenuItems() {
    const routes = this.routerModel.getAllRoutes()

    return [
      {
        id: 'schedule',
        text: 'Agenda',
        icon: 'Calendar',
        path: routes.SCHEDULE,
        roles: ['CLIENTE', 'ADMINISTRADOR']
      },
      {
        id: 'properties',
        text: 'Imóveis',
        icon: 'Building2',
        path: routes.ADMIN_PROPERTIES,
        roles: ['ADMINISTRADOR']
      },
      {
        id: 'amenities',
        text: 'Diferenciais',
        icon: 'Star',
        path: routes.ADMIN_AMENITIES,
        roles: ['ADMINISTRADOR']
      },
      {
        id: 'users',
        text: 'Usuários',
        icon: 'Users',
        path: routes.ADMIN_USERS,
        roles: ['ADMINISTRADOR']
      },
      {
        id: 'profile',
        text: 'Meu Perfil',
        icon: 'User',
        path: this.isAdmin ? routes.ADMIN_PROFILE : routes.PROFILE,
        roles: ['CLIENTE', 'ADMINISTRADOR']
      },
      {
        id: 'account',
        text: 'Minha Conta',
        icon: 'Lock',
        path: this.isAdmin ? routes.ADMIN_ACCOUNT : routes.ACCOUNT,
        roles: ['CLIENTE', 'ADMINISTRADOR']
      }
    ]
  }

  /**
   * Retorna itens de menu filtrados por permissão
   * @returns {Array} Lista de itens do menu
   */
  getMenuItems() {
    const allItems = this.#getAllMenuItems()
    const userRole = this.isAdmin ? 'ADMINISTRADOR' : 'CLIENTE'

    return allItems.filter(item => item.roles.includes(userRole))
  }

  /**
   * Retorna a rota home baseado no RouterModel
   * @returns {string} Caminho para home
   */
  getHomeRoute() {
    return this.routerModel.getRoute('HOME')
  }

  /**
   * Atualiza status de admin
   * @param {boolean} isAdmin
   */
  setAdminStatus(isAdmin) {
    this.isAdmin = isAdmin
  }
}
