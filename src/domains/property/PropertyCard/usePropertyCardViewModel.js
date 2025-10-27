import { useState, useCallback, useMemo } from 'react'
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


  get hasDifferences() {
    return this.model.hasDifferences
  }

  handleButtonClick(onButtonClick) {
    if (typeof onButtonClick === 'function') {
      onButtonClick({
        category: this.model.category,
        title: this.model.title,
        subtitle: this.model.subtitle,
      })
    }
  }
}

export function usePropertyCardViewModel({
  category,
  title,
  subtitle,
  description,
  differences = [],
  onButtonClick,
}) {
  const model = useMemo(() => {
    try {
      return new PropertyCardModel(
        category,
        title,
        subtitle,
        description,
        differences
      )
    } catch (error) {
      console.error('Erro ao criar PropertyCardModel:', error)
      return null
    }
  }, [category, title, subtitle, description, differences])

  const [viewModel] = useState(() => {
    if (!model) return null
    return new PropertyCardViewModel(model)
  })

  const handleButtonClick = useCallback(() => {
    if (!viewModel) return
    viewModel.handleButtonClick(onButtonClick)
  }, [viewModel, onButtonClick])

  if (!viewModel) {
    return {
      categoryLabel: null,
      button: null,
      formattedDifferences: [],
      hasDifferences: false,
      handleButtonClick: () => {},
      hasError: true,
    }
  }

  return {
    categoryLabel: viewModel.categoryLabel,
    button: viewModel.button,
    formattedDifferences: viewModel.formattedDifferences,
    hasDifferences: viewModel.hasDifferences,
    handleButtonClick,
    hasError: false,
  }
}

export { PropertyCardViewModel }
