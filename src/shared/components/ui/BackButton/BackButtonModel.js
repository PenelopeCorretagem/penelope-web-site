// BackButtonModel.js
export class BackButtonModel {
  constructor({
    size = 40,
    disabled = false,
    ariaLabel = 'Voltar para a página anterior',
    mode = 'icon', // 'icon' or 'text'
    text = 'Voltar',
  } = {}) {
    this.size = size
    this.disabled = disabled
    this.ariaLabel = ariaLabel
    this.mode = mode
    this.text = text
  }

  setDisabled(disabled) {
    this.disabled = disabled
  }

  setMode(mode) {
    this.mode = mode
  }

  setText(text) {
    this.text = text
  }
}
