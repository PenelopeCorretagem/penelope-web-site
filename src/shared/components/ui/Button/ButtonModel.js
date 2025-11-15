/**
 * ButtonModel - Representa o modelo de dados e comportamento de um botão.
 *
 * Responsável por armazenar e validar os atributos do botão,
 * como cor, tipo, rota, estado ativo e desabilitado.
 *
 * Implementa a camada **Model** do padrão **MVVM (Model–View–ViewModel)**.
 */
export class ButtonModel {
  /**
   * Cria uma nova instância do modelo de botão.
   * @param {string} [text=''] - Texto exibido no botão.
   * @param {string} [color='pink'] - Cor do botão.
   * @param {string} [type='button'] - Tipo do botão (button, submit, reset, link).
   * @param {string|null} [to=null] - Rota interna, usada se o tipo for 'link'.
   */
  constructor(text = '', color = 'pink', type = 'button', to = null) {
    this.text = text
    this.color = color
    this.type = type
    this.to = to
    this.active = false
    this.disabled = false
  }

  /** @static {string[]} Lista de cores válidas do botão. */
  static COLORS = ['pink', 'brown', 'white', 'border-white', 'soft-brown', 'gray', 'soft-gray', 'transparent']

  /** @static {string[]} Lista de tipos válidos do botão. */
  static TYPES = ['button', 'submit', 'reset', 'link']

  /**
   * Valida se o modelo do botão está em um estado coerente.
   * @returns {boolean} `true` se todas as validações forem aprovadas.
   */
  isValid() {
    return this.isValidColor() && this.isValidType() && this.hasValidRoute()
  }

  /**
   * Valida se a cor atual do botão é válida.
   * @returns {boolean}
   */
  isValidColor() {
    return ButtonModel.COLORS.includes(this.color)
  }

  /**
   * Valida se o tipo atual do botão é válido.
   * @returns {boolean}
   */
  isValidType() {
    return ButtonModel.TYPES.includes(this.type)
  }

  /**
   * Verifica se o botão possui uma rota válida (para tipo 'link').
   * @returns {boolean}
   */
  hasValidRoute() {
    return this.isLink() ? !!this.to : true
  }

  /**
   * Verifica se o botão representa um link interno.
   * @returns {boolean}
   */
  isLink() {
    return this.type === 'link'
  }

  /**
   * Atualiza a cor do botão, validando o valor recebido.
   * @param {string} newColor - Nova cor.
   * @throws {Error} Se a cor não estiver entre as válidas.
   */
  updateColor(newColor) {
    if (!ButtonModel.COLORS.includes(newColor)) {
      throw new Error(`Invalid color. Must be one of: ${ButtonModel.COLORS.join(', ')}`)
    }
    this.color = newColor
  }

  /**
   * Atualiza o texto exibido no botão.
   * @param {string} newText - Novo texto.
   */
  updateText(newText) {
    this.text = newText
  }

  /**
   * Define o tipo do botão.
   * @param {string} newType - Novo tipo (button, submit, reset, link).
   * @throws {Error} Se o tipo for inválido.
   */
  setType(newType) {
    if (!ButtonModel.TYPES.includes(newType)) {
      throw new Error(`Invalid type. Must be one of: ${ButtonModel.TYPES.join(', ')}`)
    }
    this.type = newType
  }

  /**
   * Define a rota associada (para botões do tipo link).
   * @param {string|null} newTo - Caminho de destino.
   */
  setTo(newTo) {
    this.to = newTo
  }

  /**
   * Alterna o estado de ativo/inativo do botão.
   */
  toggle() {
    this.active = !this.active
  }

  /**
   * Define se o botão está desabilitado.
   * @param {boolean} disabled - Novo estado de desabilitação.
   */
  setDisabled(disabled) {
    this.disabled = disabled
  }
}
