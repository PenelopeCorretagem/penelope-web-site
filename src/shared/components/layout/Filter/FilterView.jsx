import { useFilterViewModel } from './useFilterViewModel'
import { InputView } from '@shared/components/ui/Input/InputView'
import { SelectView } from '@shared/components/ui/Select/SelectView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { SortButtonView } from '@shared/components/ui/SortButton/SortButtonView'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
  onReset,
  hasExternalActiveFilters = false,
  showResetButton = true,
  showSortButton = true,
  showSortButtonInPrimaryRow: showSortButtonInPrimaryRowProp = false,
  hideSearch = false,
  hideToggleLabel = false,
  mobileExpandedContent = null,
  popupStyle = {},
  className = ''
}) => {
  const viewModel = useFilterViewModel({
    defaultFilters,
    defaultSortOrder,
    onFiltersChange,
    onReset
  })

  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [shouldRenderMobileFilters, setShouldRenderMobileFilters] = useState(false)
  const [isMobileFiltersAnimating, setIsMobileFiltersAnimating] = useState(false)
  const [maxSelectWidth, setMaxSelectWidth] = useState(0)
  const selectRefs = useRef(new Map())
  const filterPopupRef = useRef(null)

  useEffect(() => {
    if (!filtersExpanded) return

    const handleClickOutside = (event) => {
      const target = event.target
      const isInsidePopup = filterPopupRef.current?.contains(target)
      const isToggleButton = target instanceof Element && target.closest('.filter-view-toggle-button')
      if (!isInsidePopup && !isToggleButton) {
        setFiltersExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [filtersExpanded])

  const hasActiveFilters = viewModel.filterModel.hasActiveFilters(defaultFilters)
  const hasAnyActiveFilters = hasActiveFilters || hasExternalActiveFilters

  const primaryFilters = filterConfigs.filter(config => !config.isSecondary)
  const secondaryFilters = filterConfigs.filter(config => config.isSecondary)
  const hasSecondaryFilters = secondaryFilters.length > 0
  const shouldShowSortButtonInPrimaryRow = showSortButton && (showSortButtonInPrimaryRowProp || !hasSecondaryFilters)

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

  const equalWidthFilterKeys = useMemo(() => {
    return new Set(
      filterConfigs
        .filter(config => config.isSecondary || filtersExpanded)
        .map(config => config.key)
    )
  }, [filterConfigs, filtersExpanded])

  const updateMaxSelectWidth = useCallback(() => {
    const widths = Array.from(selectRefs.current.entries())
      .filter(([key]) => equalWidthFilterKeys.has(key))
      .map(([, element]) => element?.getBoundingClientRect()?.width || 0)

    const maxWidth = widths.reduce((currentMax, width) => Math.max(currentMax, width), 0)
    if (maxWidth && maxWidth !== maxSelectWidth) {
      setMaxSelectWidth(maxWidth)
    }
  }, [equalWidthFilterKeys, maxSelectWidth])

  useEffect(() => {
    updateMaxSelectWidth()

    window.addEventListener('resize', updateMaxSelectWidth)
    return () => window.removeEventListener('resize', updateMaxSelectWidth)
  }, [updateMaxSelectWidth, filterConfigs.length, shouldRenderMobileFilters])

  const setSelectRef = (key) => (element) => {
    if (element) {
      selectRefs.current.set(key, element)
    } else {
      selectRefs.current.delete(key)
    }
  }

  const renderFilterSelect = (config, extraClasses = '', useEqualWidth = false, dropdownInline = false) => (
    <SelectView
      ref={setSelectRef(config.key)}
      value={config.customValue !== undefined ? config.customValue : viewModel.filterModel.getFilter(config.key, config.defaultValue)}
      name={config.key}
      id={config.key}
      options={config.options}
      width={config.width || 'fit'}
      variant={config.variant || 'brown'}
      defaultValue={config.defaultValue}
      shape={config.shape || 'square'}
      hasLabel={false}
      dropdownInline={dropdownInline}
      onChange={(e) => {
        if (config.customOnChange) {
          config.customOnChange(e.target.value)
        } else {
          viewModel.handleFilterChange(config.key, e.target.value)
        }
      }}
      className={`whitespace-nowrap ${extraClasses}`}
      style={useEqualWidth && maxSelectWidth ? { minWidth: `${maxSelectWidth}px` } : undefined}
    />
  )

  return (
    <div className={`relative flex flex-col gap-3 w-full overflow-visible ${className}`}>
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
            onClick={() => setFiltersExpanded((prev) => !prev)}
            shape="square"
            title="Expandir filtros"
            className="filter-view-toggle-button"
          >
            {hideSearch ? (
              hideToggleLabel ? (
                <SlidersHorizontal size={13} />
              ) : (
                <span className="inline-flex items-center justify-center gap-2 w-full">
                  <SlidersHorizontal size={13} />
                  <span className="text-sm font-medium">Mais Filtros</span>
                </span>
              )
            ) : (
              <SlidersHorizontal size={13} />
            )}
          </ButtonView>

          {showResetButton && (
            <ButtonView
              type="button"
              width="fit"
              color="soft-gray"
              onClick={viewModel.handleResetFilters}
              disabled={!hasActiveFilters}
              shape="square"
              title="Limpar filtros"
              className=""
            >
              Limpar
            </ButtonView>
          )}
        </div>

        {/* Desktop: Primary Row */}
        <div className="hidden md:flex flex-row gap-3 items-center justify-end w-full">
          {!hideSearch && (
            <div className="w-full">
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
              {renderFilterSelect(config, '!text-sm', false)}
            </div>
          ))}

          {shouldShowSortButtonInPrimaryRow && (
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
              className=""
            />
          </div>
          )}

          {hasSecondaryFilters && (
            <div className="relative">
              <ButtonView
                type="button"
                width="fit"
                color={filtersExpanded ? 'pink' : 'outline-brown'}
                onClick={() => setFiltersExpanded((prev) => !prev)}
                shape="rectangle"
                title="Mais Filtros"
                className="filter-view-toggle-button gap-2"
              >
                <SlidersHorizontal size={14} />
                <span className="">Filtros</span>
              </ButtonView>
              {hasAnyActiveFilters && !filtersExpanded && (
                <span className="flex h-2 w-2 rounded-full bg-distac-primary absolute -top-1 -right-1 ring-2 ring-default-light" />
              )}
            </div>
          )}

          {showResetButton && (
            <ButtonView
              type="button"
              width="fit"
              color="soft-gray"
              onClick={viewModel.handleResetFilters}
              disabled={!hasAnyActiveFilters}
              shape="rectangle"
              title="Limpar filtros"
              className=""
            >
              Limpar
            </ButtonView>
          )}
        </div>
      </div>

      {/* EXPANDABLE AREA: Secondary Filters, Sort, Reset */}
      {shouldRenderMobileFilters && (
        <div
          ref={filterPopupRef}
          className="fixed left-1/2 top-50 z-50 mx-auto w-[min(100vw-1rem,22rem)] -translate-x-1/2 overflow-auto transition-all duration-300 ease-in-out transform-gpu rounded-3xl border border-default-light-muted bg-default-light-alt shadow-lg filter-view-popup md:absolute md:left-auto md:right-0 md:top-full md:mx-0 md:translate-x-0 md:w-auto"
          style={{
            opacity: isMobileFiltersAnimating ? 1 : 0,
            transform: isMobileFiltersAnimating ? 'translateY(0)' : 'translateY(-0.5rem)',
            padding: isMobileFiltersAnimating ? '1rem' : '0',
            borderColor: isMobileFiltersAnimating ? undefined : 'transparent',
            maxHeight: '60vh',
            ...popupStyle,
          }}
        >
          <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full">
            {/* Mobile layout: all filters rendered here since primary aren't shown above on mobile */}
            <div className="grid md:hidden grid-cols-1 gap-3 w-full">
              {filterConfigs.map((config) => (
                <div key={config.key} className="w-full">
                  {renderFilterSelect({ ...config, width: 'full' }, '!text-sm !py-3 !px-3 !h-auto !w-full !whitespace-normal', false, true)}
                </div>
              ))}
            </div>

            {/* Desktop layout for secondary filters */}
            <div className="hidden md:flex flex-col gap-3 items-end w-fit">
              {secondaryFilters.map((config) => (
                <div key={config.key} className={config.width === 'full' ? 'w-64' : 'w-fit'}>
                  <span className="block text-[10px] text-default-dark-light mb-1 font-medium px-1">
                    {config.options[0]?.label?.includes('Todos') || config.options[0]?.label?.includes('Nenhum') ? 'Filtrar por:' : ''}
                  </span>
                  {renderFilterSelect(config, ' !text-sm !w-full', true)}
                </div>
              ))}

              <div className="ml-auto flex items-center gap-3">
                {showSortButton && !shouldShowSortButtonInPrimaryRow && (
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
                      className=""
                    />
                  </div>
                )}
              </div>
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
