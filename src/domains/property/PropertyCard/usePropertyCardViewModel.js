import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRouter } from '@app/routes/useRouterViewModel'
import {
  PropertyCardModel,
  PROPERTY_CARD_CATEGORY_CONFIG,
  BUTTON_STATE_CONFIG,
  BUTTON_STATES
} from './PropertyCardModel'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'

/**
 * PropertyCardViewModel - Gerencia a lógica e apresentação do PropertyCard
 * Centraliza a lógica de negócio e comportamento
 */
class PropertyCardViewModel {
  constructor(model, navigate, generateRouteFn) {
    this.model = model
    this._categoryLabel = null
    this._buttons = null
    this._differenceLabels = null
    this.navigate = navigate
    this.generateRoute = generateRouteFn
  }

  get categoryLabel() {
    if (!this._categoryLabel) {
      const config = PROPERTY_CARD_CATEGORY_CONFIG[this.model.category]
      this._categoryLabel = new LabelModel(config.label, config.variant, 'medium')
    }
    return this._categoryLabel
  }

  get buttons() {
    if (!this._buttons) {
      const config = BUTTON_STATE_CONFIG[this.model.buttonState]
      const categoryConfig = PROPERTY_CARD_CATEGORY_CONFIG[this.model.category]

      this._buttons = config.buttons.map(buttonConfig => {
        const variant = buttonConfig.variant === 'primary'
          ? categoryConfig.variant
          : buttonConfig.variant

        return new ButtonModel(buttonConfig.text, variant, 'button', {
          action: buttonConfig.action,
          fullWidth: buttonConfig.fullWidth || false
        })
      })
    }
    return this._buttons
  }

  get formattedDifferences() {
    if (!this._differenceLabels) {
      this._differenceLabels = this.model.differences.map(diff =>
        new LabelModel(diff, 'gray', 'small')
      )
    }
    return this._differenceLabels
  }

  get hasDifferences() {
    return this.model.hasDifferences
  }

  get hasValidImage() {
    return this.model.hasValidImage
  }

  get labelPosition() {
    return this.model.hasImage
      ? 'absolute top-0 -translate-y-1/2 left-[1.5rem]'
      : ''
  }

  get containerClasses() {
    const baseClasses = ['flex', 'flex-col', 'w-[340px]', 'relative', 'rounded-sm']

    if (this.model.hasShadow) {
      baseClasses.push('shadow-md shadow-gray-400')
    }

    if (this.model.hasHoverEffect) {
      baseClasses.push('transition-transform', 'duration-200', 'hover:scale-105')
    }

    return baseClasses.join(' ')
  }

  get cardClasses() {
    const baseClasses = [
      'bg-default-light', 'p-card', 'md:p-card-md', 'gap-card', 'md:gap-card-md',
      'flex', 'w-full', 'flex-col', 'items-start', 'relative'
    ]

    if (this.model.hasImage) {
      baseClasses.push('rounded-b-sm')
    } else {
      baseClasses.push('rounded-sm')
    }

    return baseClasses.join(' ')
  }

  get shouldRenderButtons() {
    return this.model.hasButton && this.buttons.length > 0
  }

  get shouldRenderImage() {
    return this.model.hasImage && this.hasValidImage
  }

  get shouldRenderLabel() {
    return this.model.hasLabel && this.categoryLabel
  }

  get shouldRenderDifferences() {
    return this.hasDifferences
  }

  get shouldRenderEditButtons() {
    return this.model.supportMode
  }

  handleEdit() {
    if (typeof this.model.onEdit === 'function') {
      this.model.onEdit(this.model.id)
    } else {
      // Usar generateRoute do useRouter hook
      try {
        const route = this.generateRoute('ADMIN_PROPERTIES_CONFIG', { id: this.model.id })
        if (this.navigate) {
          this.navigate(route)
        } else {
          window.location.href = route
        }
      } catch (error) {
        console.error('Erro ao gerar rota:', error)
        // Fallback direto sem utility
        const fallbackRoute = `/admin/imoveis/${this.model.id}`
        if (this.navigate) {
          this.navigate(fallbackRoute)
        } else {
          window.location.href = fallbackRoute
        }
      }
    }
  }

  handleDelete() {
    if (typeof this.model.onDelete === 'function') {
      this.model.onDelete(this.model.id)
    } else {
      console.log('Deleting property:', this.model.id)
    }
  }

  getButtonLayoutForState(buttonState) {
    switch (buttonState) {
      case BUTTON_STATES.GERAL:
        return 'grid'
      case BUTTON_STATES.CONTATO:
        return 'column'
      default:
        return 'single'
    }
  }

  handleButtonClick(action, onButtonClick) {
    if (typeof onButtonClick === 'function') {
      onButtonClick({
        action,
        category: this.model.category,
        title: this.model.title,
        subtitle: this.model.subtitle,
        buttonState: this.model.buttonState
      })
    }

    this._executeDefaultAction(action)
  }

  _executeDefaultAction(action) {
    console.log('Executing action:', action)
    const actions = {
      whatsapp: () => console.log('Iniciando contato via WhatsApp'),
      visit: () => console.log('Agendando visita'),
      gallery: () => console.log('Visualizando galeria'),
      floorplan: () => console.log('Visualizando planta'),
      video: () => console.log('Assistindo vídeo'),
      default: () => {
        console.log('Navigating to property detail')
        const propertyId = this.model?.id || 1
        try {
          const route = this.generateRoute('PROPERTY_DETAIL', { id: propertyId })
          console.log('Generated route:', route)
          if (this.navigate) {
            console.log('Using navigate')
            this.navigate(route)
          } else {
            console.log('Using window.location')
            window.location.href = route
          }
        } catch (error) {
          console.error('Erro ao gerar rota:', error)
          // Fallback direto
          const fallbackRoute = `/imoveis/${propertyId}`
          if (this.navigate) {
            this.navigate(fallbackRoute)
          } else {
            window.location.href = fallbackRoute
          }
        }
      }
    }

    const actionHandler = actions[action] || actions.default
    actionHandler()
  }
}

export function usePropertyCardViewModel(props) {
  const navigate = useNavigate()
  const { generateRoute } = useRouter()

  const [viewModel, setViewModel] = useState(() => {
    try {
      const model = new PropertyCardModel(props)
      return new PropertyCardViewModel(model, navigate, generateRoute)
    } catch (error) {
      console.error('Erro ao criar PropertyCardModel:', error)
      return null
    }
  })

  // Atualizar generateRoute se router mudou
  useEffect(() => {
    if (viewModel && generateRoute) {
      viewModel.generateRoute = generateRoute
    }
  }, [viewModel, generateRoute])

  // Atualiza o navigate no viewModel após a criação
  if (viewModel && !viewModel.navigate) {
    viewModel.navigate = navigate
  }

  const handleButtonClick = useCallback((action) => {
    if (!viewModel) return
    console.log('Button clicked with action:', action)
    viewModel.handleButtonClick(action, props.onButtonClick)
  }, [viewModel, props.onButtonClick, navigate])

  const handleEdit = useCallback(() => {
    if (!viewModel) return
    viewModel.handleEdit()
  }, [viewModel])

  const handleDelete = useCallback(() => {
    if (!viewModel) return
    viewModel.handleDelete()
  }, [viewModel])

  if (!viewModel) {
    return {
      categoryLabel: null,
      buttons: [],
      formattedDifferences: [],
      hasDifferences: false,
      hasValidImage: false,
      labelPosition: '',
      containerClasses: 'flex flex-col w-36',
      cardClasses: 'bg-default-light p-card rounded-sm',
      shouldRenderButtons: false,
      shouldRenderImage: false,
      shouldRenderLabel: false,
      shouldRenderDifferences: false,
      buttonLayout: 'single',
      handleButtonClick: () => {},
      handleEdit: () => {},
      handleDelete: () => {},
      hasError: true,
      model: null
    }
  }

  return {
    categoryLabel: viewModel.categoryLabel,
    buttons: viewModel.buttons,
    formattedDifferences: viewModel.formattedDifferences,
    hasDifferences: viewModel.hasDifferences,
    hasValidImage: viewModel.hasValidImage,
    labelPosition: viewModel.labelPosition,
    containerClasses: viewModel.containerClasses,
    cardClasses: viewModel.cardClasses,
    shouldRenderButtons: viewModel.shouldRenderButtons,
    shouldRenderImage: viewModel.shouldRenderImage,
    shouldRenderLabel: viewModel.shouldRenderLabel,
    shouldRenderDifferences: viewModel.shouldRenderDifferences,
    shouldRenderEditButtons: viewModel.shouldRenderEditButtons,
    buttonLayout: viewModel.getButtonLayoutForState(viewModel.model.buttonState),
    handleButtonClick,
    handleEdit,
    handleDelete,
    hasError: false,
    model: viewModel.model,
    setViewModel
  }
}

export { PropertyCardViewModel }
