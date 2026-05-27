import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { AppointmentFormModalView } from '@management/components/layout/AppointmentFormModal/AppointmentFormModalView'
import { ScheduleModel } from './ScheduleModel'
import { useScheduleViewModel } from './useScheduleViewModel'
import { CalendarView } from './components/layout/Calendar/CalendarView'
import { CalendarView as SharedCalendarView } from '@shared/components/ui/Calendar/CalendarView'
import { AppointmentToolsModalView } from '@management/components/layout/AppointmentToolsModal/AppointmentToolsModalView'
import { PageManagementView } from '@management/components/layout/PageManegement/PageManegementView'

export function ScheduleView() {
  const vm = useScheduleViewModel({ defaultDisplayMode: 'calendar', availableDisplayModesOverride: ['calendar'] })

  const mobileExpandedContent = (
    <div className="flex flex-col gap-4 w-full bg-default-light rounded-lg border border-default-light-muted p-4 shadow-sm mt-2 xl:hidden">
      <SharedCalendarView
        selectedDate={vm.selectedDate}
        monthDate={vm.selectedDate}
        onSelectDate={vm.setSelectedDate}
        onChangeMonth={vm.handleChangeMonth}
        appointmentCountByDate={vm.appointmentsCountByDate}
        isPastDate={ScheduleModel.isPastDate}
        isSameDay={ScheduleModel.isSameDay}
        weekDayLabels={vm.weekdayLabels}
        className="bg-default-light"
      />
    </div>
  )

  return (
    <PageManagementView className="flex-col !gap-4 md:!gap-6 !p-4 md:!p-6 bg-default-light-alt xl:h-full relative">
      <CalendarView
        vm={vm}
        filterConfigs={vm.filterConfigs}
        defaultFilters={vm.defaultFilters}
        showEstateAgentScopeSelect={vm.showEstateAgentScopeSelect}
        estateAgentScopeFilterOptions={vm.estateAgentScopeFilterOptions}
        onFiltersChange={vm.handleFiltersChange}
        onDisplayModeChange={vm.handleDisplayModeChange}
        availableDisplayModes={vm.availableDisplayModes}
        displayMode={vm.displayMode}
        mobileExpandedContent={mobileExpandedContent}
      />

      {/* Modais e Alertas */}

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
            'aria-label': 'Voltar ação',
          },
          {
            label: vm.confirmationAlert.confirmLabel || 'Confirmar',
            color: vm.confirmationAlert.confirmColor || 'pink',
            onClick: vm.runConfirmationAlertAction,
            disabled: vm.isConfirmationAlertProcessing,
            'aria-label': vm.confirmationAlert.confirmLabel || 'Confirmar acao',
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
        canDeleteAppointments={vm.canDeleteAppointments}
        isClientUser={vm.isClientUser}
        onClose={vm.handleCloseAppointmentTools}
        onReschedule={vm.handleRescheduleFromTools}
        onConfirm={vm.handleConfirmFromTools}
        onConclude={vm.handleConcludeFromTools}
        onCancel={vm.handleCancelFromTools}
        onDelete={vm.handleDeleteFromTools}
      />

      {vm.canCreateAppointments && (
        <AppointmentFormModalView
          isOpen={vm.isModalOpen}
          onClose={vm.handleModalClose}
          onSubmitSuccess={vm.handleAppointmentSaved}
          selectedDate={vm.selectedModalDate}
          selectedHour={vm.selectedModalHour}
          allAppointments={vm.allAppointments}
          appointment={vm.appointmentToEdit}
          mode={vm.appointmentToEdit ? 'reschedule' : 'create'}
          preselectedEstateReference={vm.preselectedEstateReference}
        />
      )}
    </PageManagementView>
  )
}
