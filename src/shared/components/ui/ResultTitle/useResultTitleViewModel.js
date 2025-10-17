import { useMemo } from 'react'
import { ResultTitleModel } from './ResultTitleModel'
import { useSearchFilterViewModel } from '../SearchFilter/useSearchViewModel'

export function useResultTitleViewModel(results) {
  const { filters } = useSearchFilterViewModel()

  const model = useMemo(() => new ResultTitleModel({ filters, results }), [filters, results])

  const title = useMemo(() => model.getTitle(), [model])

  return { title }
}
