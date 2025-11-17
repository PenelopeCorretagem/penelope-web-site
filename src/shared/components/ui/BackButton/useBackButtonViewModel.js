// BackButtonViewModel.js
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackButtonModel } from './BackButtonModel'
import { getBackButtonThemeClasses, getBackButtonIconClasses } from '@shared/styles/theme'

export function useBackButtonViewModel(initialProps = {}) {
  const navigate = useNavigate()
  const [model] = useState(() => new BackButtonModel(initialProps))

  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      if (!model.disabled) {
        navigate(-1)
      }
    },
    [model.disabled, navigate]
  )

  const getBackButtonClasses = useCallback((className = '') => {
    if (model.mode === 'text') {
      // Use button rectangle styling for text mode
      const classes = [
        'inline-flex',
        'items-center',
        'justify-center',
        'font-title',
        'font-bold',
        'uppercase',
        'leading-none',
        'text-button',
        'md:text-button-md',
        'transition-all',
        'duration-200',
        'gap-[var(--gap-button)]',
        'md:gap-[var(--gap-button-md)]',
        'p-[var(--padding-button-rectangle)]',
        'md:p-[var(--padding-button-rectangle-md)]',
        'bg-distac-secondary',
        'text-default-light',
        'rounded-sm',
        'w-fit'
      ]

      if (!model.disabled) {
        classes.push(
          'hover:bg-distac-primary',
          'hover:text-default-light',
          'hover:scale-105'
        )
      } else {
        classes.push('cursor-not-allowed', 'pointer-events-none', 'opacity-50')
      }

      if (className) {
        classes.push(className)
      }

      return classes.join(' ')
    } else {
      // Use original icon styling
      return getBackButtonThemeClasses({
        color: 'default',
        disabled: model.disabled,
        className,
      })
    }
  }, [model])

  const getIconClasses = useCallback((className = '') => {
    return getBackButtonIconClasses({ className })
  }, [])

  return {
    size: model.size,
    disabled: model.disabled,
    ariaLabel: model.ariaLabel,
    mode: model.mode,
    text: model.text,
    handleClick,
    getBackButtonClasses,
    getIconClasses,
  }
}
