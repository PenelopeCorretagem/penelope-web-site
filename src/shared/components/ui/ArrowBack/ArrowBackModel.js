/**
 * ArrowBackModel - Modelo simples para botão de voltar
 * Gerencia estado e comportamento do botão de navegação
 */
export class ArrowBackModel {
  constructor({
    size = 40,
    disabled = false,
    ariaLabel = 'Voltar para página anterior',
  } = {}) {
    this.size = size
    this.disabled = disabled
    this.ariaLabel = ariaLabel
  }

  // Getters
  get isDisabled() {
    return this.disabled
  }

  get iconSize() {
    return this.size
  }

  get accessibilityLabel() {
    return this.ariaLabel
  }

  // Métodos de atualização
  setDisabled(disabled) {
    this.disabled = disabled
    return true
  }

  setSize(size) {
    this.size = size
    return true
  }

  setAriaLabel(label) {
    this.ariaLabel = label
    return true
  }

  // Serialização
  toJSON() {
    return {
      size: this.size,
      disabled: this.disabled,
      ariaLabel: this.ariaLabel,
      isDisabled: this.isDisabled,
      iconSize: this.iconSize,
      accessibilityLabel: this.accessibilityLabel,
    }
  }
}
