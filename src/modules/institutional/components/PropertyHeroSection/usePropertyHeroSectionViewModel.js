import { EPropertyCardCategory } from '@domains/property/PropertyCard/EPropertyCardCategory.js'

export function usePropertyHeroSectionViewModel(model) {
  const bgMap = {
    [EPropertyCardCategory.LANCAMENTO]: 'bg-distac-primary',
    [EPropertyCardCategory.EM_OBRAS]: 'bg-distac-secondary-light',
    [EPropertyCardCategory.DISPONIVEL]: 'bg-distac-secondary',
  }
  const bgClass = bgMap[model.category] || 'bg-distac-primary'

  return {
    bgClass,
    ...model,
  }
}
