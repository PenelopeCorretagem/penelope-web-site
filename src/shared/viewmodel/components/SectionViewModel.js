import { SectionModel } from '@shared/model/components/SectionModel'
import { SECTION_BACKGROUND_COLOR_CLASSES } from '@shared/Enum/components/ESectionBackgroundColor'

export class SectionViewModel {
  constructor(model = new SectionModel()) {
    this.model = model
    this.errors = []
  }

  get children() {
    return this.model.children
  }

  get backgroundColor() {
    return this.model.backgroundColor
  }

  get paddingClasses() {
    return this.model.paddingClasses
  }

  get gapClasses() {
    return this.model.gapClasses
  }

  get className() {
    return this.model.className
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  getBackgroundColorClass() {
    try {
      const validColor = this.model.validateBackgroundColor()
      return SECTION_BACKGROUND_COLOR_CLASSES[validColor] || SECTION_BACKGROUND_COLOR_CLASSES.white
    } catch (error) {
      this.addError(error.message)
      return SECTION_BACKGROUND_COLOR_CLASSES.white
    }
  }

  getSectionClasses() {
    return [
      'section',
      'w-full',
      'h-fit',
      this.model.gapClasses,
      this.model.paddingClasses,
      this.getBackgroundColorClass(),
      this.model.className,
      this.hasErrors ? 'border-2 border-red-500' : '',
    ].filter(Boolean).join(' ')
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
