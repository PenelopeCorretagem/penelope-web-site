import { useMemo, useCallback } from 'react'
import { ButtonModel } from './ButtonModel'
import { getButtonThemeClasses } from '@shared/styles/theme'

export function useButtonViewModel({
  text = '',
  color = 'pink',
  type = 'button',
  to = null,
  disabled = false,
  active = false,
  onClick,
  width = 'full',
  shape = 'square',
  className = ''
}) {
  const model = useMemo(() => {
    const m = new ButtonModel(text, color, type, to)
    m.active = active
    return m
  }, [text, color, type, to, active])

  const classes = useMemo(() => {
    return getButtonThemeClasses({
      color: model.color,
      active: model.active,
      width,
      shape,
      disabled,
      className
    })
  }, [model, width, shape, className, disabled])

  const handleClick = useCallback(
    (e) => {
      if (disabled) {
        e.preventDefault()
        return
      }

      onClick?.(e, model)
    },
    [disabled, onClick, model]
  )

  return {
    model,
    classes,
    handleClick,
    isLink: model.isLink(),
    to: model.to,
    type: model.type,
    disabled
  }
}
