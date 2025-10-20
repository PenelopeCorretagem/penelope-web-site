import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBackModel } from '@shared/components/ui/ArrowBack/ArrowBackModel'
import { getArrowBackThemeClasses, getArrowBackIconClasses } from '@shared/styles/theme'

/**
 * ArrowBackViewModel - Gerencia lógica do botão de voltar
 */
class ArrowBackViewModel {
  constructor(model = new ArrowBackModel()) {
    this.model = model
  }

  get size() {
    return this.model.size
  }

  get disabled() {
    return this.model.disabled
  }

  get ariaLabel() {
    return this.model.ariaLabel
  }

  get canClick() {
    return !this.disabled
  }

  getButtonClasses(className = '') {
    const customColor = /\btext-\w+/.test(className || '')

    return getArrowBackThemeClasses({
      color: 'default',
      disabled: this.disabled,
      className,
      customColor,
    })
  }

  getIconClasses(className = '') {
    return getArrowBackIconClasses({ className })
  }
}

/**
 * Hook para gerenciar ArrowBack
 */
export function useArrowBackViewModel(initialProps = {}) {
  const navigate = useNavigate()

  const [viewModel] = useState(() => {
    return new ArrowBackViewModel(new ArrowBackModel(initialProps))
  })

  const handleClick = useCallback(() => {
    if (viewModel.canClick) {
      navigate(-1)
    }
  }, [viewModel, navigate])

  return {
    size: viewModel.size,
    disabled: viewModel.disabled,
    ariaLabel: viewModel.ariaLabel,
    canClick: viewModel.canClick,
    getButtonClasses: (className) => viewModel.getButtonClasses(className),
    getIconClasses: (className) => viewModel.getIconClasses(className),
    handleClick,
  }
}

export { ArrowBackViewModel }
