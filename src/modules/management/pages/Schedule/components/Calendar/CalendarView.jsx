import { HeaderManagementView } from '@management/components/HeaderManagement/HeaderManagementView'
import { FilterView } from '@shared/components/ui/Filter/FilterView'
import { CalendarLeftSidebarView } from './components/CalendarLeftSidebar/CalendarLeftSidebarView'
import { CalendarPanelView } from './components/CalendarPanel/CalendarPanelView'
import { CalendarRightSidebarView } from './components/CalendarRightSidebar/CalendarRightSidebarView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'
import { ScheduleModel } from '../../ScheduleModel'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

/**
 * CalendarView.jsx
 * Tela do calendário de agendamentos
 */

export function CalendarView({
  // ViewModel
  vm,
  // Filtros
  filterConfigs,
  defaultFilters,
  showEstateAgentScopeSelect,
  estateAgentScopeFilterOptions,
  onFiltersChange,
  onDisplayModeChange,
  availableDisplayModes,
  displayMode,
  // Modais
  mobileExpandedContent,
}) {

  const DISPLAY_MODE_OPTIONS = [
    { value: 'calendar', label: 'Calendário' },
    { value: 'report', label: 'Relatório' },
  ]

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

  const isLoading = vm.loading || vm.isScopeLoading
  const isMinLoading = useMinLoadingTime(isLoading);

  return (
    <>
      {/* Toolbar de Filtros */}
      <div className="relative z-20">
        <HeaderManagementView
          iconName="Calendar"
          title="Agenda"
          className=""
        >
          <div className="flex flex-wrap items-center gap-3">
            <FilterView
              filterConfigs={mergedFilterConfigs}
              defaultFilters={
                showEstateAgentScopeSelect
                  ? { ...defaultFilters, estateAgentScopeFilter: vm.defaultEstateAgentFilter }
                  : defaultFilters
              }
              onFiltersChange={onFiltersChange}
              showResetButton={true}
              showSortButton={false}
              hideSearch={true}
              hideToggleLabel={true}
              popupStyle={{ minWidth: '22rem', width: 'min(100vw-1rem, 22rem)' }}
              mobileExpandedContent={mobileExpandedContent}
              className='w-fit'
            />
          </div>
        </HeaderManagementView>
      </div>

      {/* Layout Principal */}
      {isMinLoading ? (
        <div className="flex-1 min-h-[500px] flex flex-col xl:flex-row gap-4 md:gap-6 xl:h-full xl:overflow-hidden relative z-0">
          <SkeletonView className="h-full xl:w-[320px] order-1" />
          <SkeletonView className="h-full flex-1 order-2" />
          <SkeletonView className="h-full xl:w-[320px] order-3" />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col xl:flex-row gap-4 md:gap-6 xl:h-full xl:overflow-hidden relative z-0">
          {/* Main Calendar Panel - Rendered first in DOM for mobile */}
          <div className="xl:order-2 flex-1 min-h-0 min-w-0 flex flex-col">
            <CalendarPanelView
              viewMode={vm.viewMode}
              setViewMode={vm.setViewMode}
              onNavigatePeriod={vm.handleNavigatePeriod}
              navigateLabels={vm.navigateLabels}
              weekdayLabels={vm.weekdayLabels}
              weekDates={vm.weekDates}
              selectedDate={vm.selectedDate}
              selectedDateAppointments={vm.selectedDateAppointments}
              filteredAppointments={vm.filteredAppointments}
              calendarDays={vm.calendarDays}
              hours={vm.hours}
              appointmentsByDay={vm.appointmentsByDay}
              onSelectDate={vm.setSelectedDate}
              onOpenAppointmentTools={vm.handleOpenAppointmentTools}
              onTimeSlotClick={vm.canCreateAppointments ? vm.handleTimeSlotClick : undefined}
              isPastDate={ScheduleModel.isPastDate}
              isSameDay={ScheduleModel.isSameDay}
              canChangeViewMode={vm.canChangeViewMode}
              isAllAgentsMode={vm.isAllAgentsSelected}
              estateAgentScopeFilterOptions={vm.estateAgentScopeFilterOptions}
              workSchedule={vm.workSchedule}
            />
          </div>

          {/* Left Sidebar - Second on mobile, First on desktop */}
          <div className="xl:order-1 flex-shrink-0 xl:h-full xl:min-h-0">
            <CalendarLeftSidebarView
              selectedDate={vm.selectedDate}
              selectedDateAppointments={vm.selectedDateAppointments}
              selectedDateAppointmentsByStatus={vm.selectedDateAppointmentsByStatus}
              onOpenAppointmentTools={vm.handleOpenAppointmentTools}
              canManageAppointments={vm.canManageAppointments}
            />
          </div>

          {/* Right Sidebar - Third on mobile, Third on desktop */}
          <div className="xl:order-3 flex-shrink-0 xl:h-full xl:min-h-0">
            <CalendarRightSidebarView
              currentMonthName={vm.currentMonthName}
              weekdayLabels={vm.weekdayLabels}
              calendarDays={vm.calendarDays}
              selectedDate={vm.selectedDate}
              appointmentsCountByDate={vm.appointmentsCountByDate}
              monthlyAppointmentsByStatus={vm.monthlyAppointmentsByStatus}
              onGoToToday={vm.handleGoToToday}
              onChangeMonth={vm.handleChangeMonth}
              onSelectDate={vm.setSelectedDate}
              isPastDate={ScheduleModel.isPastDate}
              isSameDay={ScheduleModel.isSameDay}
            />
          </div>
        </div>
      )}
    </>
  )
}
