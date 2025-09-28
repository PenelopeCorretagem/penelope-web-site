import { useState, useCallback } from 'react'
import { CardModel } from '@shared/model/components/CardModel'
import { CardViewModel } from '@shared/viewmodel/components/CardViewModel'

export function useCardViewModel({
  category,
  title,
  subtitle,
  description,
  differences = [],
}) {
  const [viewModel] = useState(() => {
    const model = new CardModel(
      category,
      title,
      subtitle,
      description,
      differences
    )
    return new CardViewModel(model)
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
