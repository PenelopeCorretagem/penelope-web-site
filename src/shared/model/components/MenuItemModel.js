export class MenuItemModel {
  constructor({
    text = '',
    variant = 'default',
    active = false,
    href = null,
    to = null,
    external = false,
    disabled = false,
    icon = null,
    iconOnly = false,
  } = {}) {
    this.text = text
    this.variant = variant
    this.active = active
    this.href = href
    this.to = to
    this.external = external
    this.disabled = disabled
    this.icon = icon
    this.iconOnly = iconOnly
  }

  static VARIANTS = ['default', 'destac']

  isValid() {
    return this.isValidVariant() && this.hasValidNavigation()
  }

  isValidVariant() {
    return MenuItemModel.VARIANTS.includes(this.variant)
  }

  hasValidNavigation() {
    return Boolean(this.href || this.to) || (!this.href && !this.to)
  }

  isExternalLink() {
    return Boolean(this.href && this.external)
  }

  isInternalLink() {
    return Boolean(this.to)
  }

  isButton() {
    return !this.href && !this.to
  }

  updateVariant(newVariant) {
    if (!MenuItemModel.VARIANTS.includes(newVariant)) {
      throw new Error(
        `Invalid variant. Must be one of: ${MenuItemModel.VARIANTS.join(', ')}`
      )
    }
    this.variant = newVariant
  }

  updateText(newText) {
    if (typeof newText !== 'string') {
      throw new Error('Text must be a string')
    }
    this.text = newText
  }

  toggle() {
    this.active = !this.active
  }

  setDisabled(disabled) {
    this.disabled = disabled
  }

  setNavigation({ href, to, external }) {
    this.href = href || null
    this.to = to || null
    this.external = external || false
  }
}
