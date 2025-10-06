/**
 * FooterModel - Gerencia estado e lógica do footer da aplicação
 * Controla copyright, configurações visuais e integração com menu
 */
export class FooterModel {
  constructor(isAuthenticated = false, logoSize = 40, logoColorScheme = 'pink') {
    this.isAuthenticated = isAuthenticated
    this.logoSize = logoSize
    this.logoColorScheme = logoColorScheme
    this.currentYear = new Date().getFullYear()
  }

  // Informações do copyright
  getCopyrightInfo() {
    return {
      year: this.currentYear,
      company: 'Penélope Imóveis',
      text: `© ${this.currentYear} Penélope Imóveis | Todos os direitos reservados.`
    }
  }

  // Configurações do logo
  getLogoConfig() {
    return {
      size: this.logoSize,
      colorScheme: this.logoColorScheme
    }
  }

  // Atualiza estado de autenticação
  setAuthenticationStatus(isAuthenticated) {
    const wasAuthenticated = this.isAuthenticated
    this.isAuthenticated = isAuthenticated

    return {
      changed: wasAuthenticated !== isAuthenticated,
      wasAuthenticated,
      isAuthenticated
    }
  }

  // Atualiza configurações do logo
  setLogoConfig(size, colorScheme) {
    const oldSize = this.logoSize
    const oldColorScheme = this.logoColorScheme

    this.logoSize = size
    this.logoColorScheme = colorScheme

    return {
      changed: oldSize !== size || oldColorScheme !== colorScheme,
      oldConfig: { size: oldSize, colorScheme: oldColorScheme },
      newConfig: { size, colorScheme }
    }
  }

  // Getters
  get authenticated() {
    return this.isAuthenticated
  }

  get year() {
    return this.currentYear
  }
}
