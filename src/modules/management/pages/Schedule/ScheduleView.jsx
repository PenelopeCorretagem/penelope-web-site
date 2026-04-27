import { useHeaderHeight } from '@shared/hooks/useHeaderHeight'
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

export function ScheduleView() {
  const vm = useScheduleViewModel()

  return (
    <SectionView className="flex-col !gap-6 !p-6 bg-default-light-alt h-full relative">

      <ScheduleFiltersToolbarView
        filterConfigs={vm.filterConfigs}
        defaultFilters={vm.defaultFilters}
        onFiltersChange={vm.handleFiltersChange}
        onNavigatePeriod={vm.handleNavigatePeriod}
        navigateLabels={vm.navigateLabels}
      />

      <div className="flex-1 min-h-0 overflow-hidden flex gap-6 h-full">
        <ScheduleLeftSidebarView
          selectedDate={vm.selectedDate}
          selectedDateAppointments={vm.selectedDateAppointments}
          selectedDateAppointmentsByStatus={vm.selectedDateAppointmentsByStatus}
          showEstateAgentScopeSelect={vm.showEstateAgentScopeSelect}
          estateAgentScopeFilterOptions={vm.estateAgentScopeFilterOptions}
          selectedEstateAgentFilter={vm.selectedEstateAgentFilter}
          onEstateAgentScopeFilterChange={vm.handleEstateAgentScopeFilterChange}
          onOpenAppointmentTools={vm.handleOpenAppointmentTools}
        />

        <ScheduleCalendarPanelView
          viewMode={vm.viewMode}
          setViewMode={vm.setViewMode}
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
          onTimeSlotClick={vm.handleTimeSlotClick}
          isPastDate={ScheduleModel.isPastDate}
          isSameDay={ScheduleModel.isSameDay}
        />

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

      <AlertView
        isVisible={Boolean(vm.confirmationAlert)}
        type={vm.confirmationAlert?.type || 'warning'}
        message={vm.confirmationAlert?.message || ''}
        hasCloseButton={false}
        buttonsLayout="row"
        actions={vm.confirmationAlert ? [
          {
            label: vm.confirmationAlert.confirmLabel || 'Confirmar',
            color: vm.confirmationAlert.confirmColor || 'pink',
            onClick: vm.runConfirmationAlertAction,
            ariaLabel: vm.confirmationAlert.confirmLabel || 'Confirmar acao',
          },
          {
            label: 'Voltar',
            color: 'soft-gray',
            onClick: vm.closeConfirmationAlert,
            ariaLabel: 'Voltar ação',
          },
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

      <AppointmentToolsModalView
        appointment={vm.selectedAppointmentForTools}
        busyAppointmentId={vm.busyAppointmentId}
        isAdminUser={vm.isAdminUser}
        onClose={vm.handleCloseAppointmentTools}
        onReschedule={vm.handleRescheduleFromTools}
        onConfirm={vm.handleConfirmFromTools}
        onConclude={vm.handleConcludeFromTools}
        onCancel={vm.handleCancelFromTools}
        onDelete={vm.handleDeleteFromTools}
      />

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
    </SectionView>
  )
}
