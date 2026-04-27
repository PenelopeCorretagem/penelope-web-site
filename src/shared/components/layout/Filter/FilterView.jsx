import { useFilterViewModel } from './useFilterViewModel'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SortButtonView } from '@shared/components/ui/SortButton/SortButtonView'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'

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
  className = ''
}) => {
  const viewModel = useFilterViewModel({
    defaultFilters,
    defaultSortOrder,
    onFiltersChange
  })

  const [filtersExpanded, setFiltersExpanded] = useState(false)

  return (
    <div className={`flex flex-col gap-4 flex-shrink-0 ${className}`}>
      {/* Mobile: search bar + icons */}
      <div className="flex md:hidden gap-3 items-center">
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
        <ButtonView
          type="button"
          width={hideSearch ? 'full' : 'fit'}
          color={filtersExpanded ? 'pink' : 'brown'}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          shape="square"
          title="Expandir filtros"
        >
          {hideSearch ? 'Filtros' : <SlidersHorizontal size={16} />}
        </ButtonView>
      </div>

      {/* Mobile: expandable filters */}
      {filtersExpanded && (
        <div className="flex md:hidden flex-wrap gap-3">
          {filterConfigs.map((config) => (
            <div key={config.key} className="flex-1 min-w-[calc(50%-6px)]">
              <SelectView
                value={viewModel.filterModel.getFilter(config.key, config.defaultValue)}
                name={config.key}
                id={config.key}
                options={config.options}
                width="full"
                variant={config.variant || 'brown'}
                defaultValue={config.defaultValue}
                shape={config.shape || 'square'}
                hasLabel={false}
                onChange={(e) => viewModel.handleFilterChange(config.key, e.target.value)}
                className="!text-[9px] !leading-tight"
              />
            </div>
          ))}

          <div className="flex gap-3 flex-1 min-w-[calc(50%-6px)] items-stretch">
            {showSortButton && (
              <div className="flex-1">
                <SortButtonView
                  sortOrder={
                    viewModel.filterModel.sortOrder === 'asc' ? 'ascending' :
                      viewModel.filterModel.sortOrder === 'desc' ? 'descending' : 'none'
                  }
                  onSortChange={viewModel.handleSortOrderChange}
                  title={viewModel.getSortTitle()}
                  width="full"
                  shape="square"
                  color="brown"
                  className="h-full"
                />
              </div>
            )}

            {showResetButton && viewModel.filterModel.hasActiveFilters(defaultFilters) && (
              <div className="flex-1">
                <ButtonView
                  type="button"
                  width="full"
                  color="soft-gray"
                  onClick={viewModel.handleResetFilters}
                  shape="square"
                  title="Limpar filtros"
                  className="h-full"
                >
                  Limpar
                </ButtonView>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop: original layout */}
      <div className="hidden md:flex flex-row gap-4 md:items-end">
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

        {filterConfigs.map((config) => (
          <div
            key={config.key}
            className={config.width === 'full' ? 'w-64' : 'w-fit'}
          >
            <SelectView
              value={viewModel.filterModel.getFilter(config.key, config.defaultValue)}
              name={config.key}
              id={config.key}
              options={config.options}
              width={config.width || 'fit'}
              variant={config.variant || 'brown'}
              defaultValue={config.defaultValue}
              shape={config.shape || 'square'}
              hasLabel={false}
              onChange={(e) => viewModel.handleFilterChange(config.key, e.target.value)}
            />
          </div>
        ))}

        {showSortButton && (
          <div className="w-fit">
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
          <div className="w-fit">
            <ButtonView
              type="button"
              width="full"
              color="soft-gray"
              onClick={viewModel.handleResetFilters}
              shape="square"
              title="Limpar filtros"
              className="h-full"
            >
              Limpar
            </ButtonView>
          </div>
        )}
      </div>
    </div>
  )
}
