import { useState, useCallback } from 'react'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { getLabelThemeClasses } from '@shared/styles/theme'

/**
 * LabelViewModel - Gerencia apresentação e tema do label
 */
class LabelViewModel {
  constructor(model = new LabelModel()) {
    this.model = model
  }

  get displayText() {
    return this.model.text || 'Label'
  }

  get variant() {
    return this.model.variant
  }

  get hasText() {
    return this.model.hasText()
  }

  get finalClassName() {
    return getLabelThemeClasses({
      variant: this.variant,
    })
  }

  updateText = newText => {
    this.model.updateText(newText)
    return true
  }

  updateVariant = newVariant => {
    this.model.updateVariant(newVariant)
    return true
  }
}

/**
 * Hook simplificado para Label
 */
export function useLabelViewModel(initialModel) {
  const [viewModel] = useState(() => new LabelViewModel(initialModel))
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => {
    forceUpdate(prev => prev + 1)
  }, [])

  const commands = {
    updateText: text => {
      viewModel.updateText(text)
      refresh()
      return true
    },

    updateVariant: variant => {
      viewModel.updateVariant(variant)
      refresh()
      return true
    },
  }

  return {
    displayText: viewModel.displayText,
    variant: viewModel.variant,
    hasText: viewModel.hasText,
    finalClassName: viewModel.finalClassName,
    ...commands,
  }
}

export { LabelViewModel }
