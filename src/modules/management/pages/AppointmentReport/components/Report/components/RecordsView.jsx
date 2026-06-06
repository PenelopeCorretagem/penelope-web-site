import { memo, useMemo } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { SkeletonView } from '@shared/components/ui/Skeleton/SkeletonView'

import { APPOINTMENT_STATUS_LABELS } from '@constant/appointmentStatuses'
import { useMinLoadingTime } from '@shared/hooks/useMinLoadingTime';

const getStatusLabel = (status) => APPOINTMENT_STATUS_LABELS[status] || status || '-'

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

function RecordsViewComponent({
  appointments = [],
  reportData,
  isLoading = false,
}) {
  // Filtros de data agora são aplicados no backend - sem necessidade de filtragem local
  const filteredAppointments = useMemo(() => {
    return appointments
  }, [appointments])
  const isMinLoading = useMinLoadingTime(isLoading);

  if (isMinLoading) {
    return (
      <SectionView className="bg-default-light rounded-lg border border-default-light-muted shadow-sm h-full !p-10">
        <div className="flex flex-col gap-4 w-full h-full overflow-hidden">
          <SkeletonView className="h-10 w-full" />
          <SkeletonView className="h-10 w-full" />
          <SkeletonView className="h-10 w-full" />
          <SkeletonView className="h-10 w-full" />
          <SkeletonView className="h-10 w-full" />
          <SkeletonView className="h-10 w-full" />
        </div>
      </SectionView>
    )
  }

  return (
    <SectionView className="bg-default-light rounded-lg border border-default-light-muted shadow-sm h-full !p-10">
      <div className="overflow-x-auto w-full">
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

export const RecordsView = memo(RecordsViewComponent)
