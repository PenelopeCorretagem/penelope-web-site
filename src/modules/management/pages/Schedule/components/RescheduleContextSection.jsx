/**
 * RescheduleContextSection.jsx
 * Componente para exibição do contexto do reagendamento
 */

export function RescheduleContextSection({
  appointment = null,
}) {
  if (!appointment) {
    return null
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      <p className="font-semibold text-default-dark mb-1">Agendamento selecionado</p>
      <p>{appointment.title || 'Agendamento'}</p>
      <p>
        {appointment.startDateTime?.toLocaleDateString('pt-BR')} às{' '}
        {appointment.startDateTime?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </p>
      {appointment.attendeeName && <p>Visitante: {appointment.attendeeName}</p>}
    </div>
  )
}
