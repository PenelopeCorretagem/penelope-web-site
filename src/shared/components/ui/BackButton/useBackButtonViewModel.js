// BackButtonViewModel.js
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackButtonModel } from './BackButtonModel'
import { getBackButtonThemeClasses, getBackButtonIconClasses } from '@shared/styles/theme'

export function useBackButtonViewModel(initialProps = {}) {
  const navigate = useNavigate()
  const [model] = useState(() => new BackButtonModel(initialProps))

  const handleClick = useCallback(() => {
    if (!model.disabled) {
      navigate(-1)
    }
  }, [model, navigate])

  const getBackButtonClasses = useCallback((className = '') => {
    return getBackButtonThemeClasses({
      color: 'default',
      disabled: model.disabled,
      className,
    })
  }, [model])

  const getIconClasses = useCallback((className = '') => {
    return getBackButtonIconClasses({ className })
  }, [])

  return {
    size: model.size,
    disabled: model.disabled,
    ariaLabel: model.ariaLabel,
    handleClick,
    getBackButtonClasses,
    getIconClasses,
  }
}
