// MenuItemViewModel.js
import { BaseElementViewModel } from './BaseElementViewModel'
import { Link } from 'react-router-dom'

/**
 * MenuItemViewModel - Gerencia a lógica e apresentação de itens do menu
 * Estende BaseElementViewModel para funcionalidades base de elementos UI
 */
export class MenuItemViewModel extends BaseElementViewModel {
  /**
   * @param {Object} config Configuração do item do menu
   * @param {Node} config.children Conteúdo do item
   * @param {string} config.width Largura do item ('fit' por padrão)
   * @param {string} config.className Classes CSS adicionais
   * @param {('default'|'destac')} config.variant Variante visual do item
   * @param {boolean} config.active Estado de ativação
   * @param {string} config.shape Forma do item ('square' por padrão)
   * @param {string} config.href Link externo
   * @param {string} config.to Rota interna
   * @param {Function} config.onClick Manipulador de clique
   * @param {boolean} config.disabled Estado desabilitado
   * @param {boolean} config.external Se é link externo
   */
  constructor({
    children,
    width = 'fit',
    className = '',
    variant = 'default',
    active = false,
    shape = 'square',
    href,
    to,
    onClick,
    disabled = false,
    external = false,
  } = {}) {
    // Validação de variant ANTES de chamar super
    const validVariants = ['default', 'destac']
    if (!validVariants.includes(variant)) {
      throw new Error(
        `Invalid variant "${variant}". Valid: ${validVariants.join(', ')}`
      )
    }

    // Determina qual componente usar (função estática)
    const componentType = MenuItemViewModel._determineComponentType(to, href)

    // Chama o constructor do BaseElementViewModel
    super({
      children,
      width,
      shape,
      disabled,
      as: componentType,
      className: MenuItemViewModel._buildClassName(variant, active, className),
    })

    // Propriedades específicas do MenuItem
    this.variant = variant
    this.active = active
    this.href = href
    this.to = to
    this.onClick = onClick
    this.external = external
  }

  /**
   * Determina o tipo de componente baseado nas props
   * @param {string} to Rota interna
   * @param {string} href Link externo
   * @returns {string|Component} Tipo do componente a ser renderizado
   */
  static _determineComponentType(to, href) {
    if (to) return Link
    if (href) return 'a'
    return 'button'
  }

  /**
   * Constrói a string de classes CSS baseada nas props
   * @param {string} variant Variante visual ('default' ou 'destac')
   * @param {boolean} active Estado de ativação
   * @param {string} className Classes adicionais
   * @returns {string} Classes CSS combinadas
   */
  static _buildClassName(variant, active, className) {
    const validVariants = ['default', 'destac']

    if (!validVariants.includes(variant)) {
      throw new Error(
        `Invalid variant "${variant}". Valid: ${validVariants.join(', ')}`
      )
    }

    const variants = {
      default: active
        ? 'bg-brand-pink text-brand-white'
        : 'bg-brand-white-tertiary hover:bg-brand-pink text-brand-black hover:text-brand-white',
      destac: active
        ? 'bg-brand-pink text-brand-white'
        : 'bg-brand-brown hover:bg-brand-pink text-brand-white',
    }

    return [
      variants[variant],
      'uppercase text-[12px] md:text-[16px]',
      className,
    ]
      .filter(Boolean)
      .join(' ')
  }

  /**
   * Retorna props específicas baseadas na configuração
   * @returns {Object} Props específicas para o componente
   */
  getSpecificProps() {
    const props = {}

    if (this.to) {
      props.to = this.to
    } else if (this.href) {
      props.href = this.href
      if (this.external) {
        props.target = '_blank'
        props.rel = 'noopener noreferrer'
      }
    }

    if (this.onClick) {
      props.onClick = this.onClick
    }

    return props
  }
}
