import { useFilterViewModel } from './useFilterViewModel'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SortButtonView } from '@shared/components/ui/SortButton/SortButtonView'
import { useState, useEffect } from 'react'
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
  mobileExpandedContent = null,
  className = ''
}) => {
  const viewModel = useFilterViewModel({
    defaultFilters,
    defaultSortOrder,
    onFiltersChange
  })

  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [shouldRenderMobileFilters, setShouldRenderMobileFilters] = useState(false)
  const [isMobileFiltersAnimating, setIsMobileFiltersAnimating] = useState(false)
  const hasActiveFilters = viewModel.filterModel.hasActiveFilters(defaultFilters)

  const primaryFilters = filterConfigs.filter(config => !config.isSecondary)
  const secondaryFilters = filterConfigs.filter(config => config.isSecondary)
  const hasSecondaryFilters = secondaryFilters.length > 0

  useEffect(() => {
    if (filtersExpanded) {
      setShouldRenderMobileFilters(true)
      const timer = setTimeout(() => setIsMobileFiltersAnimating(true), 10)
      return () => clearTimeout(timer)
    }

    setIsMobileFiltersAnimating(false)
    const timer = setTimeout(() => setShouldRenderMobileFilters(false), 220)
    return () => clearTimeout(timer)
  }, [filtersExpanded])

  const renderFilterSelect = (config, extraClasses = '') => (
    <SelectView
      value={config.customValue !== undefined ? config.customValue : viewModel.filterModel.getFilter(config.key, config.defaultValue)}
      name={config.key}
      id={config.key}
      options={config.options}
      width={config.width || 'fit'}
      variant={config.variant || 'brown'}
      defaultValue={config.defaultValue}
      shape={config.shape || 'square'}
      hasLabel={false}
      onChange={(e) => {
        if (config.customOnChange) {
          config.customOnChange(e.target.value)
        } else {
          viewModel.handleFilterChange(config.key, e.target.value)
        }
      }}
      className={extraClasses}
    />
  )

  return (
    <div className={`flex flex-col gap-3 flex-shrink-0 ${className}`}>
      {/* HEADER ROW: Contains Search, Primary Filters, and Toggles */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-end">
        {/* Mobile: search bar + icons row */}
        <div className="flex md:hidden gap-3 items-center w-full">
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
            {hideSearch ? (
              <span className="inline-flex items-center justify-center gap-2 w-full">
                <SlidersHorizontal size={16} />
                <span className="text-sm font-medium">Mais Filtros</span>
              </span>
            ) : (
              <SlidersHorizontal size={16} />
            )}
          </ButtonView>
        </div>

        {/* Desktop: Primary Row */}
        <div className="hidden md:flex flex-row gap-3 items-center justify-end w-full">
          {!hideSearch && (
            <div className="w-64">
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

          {primaryFilters.map((config) => (
            <div key={config.key} className={config.width === 'full' ? 'w-64' : 'w-fit'}>
              {renderFilterSelect(config, '!h-9 !py-0 !text-sm')}
            </div>
          ))}

          {(hasSecondaryFilters || showSortButton) && (
            <div className="relative">
              <ButtonView
                type="button"
                width="fit"
                color={filtersExpanded ? 'pink' : 'outline-brown'}
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                shape="square"
                title="Mais Filtros"
                className="!h-9 !px-3 flex items-center gap-2"
              >
                <SlidersHorizontal size={16} />
                <span className="text-sm font-medium">Filtros</span>
              </ButtonView>
              {hasActiveFilters && !filtersExpanded && (
                <span className="flex h-2 w-2 rounded-full bg-distac-primary absolute -top-1 -right-1 ring-2 ring-default-light" />
              )}
            </div>
          )}

          {showResetButton && !hasSecondaryFilters && (
          <ButtonView
            type="button"
            width="fit"
            color="soft-gray"
            onClick={viewModel.handleResetFilters}
            disabled={!hasActiveFilters}
            shape="square"
            title="Limpar filtros"
            className="!h-9 !px-3"
          >
            Limpar
          </ButtonView>
          )}
        </div>
      </div>

      {/* EXPANDABLE AREA: Secondary Filters, Sort, Reset */}
      {shouldRenderMobileFilters && (
        <div
          className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out transform-gpu rounded-lg border border-default-light-muted bg-default-light-alt p-3 ${
            isMobileFiltersAnimating
              ? 'max-h-[80rem] opacity-100 translate-y-0'
              : 'max-h-0 opacity-0 -translate-y-2 !p-0 !border-transparent'
          }`}
        >
          <div className="flex flex-col md:flex-row flex-wrap gap-3">
            {/* Mobile layout: show all secondary filters (or all filters if preferred, but let's just show secondary here + primary if mobileFull logic requires it, but to keep it simple, on mobile we render secondary filters in this expanded area, while primary are already above? No, primary aren't shown on mobile above except search! We must render primary filters here on mobile if they aren't shown above.) */}
            <div className="flex md:hidden flex-wrap w-full gap-3">
              {/* On mobile, primary filters are NOT rendered in the header (except search). So we render ALL filters here. */}
              {filterConfigs.map((config) => (
                <div key={config.key} className={config.mobileFull ? 'w-full' : 'flex-1 min-w-[calc(50%-6px)]'}>
                  {renderFilterSelect(config, '!text-[11px] !py-2 !px-2 !h-auto')}
                </div>
              ))}
            </div>

            {/* Desktop layout for secondary filters */}
            <div className="hidden md:flex flex-wrap gap-3 items-end w-full">
              {secondaryFilters.map((config) => (
                <div key={config.key} className={config.width === 'full' ? 'w-64' : 'w-fit'}>
                  <span className="block text-[10px] text-default-dark-light mb-1 font-medium px-1">
                    {config.options[0]?.label?.includes('Todos') || config.options[0]?.label?.includes('Nenhum') ? 'Filtrar por:' : ''}
                  </span>
                  {renderFilterSelect(config, '!h-9 !text-sm')}
                </div>
              ))}
                 
              <div className="ml-auto flex items-center gap-3">
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
                    className="!h-9"
                  />
                </div>
                )}

                {showResetButton && (
                <div className="w-fit">
                  <ButtonView
                    type="button"
                    width="fit"
                    color="soft-gray"
                    onClick={viewModel.handleResetFilters}
                    disabled={!hasActiveFilters}
                    shape="square"
                    title="Limpar filtros"
                    className="!h-9 !text-sm"
                  >
                    Limpar Filtros
                  </ButtonView>
                </div>
                )}
              </div>
            </div>
              
            {/* Mobile bottom row for sort and reset */}
            <div className="flex md:hidden gap-3 w-full items-stretch mt-2">
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
                  className="h-full !py-2"
                />
              </div>
              )}

              {showResetButton && (
              <div className="flex-1">
                <ButtonView
                  type="button"
                  width="full"
                  color="soft-gray"
                  onClick={viewModel.handleResetFilters}
                  disabled={!hasActiveFilters}
                  shape="square"
                  title="Limpar filtros"
                  className="!text-[11px] !font-medium !py-2 h-full"
                >
                  Limpar
                </ButtonView>
              </div>
              )}
            </div>
          </div>
           
          {mobileExpandedContent && (
          <div className="w-full mt-2 pt-3 border-t border-default-light-muted flex flex-col gap-4">
            {mobileExpandedContent}
          </div>
          )}
        </div>
      )}
    </div>
  )
}
