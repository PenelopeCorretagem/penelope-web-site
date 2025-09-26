import { BaseElementViewModel } from './BaseElementViewModel'
import { ButtonModel } from '../../model/components/ButtonModel'

/**
 * ButtonViewModel - Gerencia a lógica e apresentação de botões
 * Estende BaseElementViewModel para funcionalidades base de UI
 */
export class ButtonViewModel extends BaseElementViewModel {
  /**
   * @param {ButtonModel} model Modelo do botão
   * @param {Object} config Configuração adicional
   * @param {string} config.width Largura do botão
   * @param {string} config.shape Forma do botão
   * @param {string} config.className Classes CSS adicionais
   * @param {Function} config.onClick Manipulador de clique
   */
  constructor(
    model = new ButtonModel(),
    { width = 'fit', shape = 'square', className = '', onClick } = {}
  ) {
    super({
      children: model.text,
      width,
      shape,
      disabled: model.disabled,
      as: 'button',
      className: ButtonViewModel._buildClassName(
        model.variant,
        model.active,
        className
      ),
    })

    this.model = model
    this.onClick = onClick
    this.errors = []
    this.type = this.model.type
  }

  /**
   * Constrói classes CSS baseadas na variante e estado
   * @param {string} variant Variante visual do botão
   * @param {boolean} active Estado de ativação
   * @param {string} className Classes adicionais
   */
  static _buildClassName(variant, active, className) {
    const variants = {
      pink: {
        base: 'bg-brand-pink text-brand-white',
        active: 'bg-brand-brown ring-2 ring-brand-accent',
        hover: 'hover:bg-brand-brown',
      },
      brown: {
        base: 'bg-brand-white-secondary text-brand-black',
        active: 'bg-brand-pink text-brand-white ring-2 ring-brand-accent',
        hover: 'hover:bg-brand-white-tertiary',
      },
      white: {
        base: 'bg-transparent border-2 border-brand-pink text-brand-pink',
        active: 'bg-brand-pink text-brand-white border-brand-pink',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
    }

    const variantStyles = variants[variant] || variants.primary
    const stateClass = active ? variantStyles.active : variantStyles.hover

    return [
      variantStyles.base,
      stateClass,
      'text-[12px] md:text-[16px]',
      className,
    ]
      .filter(Boolean)
      .join(' ')
  }

  // Comandos para a View
  handleClick = event => {
    if (this.model.disabled) return

    if (this.onClick) {
      this.onClick(event, this.model)
    }
  }

  toggleActive = () => {
    this.model.toggle()
    // Atualiza a className com o novo estado
    this.className = ButtonViewModel._buildClassName(
      this.model.variant,
      this.model.active,
      this.originalClassName || ''
    )
    return true
  }

  updateVariant = newVariant => {
    try {
      this.model.updateVariant(newVariant)
      // Atualiza a className com a nova variant
      this.className = ButtonViewModel._buildClassName(
        this.model.variant,
        this.model.active,
        this.originalClassName || ''
      )
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  // Propriedades computadas
  get isActive() {
    return this.model.active
  }

  get variant() {
    return this.model.variant
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  getSpecificProps() {
    return {
      type: this.type,
      onClick: this.handleClick,
      'aria-pressed': this.model.active,
      'aria-disabled': this.model.disabled,
      role: 'button',
    }
  }

  // Gerenciamento de erro
  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }
}
