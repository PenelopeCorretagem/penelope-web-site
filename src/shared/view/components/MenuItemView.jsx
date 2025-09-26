import { BaseElementView } from './BaseElementView'
import { MenuItemViewModel } from '../../viewmodel/components/MenuItemViewModel'

export function MenuItemView({
  children,
  width = 'fit',
  className = '',
  variant = 'default',
  active = false,
  shape = 'square',
  href,
  to,
  onClick,
  disabled = false,
  external = false,
}) {

  const viewModel = new MenuItemViewModel({
    children,
    width,
    className,
    variant,
    active,
    shape,
    href,
    to,
    onClick,
    disabled,
    external,
  })


  const specificProps = viewModel.getSpecificProps()

  return (
    <BaseElementView
      viewModel={viewModel}
      to={specificProps.to}
      href={specificProps.href}
      target={specificProps.target}
      rel={specificProps.rel}
      onClick={specificProps.onClick}
    />
  )
}
