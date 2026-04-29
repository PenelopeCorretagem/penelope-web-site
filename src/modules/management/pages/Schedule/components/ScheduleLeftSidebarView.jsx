import { Wrench } from 'lucide-react'
import { STATUS_COLORS, STATUS_LABELS } from '../ScheduleModel'

export function ScheduleLeftSidebarView({
  selectedDate,
  selectedDateAppointments,
  selectedDateAppointmentsByStatus,
  onOpenAppointmentTools,
  canManageAppointments = true,
}) {
  const handleKeyActivate = (event, onActivate) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <aside
      className="w-full xl:w-80 flex-shrink-0 bg-default-light border-2 border-default-light-muted rounded-lg shadow p-4 overflow-y-auto flex flex-col xl:h-full xl:min-h-0"
    >
      <div>
        <div className="mb-4 rounded-lg border border-default-light-muted p-3">
          <p className="text-xs uppercase tracking-widest text-muted mb-1">Data selecionada</p>
          <p className="text-sm font-semibold text-default-dark">
            {selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-xs text-muted mt-2">
            {selectedDateAppointments.length} agendamento(s) visivel(eis) nesta data
          </p>
        </div>

        <div className="mb-4 rounded-lg border border-default-light-muted p-3">
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Resumo por status</p>
          {selectedDateAppointmentsByStatus.length === 0 ? (
            <p className="text-xs text-muted">Nenhum agendamento nesta data</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedDateAppointmentsByStatus.map(item => (
                <span
                  key={item.status}
                  className="inline-flex items-center gap-2 rounded-full bg-default-light px-3 py-1 text-[11px] font-semibold text-default-dark border border-default-light-muted"
                >
                  {STATUS_LABELS[item.status] || item.status}
                  <span className={`rounded-full px-2 py-0.5 text-default-light ${STATUS_COLORS[item.status] || 'bg-default-light-muted'}`}>
                    {item.count}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {selectedDateAppointments.length === 0 ? (
          <div className="rounded-lg border border-default-light-muted p-4 text-sm text-muted text-center">
            Nenhum agendamento nesta data com os filtros atuais.
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDateAppointments.map(appt => (
              <div
                key={appt.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenAppointmentTools(appt)}
                onKeyDown={(event) => handleKeyActivate(event, () => onOpenAppointmentTools(appt))}
                className={`rounded-lg p-3 border-l-4 ${STATUS_COLORS[appt.status] || 'bg-default-light-muted border-default-light-muted'} bg-opacity-10 cursor-pointer transition hover:brightness-105`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-default-light">
                      {appt.title || 'Agendamento'}
                    </p>
                    <p className="text-xs text-muted font-semibold mt-1">{STATUS_LABELS[appt.status]}</p>
                    <p className="text-xs text-muted mt-1">
                      Tipo: {appt.estateTypeFriendlyName || 'Nao informado'}
                    </p>
                    {appt.attendeeName && (
                      <p className="text-xs text-muted mt-1">Visitante: {appt.attendeeName}</p>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-default-light default-lightspace-nowrap">
                    {String(appt.startDateTime.getHours()).padStart(2, '0')}:
                    {String(appt.startDateTime.getMinutes()).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs text-muted mt-2">Duracao: {appt.durationMinutes} min</p>
                <div className="mt-3 flex justify-end">
                  {canManageAppointments && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onOpenAppointmentTools(appt)
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-default-light-muted px-2 py-1 text-[11px] font-semibold bg-default-light text-default-dark hover:border-distac-primary hover:text-distac-primary transition"
                    >
                      <Wrench size={12} />
                      Ferramentas
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
