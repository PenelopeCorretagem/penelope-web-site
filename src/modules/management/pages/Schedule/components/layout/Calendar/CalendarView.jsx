import { ScheduleFiltersToolbarView } from '../ScheduleFiltersToolbar/ScheduleFiltersToolbarView'
import { CalendarLeftSidebarView } from './components/layout/CalendarLeftSidebar/CalendarLeftSidebarView'
import { CalendarPanelView } from './components/layout/CalendarPanel/CalendarPanelView'
import { CalendarRightSidebarView } from './components/layout/CalendarRightSidebar/CalendarRightSidebarView'
import { ScheduleModel } from '../../../ScheduleModel'

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
  const renderMiniCalendarDay = (day, index) => {
    if (!day) {
      return <div key={`empty-${index}`} className="bg-default-light-muted" />
    }

    const cellDate = new Date(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth(), day)
    const isCurrent = day === vm.selectedDate.getDate()
    const isPassedDay = ScheduleModel.isPastDate(cellDate)
    const dateKey = cellDate.toISOString().split('T')[0]
    const count = vm.appointmentsCountByDate[dateKey] || 0

    return (
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => vm.setSelectedDate(cellDate)}
        className={`aspect-square rounded-md text-sm font-medium transition relative ${
          isCurrent
            ? 'bg-distac-primary text-default-light'
            : isPassedDay
              ? 'bg-default-light-muted opacity-60'
              : 'bg-default-light-alt hover:bg-default-light-muted'
        }`}
      >
        <div className="relative h-full flex items-center justify-center">
          {day}
          {count > 0 && !isPassedDay && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-distac-primary rounded-full" />
          )}
        </div>
      </button>
    )
  }

  return (
    <>
      {/* Toolbar de Filtros */}
      <div className="relative z-20">
        <ScheduleFiltersToolbarView
          filterConfigs={filterConfigs}
          defaultFilters={
            showEstateAgentScopeSelect
              ? { ...defaultFilters, estateAgentScopeFilter: vm.defaultEstateAgentFilter }
              : defaultFilters
          }
          onFiltersChange={onFiltersChange}
          showEstateAgentScopeSelect={showEstateAgentScopeSelect}
          estateAgentScopeFilterOptions={estateAgentScopeFilterOptions}
          displayMode={displayMode}
          availableDisplayModes={availableDisplayModes}
          onDisplayModeChange={onDisplayModeChange}
          mobileExpandedContent={mobileExpandedContent}
        />
      </div>

      {/* Layout Principal */}
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
            onTimeSlotClick={vm.canManageAppointments ? vm.handleTimeSlotClick : undefined}
            isPastDate={ScheduleModel.isPastDate}
            isSameDay={ScheduleModel.isSameDay}
            canChangeViewMode={vm.canChangeViewMode}
            isAllAgentsMode={vm.isAllAgentsSelected}
            estateAgentScopeFilterOptions={vm.estateAgentScopeFilterOptions}
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
    </>
  )
}
