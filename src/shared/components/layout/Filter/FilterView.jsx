import { useFilterViewModel } from './useFilterViewModel'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { createElement } from 'react'

// ============================================
// VIEW - FilterView.jsx
// ============================================
export const FilterView = ({
  searchPlaceholder = 'Buscar...',
  filterConfigs = [], // Array de configurações de filtros
  defaultFilters = {},
  onFiltersChange,
  showResetButton = true,
  showSortButton = true,
  className
}) => {
  const viewModel = useFilterViewModel({
    defaultFilters,
    onFiltersChange
  })

  return (
    <div className={`flex flex-col gap-4 md:gap-4 flex-shrink-0 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4 md:gap-4">
        {/* Search Input */}
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
            <ButtonView
              type="button"
              width="fit"
              color={viewModel.filterModel.sortOrder !== 'none' ? 'pink' : 'brown'}
              onClick={viewModel.handleSortOrderChange}
              shape="square"
              title={viewModel.getSortTitle()}
            >
              {createElement(viewModel.getSortIcon(), { size: 16 })}
            </ButtonView>
          </div>
        )}

        {/* Reset Button */}
        {showResetButton && viewModel.filterModel.hasActiveFilters(defaultFilters) && (
          <div className="w-full md:w-fit">
            <ButtonView
              type="button"
              width="fit"
              color="brown"
              onClick={viewModel.handleResetFilters}
              shape="square"
              title="Limpar filtros"
            >
              Limpar
            </ButtonView>
          </div>
        )}
      </div>
    </div>
  )
}
