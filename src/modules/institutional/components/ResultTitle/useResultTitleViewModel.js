import { useMemo } from 'react'
import { ResultTitleModel } from './ResultTitleModel'
import { useSearchFilterViewModel } from '@shared/components/ui/SearchFilter/useSearchViewModel'

export function useResultTitleViewModel(results, externalFilters = null) {

  const { filters: hookFilters } = useSearchFilterViewModel()

  const filters = externalFilters || hookFilters

  const model = useMemo(() => new ResultTitleModel({ filters, results }), [filters, results])

  const title = useMemo(() => model.getTitle(), [model])

  return { title }
}
