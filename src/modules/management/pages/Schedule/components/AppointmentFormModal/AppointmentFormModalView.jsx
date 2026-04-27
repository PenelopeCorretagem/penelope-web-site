/**
 * AppointmentFormModalView.jsx
 * Modal para criar/editar agendamentos
 */

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { AlertView } from '@shared/components/feedback/Alert/AlertView'
import { useAppointmentFormViewModel } from './useAppointmentFormViewModel'
import { EstateSelectionView } from '../EstateSelectionView'
import { DateTimeSelectionView } from '../DateTimeSelectionView'
import { VisitorInfoView } from '../VisitorInfoView'
import { AvailableHoursSection } from '../AvailableHoursSection'
import { NotesSection } from '../NotesSection'
import { RescheduleContextSection } from '../RescheduleContextSection'

export function AppointmentFormModalView({
  isOpen = false,
  onClose = () => {},
  onSubmitSuccess = () => {},
  selectedDate = new Date(),
  selectedHour = 10,
  allAppointments = [],
  appointment = null,
  mode = 'create',
}) {
  const vm = useAppointmentFormViewModel(
    selectedDate,
    selectedHour,
    allAppointments,
    isOpen,
    appointment,
    mode
  )
  const [selectedEstateId, setSelectedEstateId] = useState(null)
  const [isFormAlertVisible, setIsFormAlertVisible] = useState(false)
  const [formAlertMessage, setFormAlertMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedEstateId(null)
    }
  }, [isOpen, selectedDate, selectedHour, appointment, mode])

  useEffect(() => {
    if (!isOpen) {
      setIsFormAlertVisible(false)
      setFormAlertMessage('')
      return
    }

    const validationMessage = vm.validationErrors.length > 0
      ? vm.validationErrors.join(' | ')
      : ''

    const nextMessage = validationMessage || vm.submitError || ''

    if (!nextMessage) {
      return
    }

    setFormAlertMessage(nextMessage)
    setIsFormAlertVisible(true)
  }, [isOpen, vm.validationErrors, vm.submitError])

  if (!isOpen) return null

  const isRescheduleMode = vm.isRescheduleMode
  const availableHours = vm.getAvailableHours()

  const handleSelectEstate = (estate) => {
    setSelectedEstateId(estate.id)
    vm.updateField('estate', estate)
  }

  const handleDateTimeChange = (e) => {
    const datetimeString = e.target.value
    if (!datetimeString) return

    const date = new Date(datetimeString)
    vm.updateField('startDateTime', date)
  }

  const handleSubmit = async () => {
    const success = await vm.handleSubmit()
    if (success) {
      onClose()
      onSubmitSuccess({ mode: isRescheduleMode ? 'reschedule' : 'create' })
    } else if (vm.submitError) {
      // O erro de submissão já é exibido na seção de validação.
    }
  }

  const handleVisitorNameChange = (e) => {
    vm.updateField('visitorName', e.target.value)
  }

  const handleVisitorEmailChange = (e) => {
    vm.updateField('visitorEmail', e.target.value)
  }

  const handleVisitorPhoneChange = (e) => {
    vm.updateField('visitorPhone', e.target.value)
  }

  const handleNotesChange = (e) => {
    vm.updateField('notes', e.target.value)
  }

  const handleReasonChange = (e) => {
    vm.updateField('reason', e.target.value)
  }

  const modalTitle = isRescheduleMode ? 'Reagendar Visita' : 'Agendar Visita'
  const submitLabel = isRescheduleMode ? 'Salvar reagendamento' : 'Agendar'
  const submittingLabel = isRescheduleMode ? 'Reagendando...' : 'Agendando...'

  return (
    <>
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 z-40 bg-default-dark opacity-70"
        onClick={onClose}
      />

      <div className="absolute top-1/2 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-lg bg-white shadow-2xl max-h-[70vh] flex flex-col mx-4">
        <div className="z-10 bg-white border-b border-slate-200 p-6 flex items-center justify-between flex-shrink-0">
          <HeadingView level={2} className="text-distac-primary m-0">
            {modalTitle}
          </HeadingView>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            aria-label="Fechar"
          >
            <X size={24} className="text-default-dark" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
          <RescheduleContextSection
            appointment={isRescheduleMode ? appointment : null}
          />

          {!isRescheduleMode && (
            <div>
              <label className="block text-sm font-semibold text-default-dark mb-3 uppercase">
                Selecione o Imóvel
              </label>

              <EstateSelectionView
                estates={vm.estates}
                selectedEstateId={selectedEstateId}
                loading={vm.loadingEstates}
                error={vm.estatesError}
                onSelectEstate={handleSelectEstate}
                getEstateImageUrl={vm.getEstateImageUrl}
                getEstateTitle={vm.getEstateTitle}
              />
            </div>
          )}

          <DateTimeSelectionView
            dateTimeValue={vm.model.getDateTimeLocalString()}
            onDateTimeChange={handleDateTimeChange}
            leftFooter={
              <div className="space-y-4">
                {!isRescheduleMode && (
                  <VisitorInfoView
                    visitorName={vm.model.visitorName}
                    visitorEmail={vm.model.visitorEmail}
                    visitorPhone={vm.model.visitorPhone}
                    onNameChange={handleVisitorNameChange}
                    onEmailChange={handleVisitorEmailChange}
                    onPhoneChange={handleVisitorPhoneChange}
                  />
                )}

                <NotesSection
                  isRescheduleMode={isRescheduleMode}
                  value={isRescheduleMode ? vm.model.reason : vm.model.notes}
                  onChange={isRescheduleMode ? handleReasonChange : handleNotesChange}
                />
              </div>
            }
          />

          <AvailableHoursSection
            availableHours={availableHours}
            selectedEstate={vm.model.selectedEstate}
          />
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-6 flex gap-3 justify-end flex-shrink-0">
          <ButtonView
            type="button"
            color="gray"
            onClick={onClose}
            disabled={vm.isSubmitting}
          >
            Cancelar
          </ButtonView>

          <ButtonView
            type="button"
            color="pink"
            onClick={handleSubmit}
            disabled={vm.isSubmitting || vm.validationErrors.length > 0}
          >
            {vm.isSubmitting ? submittingLabel : submitLabel}
          </ButtonView>
        </div>
      </div>

      <AlertView
        isVisible={isFormAlertVisible}
        type="error"
        message={formAlertMessage}
        hasCloseButton={true}
        actions={[]}
        onClose={() => setIsFormAlertVisible(false)}
      />
    </>
  )
}
