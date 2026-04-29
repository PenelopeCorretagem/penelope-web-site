import { STATUS_LABELS } from '../ScheduleModel'

export function AppointmentToolsModalView({
  appointment,
  busyAppointmentId,
  canManageAppointments = true,
  isClientUser = false,
  onClose,
  onReschedule,
  onConfirm,
  onConclude,
  onCancel,
  onDelete,
}) {
  if (!appointment) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar popup de ferramentas"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div
        className="relative z-10 w-full max-w-md rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Ferramentas do agendamento"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">Ferramentas</p>
            <h3 className="text-base font-semibold text-default-dark">{appointment.title || 'Agendamento'}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-semibold text-default-dark hover:border-distac-primary hover:text-distac-primary"
          >
            Fechar
          </button>
        </div>

        <div className="space-y-2 px-4 py-3 text-sm">
          <p><span className="font-semibold">Status:</span> {STATUS_LABELS[appointment.status] || appointment.status}</p>
          <p><span className="font-semibold">Imovel:</span> {appointment.estateTitle || 'Imovel nao informado'}</p>
          <p><span className="font-semibold">Tipo do imovel:</span> {appointment.estateTypeFriendlyName || 'Nao informado'}</p>
          <p>
            <span className="font-semibold">Data:</span> {appointment.startDateTime.toLocaleDateString('pt-BR')} as {appointment.startDateTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p><span className="font-semibold">Duracao:</span> {appointment.durationMinutes} min</p>
          {appointment.attendeeName && (
            <p><span className="font-semibold">Visitante:</span> {appointment.attendeeName}</p>
          )}
          {appointment.attendeeEmail && (
            <p><span className="font-semibold">E-mail:</span> {appointment.attendeeEmail}</p>
          )}
        </div>

        {canManageAppointments && (
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                <button
                  type="button"
                  onClick={onReschedule}
                  disabled={busyAppointmentId === appointment.id}
                  className="rounded-md bg-distac-primary px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Reagendar
                </button>
              )}

              {appointment.status === 'PENDING' && (
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={busyAppointmentId === appointment.id}
                  className="rounded-md bg-distac-secondary px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Confirmar
                </button>
              )}

              {!isClientUser && appointment.status === 'CONFIRMED' && (
                <button
                  type="button"
                  onClick={onConclude}
                  disabled={busyAppointmentId === appointment.id}
                  className="rounded-md bg-distac-secondary-light px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Concluir
                </button>
              )}

              {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={busyAppointmentId === appointment.id}
                  className="rounded-md bg-default-dark-light px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Cancelar Angendamento
                </button>
              )}

              {!isClientUser && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={busyAppointmentId === appointment.id}
                  className="rounded-md bg-default-dark-muted px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
