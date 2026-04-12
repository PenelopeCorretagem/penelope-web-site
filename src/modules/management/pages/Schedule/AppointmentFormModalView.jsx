/**
 * AppointmentFormModalView.jsx
 * Modal para criar/editar agendamentos
 */

import { useState } from 'react'
import { X, AlertCircle, Check, Image as ImageIcon } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { useAppointmentFormViewModel } from './useAppointmentFormViewModel'

export function AppointmentFormModalView({
  isOpen = false,
  onClose = () => {},
  onSubmitSuccess = () => {},
  selectedDate = new Date(),
  selectedHour = 10,
  allAppointments = [],
}) {
  const vm = useAppointmentFormViewModel(selectedDate, selectedHour, allAppointments)
  const [selectedEstateId, setSelectedEstateId] = useState(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('info')

  if (!isOpen) return null

  const selectedEstate = vm.estates.find(e => e.id === selectedEstateId)
  const availableHours = vm.getAvailableHours()

  const handleSelectEstate = (estate) => {
    setSelectedEstateId(estate.id)
    vm.updateField('estate', estate)
  }

  const handleDateTimeChange = (e) => {
    const datetimeString = e.target.value
    if (!datetimeString) return

    const date = new Date(datetimeString + 'Z')
    vm.updateField('startDateTime', date)
  }

  const handleDurationChange = (e) => {
    vm.updateField('durationMinutes', parseInt(e.target.value, 10))
  }

  const handleSubmit = async () => {
    const success = await vm.handleSubmit()
    if (success) {
      setAlertMessage('Agendamento criado com sucesso!')
      setAlertType('success')
      setTimeout(() => {
        onClose()
        onSubmitSuccess()
      }, 1500)
    } else if (vm.submitError) {
      setAlertMessage(vm.submitError)
      setAlertType('error')
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <HeadingView level={2} className="text-distac-primary m-0">
            Agendar Visita
          </HeadingView>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
            aria-label="Fechar"
          >
            <X size={24} className="text-default-dark" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Seleção de Imóvel */}
          <div>
            <label className="block text-sm font-semibold text-default-dark mb-3 uppercase">
              Selecione o Imóvel
            </label>

            {vm.loadingEstates ? (
              <div className="text-center py-8 text-muted">
                Carregando imóveis...
              </div>
            ) : vm.estatesError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {vm.estatesError}
              </div>
            ) : vm.estates.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-lg text-center">
                Nenhum imóvel disponível para agendamento
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vm.estates.map((estate, estateIdx) => {
                  const imageUrl = vm.getEstateImageUrl(estate.estate)
                  const isSelected = selectedEstateId === estate.id

                  return (
                    <button
                      key={estate.id}
                      type="button"
                      onClick={() => handleSelectEstate(estate)}
                      className={`p-3 rounded-lg border-2 transition text-left ${
                        isSelected
                          ? 'border-distac-primary bg-distac-primary/5'
                          : 'border-slate-200 bg-white hover:border-distac-primary/50'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Imagem */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-slate-100 overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={vm.getEstateTitle(estate.estate)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon size={24} className="text-slate-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 overflow-hidden">
                          <p className="font-semibold text-sm text-default-dark truncate">
                            {vm.getEstateTitle(estate.estate)}
                          </p>
                          <p className="text-xs text-muted mt-1">
                            {estate.estate?.type || 'Imóvel'}
                          </p>
                          {estate.estate?.address && (
                            <p className="text-xs text-muted truncate mt-1">
                              {estate.estate.address.street}, {estate.estate.address.number}
                              {estate.estate.address.neighborhood && ` - ${estate.estate.address.neighborhood}`}
                            </p>
                          )}
                        </div>

                        {/* Check */}
                        {isSelected && (
                          <div className="flex items-start justify-end">
                            <div className="bg-distac-primary text-white rounded-full p-1">
                              <Check size={16} />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Data/Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-default-dark mb-2 uppercase">
                Data e Hora de Início
              </label>
              <input
                type="datetime-local"
                value={vm.model.getDateTimeLocalString()}
                onChange={handleDateTimeChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-default-dark mb-2 uppercase">
                Duração (minutos)
              </label>
              <select
                value={vm.model.durationMinutes}
                onChange={handleDurationChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
              >
                <option value={15}>15 minutos</option>
                <option value={30}>30 minutos</option>
                <option value={45}>45 minutos</option>
                <option value={60}>1 hora</option>
                <option value={90}>1 hora 30 minutos</option>
                <option value={120}>2 horas</option>
              </select>
            </div>
          </div>

          {/* Informações do Visitante */}
          <div>
            <label className="block text-sm font-semibold text-default-dark mb-3 uppercase">
              Informações do Visitante
            </label>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome do visitante"
                value={vm.model.visitorName}
                onChange={handleVisitorNameChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
              />

              <input
                type="email"
                placeholder="Email do visitante"
                value={vm.model.visitorEmail}
                onChange={handleVisitorEmailChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
              />

              <input
                type="tel"
                placeholder="Telefone do visitante"
                value={vm.model.visitorPhone}
                onChange={handleVisitorPhoneChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-semibold text-default-dark mb-2 uppercase">
              Notas (opcional)
            </label>
            <textarea
              placeholder="Adicione observações sobre o agendamento..."
              value={vm.model.notes}
              onChange={handleNotesChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-distac-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Erros de Validação */}
          {vm.validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2 mb-2">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="font-semibold text-red-900">Erros encontrados:</p>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                {vm.validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Horários Disponíveis */}
          {vm.model.selectedEstate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Horários disponíveis para este imóvel neste dia:
              </p>
              <div className="flex flex-wrap gap-2">
                {availableHours.length > 0 ? (
                  availableHours.map(hour => (
                    <div
                      key={hour}
                      className="px-3 py-1 bg-blue-100 text-blue-900 rounded text-xs font-medium"
                    >
                      {String(hour).padStart(2, '0')}:00
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-blue-700">
                    Nenhum horário disponível para este imóvel neste dia
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex gap-3 justify-end">
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
            {vm.isSubmitting ? 'Agendando...' : 'Agendar'}
          </ButtonView>
        </div>
      </div>
    </>
  )
}
