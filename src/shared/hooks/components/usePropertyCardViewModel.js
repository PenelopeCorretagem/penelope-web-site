import { useState, useCallback } from 'react'
import { PropertyCardModel } from '@shared/model/components/PropertyCardModel'
import { PropertyCardViewModel } from '@shared/viewmodel/components/PropertyCardViewModel'

export function usePropertyCardViewModel({
  category,
  title,
  subtitle,
  description,
  differences = [],
}) {
  const [viewModel] = useState(() => {
    const model = new PropertyCardModel(
      category,
      title,
      subtitle,
      description,
      differences
    )
    return new PropertyCardViewModel(model)
  })

  const [, setUpdateCounter] = useState(0)

  const forceUpdate = useCallback(() => {
    setUpdateCounter(prev => prev + 1)
  }, [])

  const handleButtonClick = useCallback(() => {
    viewModel.handleButtonClick()
    forceUpdate()
  }, [viewModel, forceUpdate])

  return {
    categoryLabel: viewModel.categoryLabel,
    button: viewModel.button,
    formattedDifferences: viewModel.formattedDifferences,
    handleButtonClick,
  }
}
