import { useState } from 'react'
import { SectionModel } from '@shared/components/layout/Section/SectionModel'
import { getSectionThemeClasses, getSectionBackgroundThemeClasses } from '@shared/styles/theme'

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
      return getSectionBackgroundThemeClasses({ backgroundColor: validColor })
    } catch (error) {
      this.addError(error.message)
      return getSectionBackgroundThemeClasses({ backgroundColor: 'white' })
    }
  }

  getSectionClasses() {
    try {
      const validColor = this.model.validateBackgroundColor()

      // Se paddingClasses ou gapClasses foram customizadas, usa elas diretamente
      const useCustomPadding = this.model.paddingClasses !== 'p-section md:p-section-md'
      const useCustomGap = this.model.gapClasses !== 'gap-section md:gap-section-md'

      if (useCustomPadding || useCustomGap) {
        // Usa classes customizadas diretamente
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

      // Usa o theme padrão
      return getSectionThemeClasses({
        backgroundColor: validColor,
        padding: 'default',
        gap: 'default',
        className: [
          this.model.className,
          this.hasErrors ? 'border-2 border-red-500' : '',
        ].filter(Boolean).join(' ')
      })
    } catch (error) {
      this.addError(error.message)
      return getSectionThemeClasses({
        backgroundColor: 'white',
        padding: 'default',
        gap: 'default',
        className: [
          this.model.className,
          'border-2 border-red-500',
        ].filter(Boolean).join(' ')
      })
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
