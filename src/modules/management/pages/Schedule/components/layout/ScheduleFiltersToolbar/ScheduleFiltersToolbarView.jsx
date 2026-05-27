import { FilterView } from '@shared/components/layout/Filter/FilterView'
import { CalendarDays, Download, BarChart2 } from 'lucide-react'
import { DatePickerView } from '@shared/components/ui/DatePicker/DatePickerView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

const DISPLAY_MODE_OPTIONS = [
  { value: 'calendar', label: 'Calendário' },
  { value: 'report', label: 'Relatório' },
]

export function ScheduleFiltersToolbarView({
  filterConfigs,
  defaultFilters,
  filtersVersion,
  onFiltersChange,
  showEstateAgentScopeSelect,
  estateAgentScopeFilterOptions,
  displayMode = 'calendar',
  availableDisplayModes = [],
  onDisplayModeChange,
  onExport,
  mobileExpandedContent,
  reportData,
}) {
  const customizedFilterConfigs = filterConfigs.map(config => {
    if (displayMode === 'calendar') {
      if (config.key === 'statusFilter') return { ...config, isSecondary: false }
      if (config.key === 'estateTypeFilter' || config.key === 'estateFilter') return { ...config, isSecondary: true }
    } else {
      if (config.key === 'statusFilter' || config.key === 'estateTypeFilter' || config.key === 'estateFilter') return { ...config, isSecondary: true }
    }
    return config
  })

  const mergedFilterConfigs = []

  if (showEstateAgentScopeSelect) {
    mergedFilterConfigs.push({
      key: 'estateAgentScopeFilter',
      options: estateAgentScopeFilterOptions,
      defaultValue: defaultFilters.estateAgentScopeFilter,
      width: 'fit',
      mobileFull: true,
      variant: 'brown',
      shape: 'square',
      isSecondary: false,
    })
  }

  mergedFilterConfigs.push(...customizedFilterConfigs)

  if (availableDisplayModes.length > 1) {
    mergedFilterConfigs.push({
      key: 'displayMode',
      options: DISPLAY_MODE_OPTIONS,
      defaultValue: 'calendar',
      width: 'fit',
      mobileFull: false,
      variant: 'pink',
      shape: 'square',
      customValue: displayMode,
      customOnChange: onDisplayModeChange,
      isSecondary: false,
    })
  }

  const handleExportReport = () => {
    if (typeof onExport === 'function') {
      onExport()
    }
  }

  const title = displayMode === 'calendar' ? 'Agenda' : 'Relatório de Agendamentos'
  const TitleIcon = displayMode === 'calendar' ? CalendarDays : BarChart2

  return (
    <div className="rounded-lg border border-default-light-muted bg-default-light px-4 py-2 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between w-full">
        {/* Title aligned to the left */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 mt-1.5">
          <TitleIcon size={20} className="text-distac-primary" />
          <h1 className="text-lg font-bold text-default-dark">{title}</h1>
        </div>

        {/* Filters and Controls aligned to the right */}
        <div className="w-full md:w-auto flex-1 flex flex-col md:flex-row md:items-start md:justify-end gap-3">

          {/* Controles do Relatório (injetados antes do FilterView) */}
          {displayMode === 'report' && reportData && (
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
              <div className="w-fit flex items-center gap-2">
                <DatePickerView
                  value={reportData.startDate ? reportData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(value) => {
                    const start = value ? new Date(value) : null
                    reportData.handleDateChange(start, reportData.endDate)
                  }}
                  minDate={null}
                  maxDate={reportData.endDate}
                  hasLabel={false}
                  placeholder="Início"
                  className="!w-fit"
                  calendarClassName="w-[min(100vw,16rem)]"
                  inputClassName=""
                />
                <span className="text-default-dark-light text-sm">até</span>
                <DatePickerView
                  value={reportData.endDate ? reportData.endDate.toISOString().split('T')[0] : ''}
                  onChange={(value) => {
                    const end = value ? new Date(value) : null
                    reportData.handleDateChange(reportData.startDate, end)
                  }}
                  minDate={reportData.startDate}
                  maxDate={null}
                  hasLabel={false}
                  placeholder="Fim"
                  className="!w-fit"
                  calendarClassName="w-[min(100vw,16rem)]"
                  inputClassName=""
                />
              </div>

              {(reportData.startDate || reportData.endDate) && (
                <ButtonView
                  type="button"
                  onClick={reportData.handleResetDates}
                  color="soft-gray"
                  shape="rectangle"
                  width="fit"
                  className=""
                  title="Limpar Datas"
                >
                  Limpar
                </ButtonView>
              )}

              <ButtonView
                type="button"
                onClick={handleExportReport}
                color="pink"
                shape="rectangle"
                width="fit"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Download size={16} />
                <span>Exportar</span>
              </ButtonView>
            </div>
          )}

          <div className="w-full md:w-auto">
            <FilterView
              key={filtersVersion || 'schedule-filter-view'}
              hideSearch={true}
              hideToggleLabel={true}
              filterConfigs={mergedFilterConfigs}
              defaultFilters={defaultFilters}
              onFiltersChange={(key, value) => {
                if (key === 'displayMode' && onDisplayModeChange) {
                  onDisplayModeChange(value)
                } else {
                  onFiltersChange(key, value)
                }
              }}
              showSortButton={false}
              showResetButton={displayMode === 'calendar'}
              mobileExpandedContent={mobileExpandedContent}
              popupStyle={{ minWidth: '22rem', width: 'min(100vw-1rem, 22rem)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
