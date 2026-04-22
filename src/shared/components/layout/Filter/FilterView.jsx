import { useFilterViewModel } from './useFilterViewModel'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { createElement, useState } from 'react'
import { SlidersHorizontal, Search, ChevronUp } from 'lucide-react'

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

  const [filtersExpanded, setFiltersExpanded] = useState(false)

  return (
    <div className={`flex flex-col gap-4 md:gap-4 flex-shrink-0 ${className}`}>
      {/* Mobile: search bar + icons */}
      <div className="flex md:hidden gap-3 items-center">
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
        <ButtonView
          type="button"
          width="fit"
          color={filtersExpanded ? 'pink' : 'brown'}
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          shape="square"
          title="Expandir filtros"
        >
          <SlidersHorizontal size={16} />
        </ButtonView>
        <ButtonView
          type="button"
          width="fit"
          color="brown"
          onClick={() => viewModel.handleSearchChange({ target: { value: viewModel.filterModel.searchTerm } })}
          shape="square"
          title="Buscar"
        >
          <Search size={16} />
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
                <ButtonView
                  type="button"
                  width="full"
                  color={viewModel.filterModel.sortOrder !== 'none' ? 'pink' : 'brown'}
                  onClick={viewModel.handleSortOrderChange}
                  shape="square"
                  title={viewModel.getSortTitle()}
                  className="h-full"
                >
                  {createElement(viewModel.getSortIcon(), { size: 16 })}
                </ButtonView>
              </div>
            )}

            {showResetButton && viewModel.filterModel.hasActiveFilters(defaultFilters) && (
              <div className="flex-1">
                <ButtonView
                  type="button"
                  width="full"
                  color="brown"
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
      <div className="hidden md:flex flex-row gap-4">
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
              shape={config.shape || 'square'}
              hasLabel={false}
              onChange={(e) => viewModel.handleFilterChange(config.key, e.target.value)}
            />
          </div>
        ))}

        {showSortButton && (
          <div className="w-fit">
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

        {showResetButton && viewModel.filterModel.hasActiveFilters(defaultFilters) && (
          <div className="w-fit">
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
