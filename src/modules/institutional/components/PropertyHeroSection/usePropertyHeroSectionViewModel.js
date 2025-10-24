import { EPropertyCardCategory } from '@shared/components/ui/PropertyCard/EPropertyCardCategory.js';

export function usePropertyHeroSectionViewModel(model) {
  const bgMap = {
    [EPropertyCardCategory.LANCAMENTO]: 'bg-brand-pink',
    [EPropertyCardCategory.EM_OBRAS]: 'bg-brand-soft-brown',
    [EPropertyCardCategory.DISPONIVEL]: 'bg-brand-brown',
  };
  const bgClass = bgMap[model.category] || 'bg-brand-pink';

  return {
    bgClass,
    ...model,
  };
}