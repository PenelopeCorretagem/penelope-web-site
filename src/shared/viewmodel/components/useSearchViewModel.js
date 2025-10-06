import { useState, useMemo } from 'react'
import { SearchFilterModel } from '../../model/components/SearchFilterModel'

export function useSearchFilterViewModel() {
  const [model] = useState(() => new SearchFilterModel())

  const [filters, setFilters] = useState({
    city: 'São Paulo',
    region: '',
    type: '',
    bedrooms: '',
  })

  const options = useMemo(() => model.getOptions(), [model])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return {
    filters,
    options,
    updateFilter,
  }
}
