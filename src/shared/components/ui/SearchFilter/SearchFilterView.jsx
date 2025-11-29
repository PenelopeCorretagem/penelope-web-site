import { useSearchFilterViewModel } from '@shared/components/ui/SearchFilter/useSearchViewModel'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { FaSearch } from 'react-icons/fa'

export function SearchFilterView({
  filters: externalFilters = null,
  updateFilter: externalUpdate = null,
  handleSearch: externalHandleSearch = null,
  onApply: externalOnApply = null,
  options: externalOptions = null,
  className = '',
  citySelectClassName = '',
  regionSelectClassName = '',
  typeSelectClassName = '',
  bedroomsSelectClassName = '',
  selectClassName = ''
}) {
  const { filters: localFilters, options: defaultOptions, updateFilter: localUpdate } = useSearchFilterViewModel()
  const filters = externalFilters || localFilters
  const updateFilter = externalUpdate || localUpdate
  const handleSearch = externalHandleSearch || (() => {})
  const onApply = externalOnApply || (() => {})
  const options = externalOptions || defaultOptions

  return (
    <div className={`flex flex-wrap items-center justify-center gap-card md:gap-card-md bg-default-light-muted p-card md:p-card-md ${className}`}>
      <SelectView
        name='city'
        value={filters.city}
        options={options.cities}
        onChange={e => updateFilter('city', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
        className={citySelectClassName || selectClassName}
      />

      <SelectView
        name='region'
        value={filters.region}
        options={options.regions}
        onChange={e => updateFilter('region', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
        className={regionSelectClassName || selectClassName}
      />

      <SelectView
        name='type'
        value={filters.type}
        options={options.types}
        onChange={e => updateFilter('type', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
        className={typeSelectClassName || selectClassName}
      />

      <SelectView
        name='bedrooms'
        value={filters.bedrooms}
        options={options.bedrooms}
        onChange={e => updateFilter('bedrooms', e.target.value)}
        variant='default'
        shape='square'
        width='fit'
        className={bedroomsSelectClassName || selectClassName}
      />

      {/* <ButtonView
        variant='soft-brown'
        shape='square'
        width='fit'
        onClick={onApply}
        className='h-10 w-10 p-7'
        title='Filtrar'
      >
        <FaFilter className='h-4 w-4' aria-hidden='true' />
        <span className='sr-only'>Filtrar</span>
      </ButtonView> */}

      <ButtonView
        shape='square'
        width='fit'
        onClick={onApply}
        className='!p-button-x'
        color='brown'
        title='Buscar'
      >
        <FaSearch className='' aria-hidden='true' />
        <span className='sr-only'>Buscar</span>
      </ButtonView>
    </div>
  )
}
