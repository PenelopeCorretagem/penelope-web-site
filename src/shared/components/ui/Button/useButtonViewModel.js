import { useState, useCallback } from 'react'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { getButtonThemeClasses } from '@shared/styles/theme'

/**
 * ButtonViewModel - Gerencia a lógica e apresentação de botões usando theme design-model
 */
class ButtonViewModel {
  constructor(model = new ButtonModel(), { onClick } = {}) {
    this.model = model
    this.onClick = onClick
  }

  get text() {
    return this.model.text
  }

  get color() {
    return this.model.color
  }

  get type() {
    return this.model.type
  }

  get to() {
    return this.model.to
  }

  get isLink() {
    return this.model.isLink()
  }

  get active() {
    return this.model.active
  }

  get disabled() {
    return this.model.disabled
  }

  get canClick() {
    return !this.disabled
  }

  getButtonClasses(width = 'full', shape = 'square', className = '', disabled = false, active = false) {
    // Only detect custom padding if it's actually intended to override theme padding
    const customPadding = /\bp-button-|\bpx-button-|\bpy-button-/.test(className || '')
    const customTextColor = /\btext-\w+/.test(className || '')

    return getButtonThemeClasses({
      color: this.color,
      active: active || this.active,
      width,
      shape,
      disabled: disabled || this.disabled,
      className,
      customPadding,
      customTextColor,
    })
  }

  toggle() {
    if (this.canClick) {
      this.model.toggle()
      return true
    }
    return false
  }
}

/**
 * Hook para gerenciar estado e interações do ButtonViewModel
 */
export function useButtonViewModel(text = '', color = 'pink', type = 'button', config = {}, to = null) {
  const [viewModel] = useState(() => {
    const model = new ButtonModel(text, color, type, to)
    return new ButtonViewModel(model, config)
  })
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const handleClick = useCallback((event) => {
    if (!viewModel.canClick) {
      event.preventDefault()
      return
    }

    // Para links, deixa o comportamento padrão do Link component
    if (viewModel.isLink && viewModel.to) {
      if (config.onClick) {
        config.onClick(event, viewModel.model)
      }
      return
    }

    // Para botões normais, executa a ação onClick
    if (config.onClick) {
      // Garante que o evento seja passado corretamente
      config.onClick(event, viewModel.model)
    }
  }, [viewModel, config])

  const toggle = useCallback(() => {
    const success = viewModel.toggle()
    if (success) refresh()
    return success
  }, [viewModel, refresh])

  return {
    text: viewModel.text,
    color: viewModel.color,
    type: viewModel.type,
    to: viewModel.to,
    isLink: viewModel.isLink,
    active: viewModel.active,
    disabled: viewModel.disabled,
    canClick: viewModel.canClick,
    getButtonClasses: (width, shape, className, disabled, active) =>
      viewModel.getButtonClasses(width, shape, className, disabled, active),
    handleClick,
    toggle,
  }
}
