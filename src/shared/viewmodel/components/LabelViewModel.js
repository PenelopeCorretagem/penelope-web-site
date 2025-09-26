import { BaseElementViewModel } from './BaseElementViewModel'
import { LabelModel } from '../../model/components/LabelModel'

/**
 * LabelViewModel - Gerencia a lógica e apresentação de labels
 * Estende BaseElementViewModel para funcionalidades base de UI
 */
export class LabelViewModel extends BaseElementViewModel {
  /**
   * @param {LabelModel} model Modelo do label
   * @param {Object} config Configuração adicional
   * @param {string} config.className Classes CSS adicionais
   */
  constructor(model = new LabelModel(), { className = '' } = {}) {
    super({
      children: model.text || 'Label',
      width: 'fit',
      shape: 'square',
      disabled: true,
      as: 'span',
      className: LabelViewModel._buildClassName(
        model.variant,
        model.size,
        className
      ),
    })

    this.model = model
    this.errors = []
    this.originalClassName = className
  }

  /**
   * Constrói classes CSS baseadas na variante e tamanho
   * @param {string} variant Variante visual do label
   * @param {string} size Tamanho do label
   * @param {string} className Classes adicionais
   */
  static _buildClassName(variant, size, className) {
    const variants = {
      pink: 'bg-brand-pink text-brand-white',
      softPink: 'bg-brand-soft-pink text-brand-white',
      brown: 'bg-brand-brown text-brand-white',
      softBrown: 'bg-brand-soft-brown text-brand-white',
      gray: 'bg-brand-white-tertiary text-brand-black',
    }

    const sizes = {
      small: 'text-[12px] p-button-y',
      medium: 'text-[16px] p-button',
      large: 'text-[20px] p-button-x',
    }

    const baseClasses = 'inline-block rounded font-medium '

    return [
      baseClasses,
      variants[variant] || variants.pink,
      sizes[size] || sizes.medium,
      className,
    ]
      .filter(Boolean)
      .join(' ')
  }

  // Getters e métodos com documentação
  /**
   * @returns {string} Texto a ser exibido
   */
  get displayText() {
    return this.model.text || 'Label'
  }

  get variant() {
    return this.model.variant
  }

  get size() {
    return this.model.size
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  updateText = newText => {
    try {
      this.model.updateText(newText)
      // Atualiza o children e className
      this.children = this.model.text
      this.className = LabelViewModel._buildClassName(
        this.model.variant,
        this.model.size,
        this.originalClassName
      )
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  updateVariant = newVariant => {
    try {
      this.model.updateVariant(newVariant)
      // Atualiza a className com a nova variant
      this.className = LabelViewModel._buildClassName(
        this.model.variant,
        this.model.size,
        this.originalClassName
      )
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  getSpecificProps() {
    return {
      role: 'status',
      'aria-label': this.displayText,
    }
  }

  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }
}
