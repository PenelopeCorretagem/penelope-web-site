import { FilterView } from '@shared/components/layout/Filter/FilterView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

export function ScheduleFiltersToolbarView({
  filterConfigs,
  defaultFilters,
  filtersVersion,
  onFiltersChange,
  onNavigatePeriod,
  navigateLabels,
  mobileExpandedContent,
}) {
  return (
    <div className="rounded-lg border border-default-light-muted bg-default-light px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex-1 xl:max-w-4xl">
          <FilterView
            key={filtersVersion || 'schedule-filter-view'}
            hideSearch={true}
            filterConfigs={filterConfigs}
            defaultFilters={defaultFilters}
            onFiltersChange={onFiltersChange}
            showSortButton={false}
            showResetButton={true}
            mobileExpandedContent={mobileExpandedContent}
          />
        </div>

        <div className="hidden xl:flex flex-wrap items-end gap-2 xl:justify-end">
          <div className="flex gap-2">
            <ButtonView
              type="button"
              onClick={() => onNavigatePeriod(-1)}
              color="white"
              width="fit"
              shape="rectangle"
              className=' !border-2 !border-default-light-muted !bg-default-light !text-default-dark
              hover:!border-distac-primary'
            >
              {navigateLabels.previous}
            </ButtonView>
            <ButtonView
              type="button"
              onClick={() => onNavigatePeriod(1)}
              color="white"
              width="fit"
              shape="rectangle"
              className=' !border-2 !border-default-light-muted !bg-default-light !text-default-dark hover:!border-distac-primary'
            >
              {navigateLabels.next}
            </ButtonView>
          </div>
        </div>
      </div>
    </div>
  )
}
