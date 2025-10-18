import { useMemo } from 'react'
import { SelectFilterModel } from './SelectFilterModel'

export function useSelectFilterViewModel(props) {
  const model = useMemo(() => new SelectFilterModel(props), [props])

  const options = useMemo(() => model.getFormattedOptions(), [model])

  return {
    options,
    name: model.name,
    id: model.id,
  }
}
