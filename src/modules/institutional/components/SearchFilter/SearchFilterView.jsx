import { useSearchFilterViewModel } from '@institutional/components/SearchFilter/useSearchViewModel'
import { SelectFilterView } from '@institutional/components/SelectFilter/SelectFilterView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { FaSearch, FaFilter } from 'react-icons/fa'

export function SearchFilterView({ filters: externalFilters = null, updateFilter: externalUpdate = null, handleSearch: externalHandleSearch = null, onApply: externalOnApply = null, options: externalOptions = null }) {
  const { filters: localFilters, options: defaultOptions, updateFilter: localUpdate } = useSearchFilterViewModel()
  const filters = externalFilters || localFilters
  const updateFilter = externalUpdate || localUpdate
  const handleSearch = externalHandleSearch || (() => {})
  const onApply = externalOnApply || (() => {})
  const options = externalOptions || defaultOptions

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

      <ButtonView
        variant='soft-brown'
        shape='square'
        width='fit'
        onClick={onApply}
        className='h-10 w-10 p-7'
        title='Filtrar'
      >
        <FaFilter className='h-4 w-4' aria-hidden='true' />
        <span className='sr-only'>Filtrar</span>
      </ButtonView>

      <ButtonView
        variant='brown'
        shape='square'
        width='fit'
        onClick={handleSearch}
        className='h-10 w-10 p-7'
        title='Buscar'
      >
        <FaSearch className='h-4 w-4' aria-hidden='true' />
        <span className='sr-only'>Buscar</span>
      </ButtonView>
    </div>
  )
}
