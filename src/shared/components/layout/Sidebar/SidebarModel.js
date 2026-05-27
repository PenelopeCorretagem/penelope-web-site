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
  constructor(isManagementUser = false, userRole = 'CLIENTE') {
    this.isManagementUser = isManagementUser
    this.userRole = userRole
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
        roles: ['CLIENTE', 'CORRETOR', 'ADMINISTRADOR']
      },
      {
        id: 'appointmentsReport',
        text: 'Relatório de Agendamentos',
        icon: 'BarChart2',
        path: routes.SCHEDULE_REPORT,
        roles: ['ADMINISTRADOR'],
        children: [
          {
            id: 'appointmentsReportDashboard',
            text: 'Dashboard',
            icon: 'BarChart2',
            path: routes.SCHEDULE_REPORT_DASHBOARD,
            roles: ['ADMINISTRADOR'],
          },
          {
            id: 'appointmentsReportRecords',
            text: 'Registros',
            icon: 'FileText',
            path: routes.SCHEDULE_REPORT_RECORDS,
            roles: ['ADMINISTRADOR'],
          },
        ],
      },
      {
        id: 'properties',
        text: 'Gerenciar Imóveis',
        icon: 'Building2',
        path: routes.ADMIN_PROPERTIES,
        roles: ['CORRETOR', 'ADMINISTRADOR']
      },
      {
        id: 'amenities',
        text: 'Diferenciais',
        icon: 'Star',
        path: routes.ADMIN_AMENITIES,
        roles: ['CORRETOR', 'ADMINISTRADOR']
      },
      {
        id: 'users',
        text: 'Usuários',
        icon: 'Users',
        path: routes.ADMIN_USERS,
        roles: ['CORRETOR', 'ADMINISTRADOR']
      },
      {
        id: 'profile',
        text: 'Meu Perfil',
        icon: 'User',
        path: this.isManagementUser ? routes.ADMIN_PROFILE : routes.PROFILE,
        roles: ['CLIENTE', 'CORRETOR', 'ADMINISTRADOR']
      },
      {
        id: 'account',
        text: 'Minha Conta',
        icon: 'Lock',
        path: this.isManagementUser ? routes.ADMIN_ACCOUNT : routes.ACCOUNT,
        roles: ['CLIENTE', 'CORRETOR', 'ADMINISTRADOR']
      }
    ]
  }

  /**
   * Retorna itens de menu filtrados por permissão
   * @returns {Array} Lista de itens do menu
   */
  getMenuItems() {
    const allItems = this.#getAllMenuItems()

    return allItems.filter(item => item.roles.includes(this.userRole))
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
  setAdminStatus(isManagementUser) {
    this.isManagementUser = isManagementUser
  }

  setUserRole(userRole) {
    this.userRole = userRole
  }
}
