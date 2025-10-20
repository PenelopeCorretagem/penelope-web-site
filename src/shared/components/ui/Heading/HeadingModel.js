import { theme } from '@shared/styles/theme'

/**
 * HeadingModel - Modelo de dados para o componente Heading
 * Gerencia estado e validação de títulos/cabeçalhos
 */
export class HeadingModel {
  static DEFAULTS = {
    level: 1,
    color: 'black',
    children: '',
    className: '',
  }

  static THEME_COLORS = Object.keys(theme.heading.colors)
  static VALID_LEVELS = [1, 2, 3, 4, 5, 6]

  constructor({
    level = HeadingModel.DEFAULTS.level,
    color = HeadingModel.DEFAULTS.color,
    children = HeadingModel.DEFAULTS.children,
    className = HeadingModel.DEFAULTS.className,
  } = {}) {
    this.level = this.validateLevel(level)
    this.color = this.validateColor(color)
    this.children = children
    this.className = String(className || '')
  }

  // Validação
  validateLevel(level) {
    // Aceita números de 1-6
    if (typeof level === 'number' && level >= 1 && level <= 6) {
      return Math.floor(level)
    }

    // Aceita strings como 'h1', 'h2', etc. ou '1', '2', etc.
    if (typeof level === 'string') {
      // Tenta extrair número da string (funciona para 'h1', 'H1', '1', etc.)
      const parsed = parseInt(level.replace(/\D/g, ''), 10)
      if (parsed >= 1 && parsed <= 6) {
        return parsed
      }
    }

    return HeadingModel.DEFAULTS.level
  }

  validateColor(color) {
    // Verifica se é uma cor válida do theme
    if (typeof color === 'string' && HeadingModel.THEME_COLORS.includes(color)) {
      return color
    }

    return HeadingModel.DEFAULTS.color
  }

  // Getters
  get isValid() {
    return (
      this.level >= 1 &&
      this.level <= 6 &&
      HeadingModel.THEME_COLORS.includes(this.color) &&
      typeof this.children !== 'undefined'
    )
  }

  get componentTag() {
    return `h${this.level}`
  }

  get hasContent() {
    return Boolean(this.children)
  }

  get isEmpty() {
    return !this.hasContent
  }

  // Métodos de atualização
  updateLevel(newLevel) {
    const validatedLevel = this.validateLevel(newLevel)
    if (validatedLevel !== this.level) {
      this.level = validatedLevel
      return true
    }
    return false
  }

  updateColor(newColor) {
    const validatedColor = this.validateColor(newColor)
    if (validatedColor !== this.color) {
      this.color = validatedColor
      return true
    }
    return false
  }

  updateChildren(newChildren) {
    if (newChildren !== this.children) {
      this.children = newChildren
      return true
    }
    return false
  }

  updateClassName(newClassName) {
    const cleanClassName = String(newClassName || '')
    if (cleanClassName !== this.className) {
      this.className = cleanClassName
      return true
    }
    return false
  }

  // Métodos utilitários
  toJSON() {
    return {
      level: this.level,
      color: this.color,
      children: this.children,
      className: this.className,
      componentTag: this.componentTag,
      hasContent: this.hasContent,
      isEmpty: this.isEmpty,
      isValid: this.isValid,
    }
  }

  clone() {
    return new HeadingModel({
      level: this.level,
      color: this.color,
      children: this.children,
      className: this.className,
    })
  }

  equals(other) {
    if (!(other instanceof HeadingModel)) return false

    return (
      this.level === other.level &&
      this.color === other.color &&
      this.children === other.children &&
      this.className === other.className
    )
  }

  // Método para verificar se é um nível específico
  isLevel(targetLevel) {
    const validatedTarget = this.validateLevel(targetLevel)
    return this.level === validatedTarget
  }

  // Método para verificar se é uma cor específica
  isColor(targetColor) {
    const validatedTarget = this.validateColor(targetColor)
    return this.color === validatedTarget
  }
}
