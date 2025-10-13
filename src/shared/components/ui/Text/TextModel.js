/**
 * TextModel - Modelo de dados para o componente Text
 * Gerencia estado e validação de textos básicos
 */
export class TextModel {

  static DEFAULTS = {
    children: '',
    className: '',
  }

  constructor({
    children = TextModel.DEFAULTS.children,
    className = TextModel.DEFAULTS.className,
  } = {}) {
    this.children = children
    this.className = String(className || '')
  }

  // Getters
  get isValid() {
    return (
      typeof this.children !== 'undefined'
    )
  }

  get hasContent() {
    return Boolean(this.children)
  }

  get isEmpty() {
    return !this.hasContent
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
      children: this.children,
      className: this.className,
      hasContent: this.hasContent,
      isEmpty: this.isEmpty,
      isValid: this.isValid,
    }
  }

  clone() {
    return new TextModel({
      children: this.children,
      className: this.className,
    })
  }

  equals(other) {
    if (!(other instanceof TextModel)) return false

    return (
      this.children === other.children &&
      this.className === other.className
    )
  }
}
