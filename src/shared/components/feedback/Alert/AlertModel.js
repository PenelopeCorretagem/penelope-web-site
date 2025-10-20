export class AlertModel {
  constructor({
    isVisible = false,
    type = 'info',
    message = '',
    onClose = () => {},
    children = null
  } = {}) {
    this.isVisible = isVisible
    this.type = type
    this.message = message
    this.onClose = onClose
    this.children = children
  }

  static create(config = {}) {
    return new AlertModel(config)
  }

  close() {
    this.onClose()
  }

  show() {
    this.isVisible = true
  }

  hide() {
    this.isVisible = false
  }
}
