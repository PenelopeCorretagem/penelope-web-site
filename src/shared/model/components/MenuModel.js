export class MenuModel {
  constructor() {
    this.menuItems = [
      { id: 'home', label: 'Home', icon: 'House', variant: 'default', route: '/' },
      { id: 'properties', label: 'Imóveis', icon: 'Search', variant: 'destac', route: '/imoveis' },
      { id: 'about', label: 'Sobre', variant: 'default', route: '/sobre' },
      { id: 'contacts', label: 'Contatos', variant: 'default', route: '/contatos' },
      { id: 'schedule', label: 'Agenda', variant: 'default', route: '/agenda' },
    ]

    this.userActions = [
      { id: 'profile', icon: 'User', variant: 'destac', shape: 'circle', route: '/perfil' },
      { id: 'settings', icon: 'Settings', variant: 'destac', shape: 'circle', route: '/configuracoes' },
    ]
  }

  getMenuItems() {
    return this.menuItems
  }

  getUserActions() {
    return this.userActions
  }

  getItemById(id) {
    return [...this.menuItems, ...this.userActions].find(item => item.id === id)
  }
}
