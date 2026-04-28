import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { AppointmentFormModalView } from './components/AppointmentFormModal/AppointmentFormModalView'
import { ScheduleModel } from './ScheduleModel'
import { useScheduleViewModel } from './useScheduleViewModel'
import { ScheduleFiltersToolbarView } from './components/ScheduleFiltersToolbarView'
import { ScheduleLeftSidebarView } from './components/ScheduleLeftSidebarView'
import { ScheduleCalendarPanelView } from './components/ScheduleCalendarPanelView'
import { ScheduleRightSidebarView } from './components/ScheduleRightSidebarView'
import { AppointmentToolsModalView } from './components/AppointmentToolsModalView'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

export function ScheduleView() {
  const vm = useScheduleViewModel()

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

  const mobileExpandedContent = (
    <div className="flex flex-col gap-4 w-full bg-default-light rounded-lg border border-default-light-muted p-4 shadow-sm mt-2 xl:hidden">
      {/* Mini Calendar Mobile */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-default-dark">Navegação</h3>
          <ButtonView
            type="button"
            onClick={vm.handleGoToToday}
            color="brown"
            width="fit"
            shape="rectangle"
            className="!px-3 !py-2 !text-xs !font-medium"
          >
            Hoje
          </ButtonView>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-default-dark">{vm.currentMonthName}</h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => vm.handleChangeMonth(-1)}
              className="p-1 hover:bg-default-light-muted rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => vm.handleChangeMonth(1)}
              className="p-1 hover:bg-default-light-muted rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted mb-2">
          {vm.weekdayLabels.map(label => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {vm.calendarDays.map((day, index) => renderMiniCalendarDay(day, index))}
        </div>
      </div>
    </div>
  )

  return (
    <SectionView className="flex-col !gap-4 md:!gap-6 !p-4 md:!p-6 bg-default-light-alt xl:h-full relative">

      <div className="relative z-20">
        <ScheduleFiltersToolbarView
          filterConfigs={vm.filterConfigs}
          defaultFilters={vm.showEstateAgentScopeSelect
            ? { ...vm.defaultFilters, estateAgentScopeFilter: vm.defaultEstateAgentFilter }
            : vm.defaultFilters}
          onFiltersChange={vm.handleFiltersChange}
          showEstateAgentScopeSelect={vm.showEstateAgentScopeSelect}
          estateAgentScopeFilterOptions={vm.estateAgentScopeFilterOptions}
          mobileExpandedContent={mobileExpandedContent}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col xl:flex-row gap-4 md:gap-6 xl:h-full xl:overflow-hidden relative z-0">

        {/* Main Calendar Panel - Rendered first in DOM for mobile */}
        <div className="xl:order-2 flex-1 min-h-0 min-w-0 flex flex-col">
          <ScheduleCalendarPanelView
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
          />
        </div>

        {/* Left Sidebar - Second on mobile, First on desktop */}
        <div className="xl:order-1 flex-shrink-0 xl:h-full xl:min-h-0">
          <ScheduleLeftSidebarView
            selectedDate={vm.selectedDate}
            selectedDateAppointments={vm.selectedDateAppointments}
            selectedDateAppointmentsByStatus={vm.selectedDateAppointmentsByStatus}
            onOpenAppointmentTools={vm.handleOpenAppointmentTools}
            canManageAppointments={vm.canManageAppointments}
          />
        </div>

        {/* Right Sidebar - Third on mobile, Third on desktop */}
        <div className="xl:order-3 flex-shrink-0 xl:h-full xl:min-h-0">
          <ScheduleRightSidebarView
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

      <AlertView
        isVisible={Boolean(vm.confirmationAlert)}
        type={vm.confirmationAlert?.type || 'warning'}
        message={vm.confirmationAlert?.message || ''}
        hasCloseButton={false}
        disableBackdropClose={vm.isConfirmationAlertProcessing}
        buttonsLayout="row"
        actions={vm.confirmationAlert ? [
          {
            label: 'Voltar',
            color: 'soft-gray',
            onClick: vm.closeConfirmationAlert,
            disabled: vm.isConfirmationAlertProcessing,
            ariaLabel: 'Voltar ação',
          },
          {
            label: vm.confirmationAlert.confirmLabel || 'Confirmar',
            color: vm.confirmationAlert.confirmColor || 'pink',
            onClick: vm.runConfirmationAlertAction,
            disabled: vm.isConfirmationAlertProcessing,
            ariaLabel: vm.confirmationAlert.confirmLabel || 'Confirmar acao',
          }
        ] : []}
        onClose={vm.closeConfirmationAlert}
      />

      <AlertView
        isVisible={Boolean(vm.successAlert)}
        type="success"
        message={vm.successAlert?.message || ''}
        hasCloseButton={false}
        actions={[]}
        onClose={vm.closeSuccessAlert}
      />

      <AlertView
        isVisible={Boolean(vm.errorAlert)}
        type="error"
        message={vm.errorAlert?.message || ''}
        hasCloseButton={true}
        actions={[]}
        onClose={vm.closeErrorAlert}
      />

      <AppointmentToolsModalView
        appointment={vm.selectedAppointmentForTools}
        busyAppointmentId={vm.busyAppointmentId}
        canManageAppointments={vm.canManageAppointments}
        isClientUser={vm.isClientUser}
        onClose={vm.handleCloseAppointmentTools}
        onReschedule={vm.handleRescheduleFromTools}
        onConfirm={vm.handleConfirmFromTools}
        onConclude={vm.handleConcludeFromTools}
        onCancel={vm.handleCancelFromTools}
        onDelete={vm.handleDeleteFromTools}
      />

      {vm.canManageAppointments && (
        <AppointmentFormModalView
          isOpen={vm.isModalOpen}
          onClose={vm.handleModalClose}
          onSubmitSuccess={vm.handleAppointmentSaved}
          selectedDate={vm.selectedModalDate}
          selectedHour={vm.selectedModalHour}
          allAppointments={vm.allAppointments}
          appointment={vm.appointmentToEdit}
          mode={vm.appointmentToEdit ? 'reschedule' : 'create'}
        />
      )}
    </SectionView>
  )
}
