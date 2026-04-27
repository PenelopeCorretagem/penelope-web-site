import { FilterView } from '@shared/components/layout/Filter/FilterView'
import { LabelView } from '@shared/components/ui/Label/LabelView'
import { LabelModel } from '@shared/components/ui/Label/LabelModel'
import { SlidersHorizontal } from 'lucide-react'

const filterLabelModel = new LabelModel('Filtros', 'gray')

export function ScheduleFiltersToolbarView({
  filterConfigs,
  defaultFilters,
  filtersVersion,
  onFiltersChange,
  showEstateAgentScopeSelect,
  estateAgentScopeFilterOptions,
  mobileExpandedContent,
}) {
  const mergedFilterConfigs = showEstateAgentScopeSelect
    ? [
      {
        key: 'estateAgentScopeFilter',
        options: estateAgentScopeFilterOptions,
        defaultValue: defaultFilters.estateAgentScopeFilter,
        width: 'fit',
        mobileFull: true,
        variant: 'brown',
        shape: 'square',
      },
      ...filterConfigs,
    ]
    : filterConfigs
  return (
    <div className="rounded-lg border border-default-light-muted bg-default-light px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-end h-full">
        <div className="w-full h-full xl:ml-auto xl:flex xl:items-end xl:justify-between xl:gap-3">
          <div className="hidden xl:flex h-full">
            <LabelView
              model={filterLabelModel}
              leadingIcon={<SlidersHorizontal size={18} className="text-default-light" />}
              className=""
            />
          </div>

          <div className="w-full xl:w-fit xl:flex xl:items-center xl:gap-3">
            <div className="w-full xl:w-fit">
              <FilterView
                key={filtersVersion || 'schedule-filter-view'}
                hideSearch={true}
                filterConfigs={mergedFilterConfigs}
                defaultFilters={defaultFilters}
                onFiltersChange={onFiltersChange}
                showSortButton={false}
                showResetButton={true}
                mobileExpandedContent={mobileExpandedContent}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
