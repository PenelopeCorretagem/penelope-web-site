import { useSearchFilterViewModel } from '@shared/components/ui/SearchFilter/useSearchViewModel'
import { SelectFilterView } from '@shared/components/ui/SelectFilter/SelectFilterView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ButtonModel } from '@shared/components/ui/Button/ButtonModel'
import { FaSearch, FaFilter } from 'react-icons/fa'

export function SearchFilterView() {
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

      <ButtonView
        variant='softbrown'
        shape='square'
        width='fit'
        model={new ButtonModel(<FaFilter className='h-4 w-4' />
          , 'brown', 'button')}
        className='h-13 w-4'
      >
      </ButtonView>

      <ButtonView
        variant='brown'
        shape='square'
        width='fit'
        onClick={handleSearch}
        model={new ButtonModel(<FaSearch className='h-4 w-4' />
          , 'pink', 'button')}
        className='h-13 w-13'
      >
      </ButtonView>
    </div>
  )
}
