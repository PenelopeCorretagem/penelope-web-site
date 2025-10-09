import { useState } from 'react'
import { SectionModel } from '@shared/components/layout/Section/SectionModel'
import { SECTION_BACKGROUND_COLOR_CLASSES } from '@shared/components/layout/Section/ESectionBackgroundColor'

/**
 * SectionViewModel - Gerencia a lógica e apresentação da Section
 * Centraliza a lógica de CSS e comportamento
 */
class SectionViewModel {
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

export function useSectionViewModel(props) {
  const [viewModel] = useState(() => {
    const model = new SectionModel(props)
    return new SectionViewModel(model)
  })

  return {
    children: viewModel.children,
    backgroundColor: viewModel.backgroundColor,
    paddingClasses: viewModel.paddingClasses,
    gapClasses: viewModel.gapClasses,
    className: viewModel.className,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    getSectionClasses: () => viewModel.getSectionClasses(),
    getBackgroundColorClass: () => viewModel.getBackgroundColorClass(),
  }
}

export { SectionViewModel }
