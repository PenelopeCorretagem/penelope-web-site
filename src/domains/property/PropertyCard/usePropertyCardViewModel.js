import { useState, useCallback } from 'react'
import { PropertyCardModel } from '@domains/property/PropertyCard/PropertyCardModel'

/**
 * PropertyCardViewModel - Gerencia a lógica e apresentação do PropertyCard
 * Centraliza a lógica de negócio e comportamento
 */
class PropertyCardViewModel {
  constructor(model) {
    this.model = model
  }

  get categoryLabel() {
    return this.model.getCategoryLabel()
  }

  get button() {
    return this.model.getButton()
  }

  get formattedDifferences() {
    return this.model.getDifferenceLabels()
  }

  handleButtonClick() {
    // Button click handled - could be extended with specific logic
    // this.model.getButton() contains button configuration if needed
  }
}

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

export { PropertyCardViewModel }
