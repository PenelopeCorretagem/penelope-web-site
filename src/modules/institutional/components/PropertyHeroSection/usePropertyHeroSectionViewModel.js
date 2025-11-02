export function usePropertyHeroSectionViewModel(model) {
  const bgMap = {
    ['lancamento']: 'bg-distac-primary',
    ['em_obras']: 'bg-distac-secondary-light',
    ['disponivel']: 'bg-distac-secondary',
  }
  const bgClass = bgMap[model.category] || 'bg-distac-primary'

  return {
    bgClass,
    ...model,
  }
}
