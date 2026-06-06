import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { AppointmentFormModalView } from '@management/components/AppointmentFormModal/AppointmentFormModalView'
import { AppointmentToolsModalView } from '@management/components/AppointmentToolsModal/AppointmentToolsModalView'
import { CalendarModel } from '@management/models/CalendarModel'
import { useAppointmentReportViewModel } from './useAppointmentReportViewModel'
import { ReportView } from './components/Report/ReportView'
import { PageManagementView } from '@management/components/PageManegement/PageManegementView'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

export function AppointmentReportView() {
  const vm = useAppointmentReportViewModel()

  const renderMiniCalendarDay = (day, index) => {
    if (!day) {
      return <div key={`empty-${index}`} className="bg-default-light-muted" />
    }

    const cellDate = new Date(vm.selectedDate.getFullYear(), vm.selectedDate.getMonth(), day)
    const isCurrent = day === vm.selectedDate.getDate()
    const isPassedDay = CalendarModel.isPastDate(cellDate)
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
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-default-dark">NavegaÃ§Ã£o</h3>
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
          {vm.weekdayLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {vm.calendarDays.map((day, index) => renderMiniCalendarDay(day, index))}
        </div>
      </div>
    </div>
  )

  const confirmationActions = vm.confirmationAlert ? [
    {
      label: 'Voltar',
      color: 'soft-gray',
      onClick: vm.closeConfirmationAlert,
      disabled: vm.isConfirmationAlertProcessing,
      'aria-label': 'Voltar aÃ§Ã£o',
    },
    {
      label: vm.confirmationAlert.confirmLabel || 'Confirmar',
      color: vm.confirmationAlert.confirmColor || 'pink',
      onClick: vm.runConfirmationAlertAction,
      disabled: vm.isConfirmationAlertProcessing,
      'aria-label': vm.confirmationAlert.confirmLabel || 'Confirmar acao',
    },
  ] : []

  return (
    <PageManagementView className="flex-col !gap-4 md:!gap-6 !p-4 md:!p-6 bg-default-light-alt xl:h-full relative">
      <ReportView
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
        activeSection={vm.activeSection}
      />

      <AlertView
        isVisible={Boolean(vm.confirmationAlert)}
        type={vm.confirmationAlert?.type || 'warning'}
        message={vm.confirmationAlert?.message || ''}
        hasCloseButton={false}
        disableBackdropClose={vm.isConfirmationAlertProcessing}
        buttonsLayout="row"
        actions={confirmationActions}
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

      {vm.canManageAppointments && (
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
      )}

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
          preselectedEstateReference={vm.preselectedEstateReference}
        />
      )}
    </PageManagementView>
  )
}
