// BackButtonModel.js
export class BackButtonModel {
  constructor({
    size = 40,
    disabled = false,
    ariaLabel = 'Voltar para a página anterior',
  } = {}) {
    this.size = size
    this.disabled = disabled
    this.ariaLabel = ariaLabel
  }

  setDisabled(disabled) {
    this.disabled = disabled
  }
}
