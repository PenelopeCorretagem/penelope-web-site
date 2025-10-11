/**
 * HeaderModel - Modelo de dados para o componente Header
 * Gerencia estado e validação do cabeçalho da aplicação
 */
export class HeaderModel {
  static LOGO_SIZES = {
    small: 32,
    medium: 40,
    large: 48,
    extraLarge: 56,
  }

  static COLOR_SCHEMES = {
    pink: 'pink',
    blue: 'blue',
    green: 'green',
    purple: 'purple',
    orange: 'orange',
  }

  static DEFAULTS = {
    logoSize: HeaderModel.LOGO_SIZES.medium,
    logoColorScheme: HeaderModel.COLOR_SCHEMES.pink,
    isAuthenticated: false,
    sticky: true,
    showShadow: true,
  }

  constructor({
    logoSize = HeaderModel.DEFAULTS.logoSize,
    logoColorScheme = HeaderModel.DEFAULTS.logoColorScheme,
    isAuthenticated = HeaderModel.DEFAULTS.isAuthenticated,
    sticky = HeaderModel.DEFAULTS.sticky,
    showShadow = HeaderModel.DEFAULTS.showShadow,
  } = {}) {
    this.logoSize = this.validateLogoSize(logoSize)
    this.logoColorScheme = this.validateColorScheme(logoColorScheme)
    this.isAuthenticated = Boolean(isAuthenticated)
    this.sticky = Boolean(sticky)
    this.showShadow = Boolean(showShadow)
  }

  // Validação
  validateLogoSize(size) {
    if (typeof size === 'number' && size > 0) {
      return size
    }

    if (typeof size === 'string' && HeaderModel.LOGO_SIZES[size]) {
      return HeaderModel.LOGO_SIZES[size]
    }

    return HeaderModel.DEFAULTS.logoSize
  }

  validateColorScheme(scheme) {
    if (typeof scheme === 'string' && HeaderModel.COLOR_SCHEMES[scheme]) {
      return scheme
    }

    return HeaderModel.DEFAULTS.logoColorScheme
  }

  // Getters
  get isValid() {
    return (
      this.logoSize > 0 &&
      HeaderModel.COLOR_SCHEMES[this.logoColorScheme] &&
      typeof this.isAuthenticated === 'boolean'
    )
  }

  get logoSizeClass() {
    const sizeMap = {
      [HeaderModel.LOGO_SIZES.small]: 'w-8 h-8',
      [HeaderModel.LOGO_SIZES.medium]: 'w-10 h-10',
      [HeaderModel.LOGO_SIZES.large]: 'w-12 h-12',
      [HeaderModel.LOGO_SIZES.extraLarge]: 'w-14 h-14',
    }

    return sizeMap[this.logoSize] || 'w-10 h-10'
  }

  // Métodos de atualização
  updateLogoSize(newSize) {
    const validatedSize = this.validateLogoSize(newSize)
    if (validatedSize !== this.logoSize) {
      this.logoSize = validatedSize
      return true
    }
    return false
  }

  updateColorScheme(newScheme) {
    const validatedScheme = this.validateColorScheme(newScheme)
    if (validatedScheme !== this.logoColorScheme) {
      this.logoColorScheme = validatedScheme
      return true
    }
    return false
  }

  updateAuthentication(isAuth) {
    const newAuth = Boolean(isAuth)
    if (newAuth !== this.isAuthenticated) {
      this.isAuthenticated = newAuth
      return true
    }
    return false
  }

  toggleSticky() {
    this.sticky = !this.sticky
    return this.sticky
  }

  toggleShadow() {
    this.showShadow = !this.showShadow
    return this.showShadow
  }

  // Métodos utilitários
  toJSON() {
    return {
      logoSize: this.logoSize,
      logoColorScheme: this.logoColorScheme,
      isAuthenticated: this.isAuthenticated,
      sticky: this.sticky,
      showShadow: this.showShadow,
      isValid: this.isValid,
    }
  }

  clone() {
    return new HeaderModel({
      logoSize: this.logoSize,
      logoColorScheme: this.logoColorScheme,
      isAuthenticated: this.isAuthenticated,
      sticky: this.sticky,
      showShadow: this.showShadow,
    })
  }

  equals(other) {
    if (!(other instanceof HeaderModel)) return false

    return (
      this.logoSize === other.logoSize &&
      this.logoColorScheme === other.logoColorScheme &&
      this.isAuthenticated === other.isAuthenticated &&
      this.sticky === other.sticky &&
      this.showShadow === other.showShadow
    )
  }
}
