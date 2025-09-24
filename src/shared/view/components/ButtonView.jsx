import { BaseElementView } from './BaseElementView'
import { useButtonViewModel } from '../../hooks/components/useButtonViewModel'

export function ButtonView({
  model,
  width = 'full',
  shape = 'square',
  className = '',
  onClick,
}) {
  // Usa o hook para gerenciar o ViewModel
  const { viewModel } = useButtonViewModel(model, {
    width,
    shape,
    className,
    onClick,
  })

  // Obtém as props específicas do Button
  const specificProps = viewModel.getSpecificProps()

  return (
    <BaseElementView
      viewModel={viewModel}
      type={specificProps.type}
      onClick={specificProps.onClick}
      aria-pressed={specificProps['aria-pressed']}
      aria-disabled={specificProps['aria-disabled']}
      role={specificProps.role}
    />
  )
}
