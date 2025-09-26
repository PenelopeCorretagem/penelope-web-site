/**
 * BaseElementViewModel - Classe base para elementos de UI
 * Fornece funcionalidades comuns de estilização e comportamento
 */
export class BaseElementViewModel {
  /**
   * @param {Object} config Configuração do elemento
   * @param {Node} config.children Conteúdo do elemento
   * @param {('full'|'fit')} config.width Largura do elemento
   * @param {('square'|'circle')} config.shape Forma do elemento
   * @param {string} config.className Classes CSS adicionais
   * @param {boolean} config.disabled Estado desabilitado
   * @param {string|Component} config.as Elemento/componente a ser renderizado
   */
  constructor({
    children = null,
    width = 'fit',
    shape = 'square',
    className = '',
    disabled = false,
    as = 'div',
  } = {}) {
    this.children = children
    this.width = width
    this.shape = shape
    this.className = className
    this.disabled = disabled
    this.as = as

    this.baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-title-family font-medium',
      'text-sm md:text-base lg:text-lg',
      'leading-none',
      'uppercase',
      'transition-colors duration-200',
      'p-button',
    ]

    this.validShapes = ['square', 'circle']
    this.validWidths = ['full', 'fit']
  }

  /**
   * Calcula as classes CSS baseadas na forma
   * @throws {Error} Se a forma for inválida
   */
  get shapeClass() {
    if (!this.validShapes.includes(this.shape)) {
      throw new Error(
        `Invalid shape "${this.shape}". Valid: ${this.validShapes.join(', ')}`
      )
    }

    return {
      circle: 'rounded-full p-button-y',
      square: 'rounded-sm p-button',
    }[this.shape]
  }

  /**
   * Calcula as classes CSS baseadas na largura
   * @throws {Error} Se a largura for inválida
   */
  get widthClass() {
    if (!this.validWidths.includes(this.width)) {
      throw new Error(
        `Invalid width "${this.width}". Valid: ${this.validWidths.join(', ')}`
      )
    }

    return {
      full: 'w-full',
      fit: 'w-fit',
    }[this.width]
  }

  /**
   * Retorna classes CSS para estado desabilitado
   */
  get disabledClass() {
    return this.disabled
      ? 'cursor-not-allowed pointer-events-none'
      : 'cursor-pointer'
  }

  /**
   * Combina todas as classes CSS
   * @returns {string} Classes CSS finais
   */
  get finalClassName() {
    return [
      this.baseClasses.join(' '),
      this.widthClass,
      this.disabledClass,
      this.shapeClass,
      this.className,
    ]
      .filter(Boolean)
      .join(' ')
  }
}
