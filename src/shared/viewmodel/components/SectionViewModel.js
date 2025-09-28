import { SectionModel } from '@shared/model/components/SectionModel'

export class SectionViewModel {
  constructor(model = new SectionModel()) {
    this.model = model
    this.errors = []
  }

  get backgroundColor() {
    return this.model.backgroundColor
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  validateBackgroundColor() {
    try {
      return this.model.validateBackgroundColor(this.backgroundColor)
    } catch (error) {
      this.addError(error.message)
      return 'white' // Fallback para cor padrão
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
