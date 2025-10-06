import { useSearchFilterViewModel } from '../../viewmodel/components/useSearchViewModel'
import { SelectFilterView } from './SelectFilterView'
import { ButtonView } from './ButtonView'
import { Funnel, Search } from 'lucide-react'

export function SearchFilter() {
  const { filters, options, updateFilter, handleSearch } =
    useSearchFilterViewModel()

  return (
    <div className='flex flex-wrap items-center justify-center gap-4 border-y-2 border-gray-400 bg-[#cbcbcb] p-4 shadow'>
      <SelectFilterView
        name='city'
        value={filters.city}
        options={options.cities}
        onChange={e => updateFilter('city', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
      />

      <SelectFilterView
        name='region'
        value={filters.region}
        options={options.regions}
        onChange={e => updateFilter('region', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
      />

      <SelectFilterView
        name='type'
        value={filters.type}
        options={options.types}
        onChange={e => updateFilter('type', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
      />

      <SelectFilterView
        name='bedrooms'
        value={filters.bedrooms}
        options={options.bedrooms}
        onChange={e => updateFilter('bedrooms', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
      />

      <ButtonView variant='filtro' shape='square' width='fit'>
        <Funnel className='h-4 w-4' />
      </ButtonView>

      <ButtonView
        variant='busca'
        shape='square'
        width='fit'
        onClick={handleSearch}
      >
        <Search className='h-4 w-4' />
      </ButtonView>
    </div>
  )
}
