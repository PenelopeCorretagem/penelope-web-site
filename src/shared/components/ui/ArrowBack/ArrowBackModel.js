/**
 * ArrowBackModel - Modelo simples para botão de voltar
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

  setDisabled(disabled) {
    this.disabled = disabled
  }
}
