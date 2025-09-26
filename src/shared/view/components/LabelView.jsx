import { BaseElementView } from './BaseElementView'
import { useLabelViewModel } from '../../hooks/components/useLabelViewModel'

export function LabelView({ model, className = '' }) {
  const { viewModel } = useLabelViewModel(model, { className })

  const specificProps = viewModel.getSpecificProps()

  return (
    <BaseElementView
      viewModel={viewModel}
      role={specificProps.role}
      aria-label={specificProps['aria-label']}
    />
  )
}
