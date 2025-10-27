import { useState, useCallback } from 'react'
import { PropertyDetailsCardModel } from './PropertyDetailsCardModel'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'

/**
 * PropertyDetailsCardViewModel - Gerencia a lógica e apresentação do PropertyDetailsCard
 * Centraliza a lógica de negócio e interações do card
 */
class PropertyDetailsCardViewModel {
  constructor(model = new PropertyDetailsCardModel()) {
    this.model = model
    this.errors = []
  }

  // Getters de dados
  get hasLabel() {
    return this.model.hasLabel
  }

  get category() {
    return this.model.category
  }

  get title() {
    return this.model.title
  }

  get subtitle() {
    return this.model.subtitle
  }

  get description() {
    return this.model.description
  }

  get hasButton() {
    return this.model.hasButton
  }

  get hasShadow() {
    return this.model.hasShadow
  }

  get hasImage() {
    return this.model.hasImage
  }

  get hasHoverEffect() {
    return this.model.hasHoverEffect
  }

  get imageUrl() {
    return this.model.imageUrl
  }

  get buttonState() {
    return this.model.buttonState
  }

  get buttonColor() {
    return this.model.buttonColor
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  get isValid() {
    return this.model.isValid && !this.hasErrors
  }

  // Lógica de apresentação
  get categoryLabel() {
    const labelData = this.model.categoryLabel
    return new LabelModel({
      text: labelData.text,
      variant: labelData.variant,
      size: 'small'
    })
  }

  get labelPosition() {
    return this.model.hasImage
      ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]'
      : ''
  }

  get cardClasses() {
    const baseClasses = [
      'bg-default-light-secondary',
      'p-card md:p-card-md',
      'gap-card md:gap-card-md',
      'flex w-full flex-col items-start'
    ]

    if (this.model.hasImage) {
      baseClasses.push('rounded-b-sm')
    } else {
      baseClasses.push('rounded-sm')
    }

    if (this.model.hasShadow) {
      baseClasses.push('drop-shadow-md')
    }

    return baseClasses.join(' ')
  }

  get containerClasses() {
    const baseClasses = ['flex', 'flex-col', 'max-w-sm']

    if (this.model.hasHoverEffect) {
      baseClasses.push('transition-transform', 'hover:scale-105')
    }

    return baseClasses.join(' ')
  }

  // Métodos de ação
  handleButtonClick = (action = 'default') => {
    try {
      console.log(`PropertyDetailsCard button clicked: ${action}`, {
        title: this.model.title,
        category: this.model.category,
        buttonState: this.model.buttonState
      })

      // Lógica específica por tipo de botão
      switch (action) {
        case 'whatsapp':
          this.handleWhatsAppContact()
          break
        case 'visit':
          this.handleScheduleVisit()
          break
        case 'gallery':
          this.handleViewGallery()
          break
        case 'floorplan':
          this.handleViewFloorplan()
          break
        case 'video':
          this.handleWatchVideo()
          break
        default:
          this.handleDefaultAction()
      }

      return true
    } catch (error) {
      this.addError(`Erro ao processar ação: ${error.message}`)
      return false
    }
  }

  handleWhatsAppContact = () => {
    console.log('Iniciando contato via WhatsApp')
    // TODO: Implementar lógica de WhatsApp
  }

  handleScheduleVisit = () => {
    console.log('Agendando visita')
    // TODO: Implementar lógica de agendamento
  }

  handleViewGallery = () => {
    console.log('Visualizando galeria')
    // TODO: Implementar lógica de galeria
  }

  handleViewFloorplan = () => {
    console.log('Visualizando planta')
    // TODO: Implementar lógica de planta
  }

  handleWatchVideo = () => {
    console.log('Assistindo vídeo')
    // TODO: Implementar lógica de vídeo
  }

  handleDefaultAction = () => {
    console.log('Ação padrão do card')
    // TODO: Implementar ação padrão
  }

  // Métodos de atualização
  updateTitle = (newTitle) => {
    try {
      const updated = this.model.updateTitle(newTitle)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar título: ${error.message}`)
      return false
    }
  }

  updateSubtitle = (newSubtitle) => {
    try {
      const updated = this.model.updateSubtitle(newSubtitle)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar subtítulo: ${error.message}`)
      return false
    }
  }

  updateDescription = (newDescription) => {
    try {
      const updated = this.model.updateDescription(newDescription)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar descrição: ${error.message}`)
      return false
    }
  }

  updateCategory = (newCategory) => {
    try {
      const updated = this.model.updateCategory(newCategory)
      if (updated) {
        this.clearErrors()
        return true
      }
      return false
    } catch (error) {
      this.addError(`Erro ao atualizar categoria: ${error.message}`)
      return false
    }
  }

  // Gerenciamento de erros
  addError(message) {
    if (!this.errors.includes(message)) {
      this.errors.push(message)
    }
  }

  clearErrors() {
    this.errors = []
  }

  // Métodos utilitários
  getState() {
    return {
      ...this.model.toJSON(),
      hasErrors: this.hasErrors,
      errorMessages: this.errorMessages,
      categoryLabel: this.categoryLabel,
      labelPosition: this.labelPosition,
      cardClasses: this.cardClasses,
      containerClasses: this.containerClasses,
    }
  }
}

/**
 * Hook para gerenciar estado e lógica do PropertyDetailsCard
 */
export function usePropertyDetailsCardViewModel(initialData = {}) {
  const [viewModel] = useState(() => {
    const model = new PropertyDetailsCardModel(initialData)
    return new PropertyDetailsCardViewModel(model)
  })

  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateTitle: (title) => {
      const success = viewModel.updateTitle(title)
      if (success) refresh()
      return success
    },

    updateSubtitle: (subtitle) => {
      const success = viewModel.updateSubtitle(subtitle)
      if (success) refresh()
      return success
    },

    updateDescription: (description) => {
      const success = viewModel.updateDescription(description)
      if (success) refresh()
      return success
    },

    updateCategory: (category) => {
      const success = viewModel.updateCategory(category)
      if (success) refresh()
      return success
    },

    clearErrors: () => {
      viewModel.clearErrors()
      refresh()
    },
  }

  return {
    // Data
    hasLabel: viewModel.hasLabel,
    category: viewModel.category,
    title: viewModel.title,
    subtitle: viewModel.subtitle,
    description: viewModel.description,
    hasButton: viewModel.hasButton,
    hasShadow: viewModel.hasShadow,
    hasImage: viewModel.hasImage,
    hasHoverEffect: viewModel.hasHoverEffect,
    imageUrl: viewModel.imageUrl,
    buttonState: viewModel.buttonState,
    buttonColor: viewModel.buttonColor,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,

    // Presentation
    categoryLabel: viewModel.categoryLabel,
    labelPosition: viewModel.labelPosition,
    cardClasses: viewModel.cardClasses,
    containerClasses: viewModel.containerClasses,

    // Actions
    handleButtonClick: viewModel.handleButtonClick,

    // Commands
    ...commands,

    // Utilities
    getState: viewModel.getState,
  }
}

export { PropertyDetailsCardViewModel }
