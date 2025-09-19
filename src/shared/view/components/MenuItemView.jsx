import { ButtonView } from './ButtonView'

export function MenuItemView({
  children,
  variant = 'default',
  shape = 'square',
  active = false,
  className = '',
  onClick,
}) {
  return (
    <ButtonView
      className={className}
      width={'fit'}
      variant={variant}
      active={active}
      shape={shape}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </ButtonView>
  )
}
