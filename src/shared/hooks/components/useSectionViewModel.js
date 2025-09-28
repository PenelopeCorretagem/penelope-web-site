import { useState } from 'react'
import { SectionViewModel } from '@shared/viewmodel/components/SectionViewModel'

export function useSectionViewModel(initialModel) {
  const [viewModel] = useState(() => new SectionViewModel(initialModel))

  return {
    backgroundColor: viewModel.backgroundColor,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    validateBackgroundColor: () => viewModel.validateBackgroundColor(),
  }
}
