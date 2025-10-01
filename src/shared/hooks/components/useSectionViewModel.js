import { useState } from 'react'
import { SectionModel } from '@shared/model/components/SectionModel'
import { SectionViewModel } from '@shared/viewmodel/components/SectionViewModel'

export function useSectionViewModel(props) {
  const [viewModel] = useState(() => {
    const model = new SectionModel(props)
    return new SectionViewModel(model)
  })

  return {
    children: viewModel.children,
    backgroundColor: viewModel.backgroundColor,
    paddingClasses: viewModel.paddingClasses,
    gapClasses: viewModel.gapClasses,
    className: viewModel.className,
    hasErrors: viewModel.hasErrors,
    errorMessages: viewModel.errorMessages,
    getSectionClasses: () => viewModel.getSectionClasses(),
    getBackgroundColorClass: () => viewModel.getBackgroundColorClass(),
  }
}
