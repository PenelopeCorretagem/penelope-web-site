import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBackModel } from '@shared/components/ui/AroowBack/ArrowBackModel'

/**
 * ArrowBackViewModel - Gerencia lógica e CSS do botão de voltar
 */
class ArrowBackViewModel {
  constructor(model = new ArrowBackModel()) {
    this.model = model
    this.navigate = null
  }

  // Getters
  get size() {
    return this.model.size
  }

  get disabled() {
    return this.model.disabled
  }

  get ariaLabel() {
    return this.model.ariaLabel
  }

  // CSS Classes
  get buttonClasses() {
    const baseClasses = 'font-semibold cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none'
    const defaultColorClasses = 'text-brand-dark-gray hover:text-brand-pink'
    const disabledClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : ''

    return [baseClasses, defaultColorClasses, disabledClasses].filter(Boolean).join(' ')
  }

  get buttonBaseClasses() {
    const baseClasses = 'font-semibold cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none'
    const disabledClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : ''

    return [baseClasses, disabledClasses].filter(Boolean).join(' ')
  }  get iconClasses() {
    return 'inline'
  }

  // Métodos
  setNavigate(navigate) {
    this.navigate = navigate
  }

  handleClick = () => {
    if (this.disabled || !this.navigate) return
    this.navigate(-1)
  }

  getState() {
    return {
      ...this.model.toJSON(),
      buttonClasses: this.buttonClasses,
      buttonBaseClasses: this.buttonBaseClasses,
      iconClasses: this.iconClasses,
    }
  }
}

/**
 * Hook para gerenciar ArrowBack
 */
export function useArrowBackViewModel(initialProps = {}) {
  const navigate = useNavigate()

  const [viewModel] = useState(() => {
    const model = new ArrowBackModel(initialProps)
    const vm = new ArrowBackViewModel(model)
    vm.setNavigate(navigate)
    return vm
  })

  const handleClick = useCallback(() => {
    viewModel.handleClick()
  }, [viewModel])

  return {
    // Data
    size: viewModel.size,
    disabled: viewModel.disabled,
    ariaLabel: viewModel.ariaLabel,

    // CSS
    buttonClasses: viewModel.buttonClasses,
    buttonBaseClasses: viewModel.buttonBaseClasses,
    iconClasses: viewModel.iconClasses,

    // Handlers
    handleClick,

    // Utilities
    getState: viewModel.getState.bind(viewModel),
  }
}

export { ArrowBackViewModel }
