import { useMemo } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'

const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING': return 'Agendado'
    case 'CONFIRMED': return 'Confirmado'
    case 'CONCLUDED': return 'Concluído'
    case 'CANCELLED': return 'Cancelado'
    default: return status || '-'
  }
}

const formatDateTime = (value) => {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDate = (value) => {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('pt-BR')
}

export function RecordsView({
  appointments = [],
  reportData,
}) {
  const filteredAppointments = useMemo(() => {
    if (!reportData?.startDate && !reportData?.endDate) {
      return appointments
    }

    return appointments.filter((appointment) => {
      const appointmentDate = appointment.startDateTime || appointment.date || null
      if (!appointmentDate) return false
      const date = appointmentDate instanceof Date ? appointmentDate : new Date(appointmentDate)
      if (reportData.startDate && date < reportData.startDate) return false
      if (reportData.endDate && date > reportData.endDate) return false
      return true
    })
  }, [appointments, reportData?.startDate, reportData?.endDate])

  return (
    <SectionView className="bg-default-light rounded-lg border border-default-light-muted p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-4">
        <div>
          <HeadingView level={4} className="text-default-dark">Registros de Agendamentos</HeadingView>
          <TextView className="text-sm text-default-dark-light">
            {filteredAppointments.length} agendamento(s) encontrados.
          </TextView>
        </div>
        {reportData?.startDate || reportData?.endDate ? (
          <TextView className="text-sm text-default-dark-light">
            Período: {reportData.startDate ? formatDate(reportData.startDate) : 'Início não definido'} até {reportData.endDate ? formatDate(reportData.endDate) : 'Fim não definido'}
          </TextView>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[11px] uppercase text-default-dark-light tracking-wide">
              <th className="px-3 py-2 border-b border-default-light-muted">ID</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Status</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Início</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Fim</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Nome Participante</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Email Participante</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Observações</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Motivo</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Criado Em</th>
              <th className="px-3 py-2 border-b border-default-light-muted">Atualizado Em</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-sm text-default-dark-light" colSpan="10">
                  Nenhum agendamento encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="odd:bg-default-light-alt even:bg-default-light">
                  <td className="px-3 py-2 text-sm text-default-dark">{appointment.id}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{getStatusLabel(appointment.status)}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{formatDateTime(appointment.startDateTime)}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{formatDateTime(appointment.endDateTime)}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{appointment.attendeeName || '-'}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{appointment.attendeeEmail || '-'}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{appointment.notes || '-'}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{appointment.reason || '-'}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{formatDateTime(appointment.createdAt)}</td>
                  <td className="px-3 py-2 text-sm text-default-dark">{formatDateTime(appointment.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SectionView>
  )
}
