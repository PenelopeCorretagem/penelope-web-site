import { useState, useCallback } from 'react'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'

/**
 * ButtonViewModel - Gerencia a lógica e apresentação de botões
 * Estende BaseElementViewModel para funcionalidades base de UI
 */
class ButtonViewModel {
  constructor(model = new ButtonModel(), { onClick } = {}) {
    this.model = model
    this.onClick = onClick
    this.errors = []
  }

  // ✅ Getters de dados (sem CSS)
  get text() {
    return this.model.text
  }

  get variant() {
    return this.model.variant
  }

  get type() {
    return this.model.type
  }

  get active() {
    return this.model.active
  }

  get disabled() {
    return this.model.disabled
  }

  get transition() {
    return this.model.transition
  }

  get hasErrors() {
    return this.errors.length > 0
  }

  get errorMessages() {
    return this.errors.join(', ')
  }

  get isValid() {
    return this.model.isValid()
  }

  get canClick() {
    return !this.disabled && !this.hasErrors
  }

  /**
   * ✅ MVVM: ViewModel gerencia mapeamento CSS
   * Retorna classes CSS baseadas na variante e estado ativo
   */
  getVariantClasses(active) {
    const variants = {
      pink: {
        base: 'bg-brand-pink text-brand-white',
        active: 'bg-brand-brown',
        hover: 'hover:bg-brand-pink',
      },
      brown: {
        base: 'bg-brand-brown text-brand-white',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
      white: {
        base: 'bg-brand-white text-brand-black',
        active: 'bg-brand-pink text-brand-white',
        hover: 'hover:bg-brand-pink hover:text-brand-white',
      },
    }

    const variantStyles = variants[this.variant] || variants.pink
    const stateClass = active ? variantStyles.active : variantStyles.hover

    return [variantStyles.base, stateClass].join(' ')
  }

  /**
   * Retorna classes de largura
   */
  getWidthClasses(width) {
    const widths = {
      full: 'w-full',
      fit: 'w-fit',
    }
    return widths[width] || widths.full
  }

  /**
   * Retorna classes de forma
   */
  getShapeClasses(shape) {
    const shapes = {
      square: 'rounded-sm',
      circle: 'rounded-full',
    }
    return shapes[shape] || shapes.square
  }

  /**
   * Retorna classes de estado baseadas em erros e habilitação
   */
  getStateClasses() {
    if (this.hasErrors) return 'border-2 border-red-500'
    if (this.disabled) return 'cursor-not-allowed pointer-events-none opacity-50'
    if (this.canClick) return 'cursor-pointer'
    return ''
  }

  /**
   * Retorna todas as classes CSS concatenadas
   */
  getButtonClasses(width = 'full', shape = 'square', additionalClassName = '') {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-title-family font-medium',
      'text-[12px] md:text-[16px]',
      'leading-none',
      'uppercase',
      'transition-all duration-200',
      'hover:scale-105'
    ].join(' ')

    // Conditional padding - only apply default if no custom padding in className
    const defaultPadding = additionalClassName.includes('px-') ||
                          additionalClassName.includes('py-') ||
                          additionalClassName.includes('p-')
      ? ''
      : 'px-4 py-2'

    return [
      baseClasses,
      defaultPadding,
      this.getVariantClasses(this.active),
      this.getWidthClasses(width),
      this.getShapeClasses(shape),
      this.getStateClasses(),
      additionalClassName,
    ]
      .filter(Boolean)
      .join(' ')
  }

  handleClick = event => {
    if (!this.canClick) return

    if (this.onClick) {
      this.onClick(event, this.model)
    }
  }

  toggle = () => {
    if (!this.canClick) return false

    this.model.toggle()
    return true
  }

  updateVariant = newVariant => {
    try {
      this.model.updateVariant(newVariant)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  updateText = newText => {
    try {
      this.model.updateText(newText)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
    }
  }

  setDisabled = disabled => {
    this.model.setDisabled(disabled)
  }

  setType = newType => {
    try {
      this.model.setType(newType)
      this.clearErrors()
      return true
    } catch (error) {
      this.addError(error.message)
      return false
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

/**
 * Hook para gerenciar estado e interações do ButtonViewModel
 * Implementa Factory Pattern - cria o modelo internamente
 * @param {string} text - Texto do botão
 * @param {string} variant - Variante de cor do botão
 * @param {string} type - Tipo do botão
 * @param {Object} config - Configurações adicionais
 * @returns {Object} Estado e comandos do botão
 */
export function useButtonViewModel(text = '', variant = 'pink', type = 'button', config = {}) {
  // ✅ Factory Pattern - Hook cria o modelo
  const [viewModel] = useState(() => {
    const model = new ButtonModel(text, variant, type)
    return new ButtonViewModel(model, config)
  })
  const [, forceUpdate] = useState(0)

  // Atualiza o onClick sempre que o config muda
  viewModel.onClick = config.onClick

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    toggle: () => {
      const success = viewModel.toggle()
      if (success) refresh()
      return success
    },

    updateVariant: variant => {
      const success = viewModel.updateVariant(variant)
      if (success) refresh()
      return success
    },

    updateText: text => {
      const success = viewModel.updateText(text)
      if (success) refresh()
      return success
    },

    setDisabled: disabled => {
      viewModel.setDisabled(disabled)
      refresh()
    },

    setType: type => {
      const success = viewModel.setType(type)
      if (success) refresh()
      return success
    },

    handleClick: viewModel.handleClick,
  }

  return {
    text: viewModel.text,
    variant: viewModel.variant,
    type: viewModel.type,
    active: viewModel.active,
    disabled: viewModel.disabled,
    transition: viewModel.transition,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    isValid: viewModel.isValid,
    canClick: viewModel.canClick,
    // ✅ Método CSS vindo do ViewModel
    getButtonClasses: (width, shape, additionalClassName) =>
      viewModel.getButtonClasses(width, shape, additionalClassName),
    ...commands,
  }
}
