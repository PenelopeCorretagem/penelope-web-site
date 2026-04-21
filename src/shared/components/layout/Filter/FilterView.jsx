import { useFilterViewModel } from './useFilterViewModel'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SortButtonView } from '@shared/components/ui/SortButton/SortButtonView'
import { createElement } from 'react'

// ============================================
// VIEW - FilterView.jsx
// ============================================
export const FilterView = ({
  searchPlaceholder = 'Buscar...',
  filterConfigs = [], // Array de configurações de filtros
  defaultFilters = {},
  defaultSortOrder = 'none',
  onFiltersChange,
  showResetButton = true,
  showSortButton = true,
  hideSearch = false,
  className
}) => {
  const viewModel = useFilterViewModel({
    defaultFilters,
    defaultSortOrder,
    onFiltersChange
  })

  return (
    <div className={`flex flex-col gap-4 md:gap-4 flex-shrink-0 ${className}`}>
      {/* Filters, Buttons and Search Row */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-4 md:items-end">
        {/* Search Input */}
        {!hideSearch && (
          <div className="flex-1">
            <InputView
              type="text"
              placeholder={searchPlaceholder}
              value={viewModel.filterModel.searchTerm}
              onChange={viewModel.handleSearchChange}
              hasLabel={false}
              isActive={true}
            />
          </div>
        )}

        {/* Dynamic Filters */}
        {filterConfigs.map((config) => (
          <div
            key={config.key}
            className={config.width === 'full' ? 'w-full md:w-64' : 'w-full md:w-fit'}
          >
            <SelectView
              value={viewModel.filterModel.getFilter(config.key, config.defaultValue)}
              name={config.key}
              id={config.key}
              options={config.options}
              width={config.width || 'fit'}
              variant={config.variant || 'brown'}
              shape={config.shape || 'square'}
              hasLabel={false}
              onChange={(e) => viewModel.handleFilterChange(config.key, e.target.value)}
            />
          </div>
        ))}

        {/* Sort Button */}
        {showSortButton && (
          <div className="w-full md:w-fit">
            <SortButtonView
              sortOrder={
                viewModel.filterModel.sortOrder === 'asc' ? 'ascending' :
                viewModel.filterModel.sortOrder === 'desc' ? 'descending' : 'none'
              }
              onSortChange={viewModel.handleSortOrderChange}
              title={viewModel.getSortTitle()}
              width="fit"
              shape="square"
              color="brown"
            />
          </div>
        )}

        {/* Reset Button */}
        {showResetButton && (
          <div className="w-full md:w-fit">
            <ButtonView
              type="button"
              width="fit"
              color="soft-gray"
              onClick={viewModel.handleResetFilters}
              shape="square"
              title="Limpar filtros"
              disabled={!viewModel.filterModel.hasActiveFilters(defaultFilters)}
            >
              Limpar
            </ButtonView>
          </div>
        )}
      </div>
    </div>
  )
}
