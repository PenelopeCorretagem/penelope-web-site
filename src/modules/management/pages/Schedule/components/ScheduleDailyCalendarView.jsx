import { useMemo } from 'react'
import { SectionView } from '@shared/components/layout/Section/SectionView'
import { HeadingView } from '@shared/components/ui/Heading/HeadingView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react'
import { STATUS_COLORS, STATUS_LABELS } from '../ScheduleModel'
import clsx from 'clsx'

/**
 * ScheduleDailyCalendarView.jsx
 * Componente que exibe calendário diário com todos os agendamentos do dia
 */

export function ScheduleDailyCalendarView({
  selectedDate,
  appointments = [],
  onNavigateDate,
  isPastDate,
  isSameDay,
  onOpenAppointmentTools,
  canManageAppointments,
}) {
  const HOURS = Array.from({ length: 24 }, (_, i) => i)

  const sortedAppointments = useMemo(() => {
    return appointments
      .filter(a => isSameDay(a.startDateTime, selectedDate))
      .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime())
  }, [appointments, selectedDate, isSameDay])

  const appointmentsByHour = useMemo(() => {
    const map = new Map()
    sortedAppointments.forEach(appointment => {
      const hour = appointment.startDateTime.getHours()
      if (!map.has(hour)) {
        map.set(hour, [])
      }
      map.get(hour).push(appointment)
    })
    return map
  }, [sortedAppointments])

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  }

  const isPastDateFlag = isPastDate(selectedDate)

  const handlePrevDay = () => {
    const prevDate = new Date(selectedDate)
    prevDate.setDate(prevDate.getDate() - 1)
    onNavigateDate(prevDate)
  }

  const handleNextDay = () => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(nextDate.getDate() + 1)
    onNavigateDate(nextDate)
  }

  const handleToday = () => {
    onNavigateDate(new Date())
  }

  return (
    <SectionView className="flex-col gap-6 bg-default-light-alt p-4 md:p-6 h-full overflow-auto">
      {/* Header com navegação de datas */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <HeadingView level={2} className="text-distac-primary mb-2">
            Visualização Diária
          </HeadingView>
          <TextView className="text-default-dark-light capitalize">
            {formatDate(selectedDate)}
          </TextView>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ButtonView
            type="button"
            onClick={handlePrevDay}
            color="soft-gray"
            shape="rectangle"
            width="fit"
            className="!px-3 !py-2"
            aria-label="Dia anterior"
          >
            <ChevronLeft size={18} />
          </ButtonView>

          <ButtonView
            type="button"
            onClick={handleToday}
            color="brown"
            shape="rectangle"
            width="fit"
            className="!px-3 !py-2 !text-sm !font-medium whitespace-nowrap"
            aria-label="Ir para hoje"
          >
            Hoje
          </ButtonView>

          <ButtonView
            type="button"
            onClick={handleNextDay}
            color="soft-gray"
            shape="rectangle"
            width="fit"
            className="!px-3 !py-2"
            aria-label="Próximo dia"
          >
            <ChevronRight size={18} />
          </ButtonView>
        </div>
      </div>

      {isPastDateFlag && (
        <div className="p-3 bg-default-light-muted rounded-lg border border-default-light-muted">
          <TextView className="text-sm text-default-dark-light italic">
            ℹ️ Esta data já passou. Visualizando agendamentos históricos.
          </TextView>
        </div>
      )}

      {/* Grid de horas e agendamentos */}
      <div className="flex-1 overflow-auto border border-default-light-muted rounded-lg bg-default-light">
        <div className="divide-y divide-default-light-muted">
          {HOURS.map(hour => {
            const apptList = appointmentsByHour.get(hour) || []
            const formattedHour = String(hour).padStart(2, '0')

            return (
              <div key={`hour-${hour}`} className="flex min-h-[80px] hover:bg-default-light-muted/50 transition">
                {/* Coluna de hora */}
                <div className="w-24 md:w-32 flex-shrink-0 p-3 bg-default-light-alt border-r border-default-light-muted flex items-start justify-center font-semibold text-sm text-default-dark-light">
                  {formattedHour}:00
                </div>

                {/* Coluna de agendamentos */}
                <div className="flex-1 p-3 flex flex-col gap-2">
                  {apptList.length > 0 ? (
                    apptList.map(appointment => (
                      <button
                        key={appointment.id}
                        type="button"
                        onClick={() => onOpenAppointmentTools && onOpenAppointmentTools(appointment)}
                        className={clsx(
                          'text-left p-3 rounded-lg border-l-4 transition hover:shadow-md transform hover:scale-105',
                          STATUS_COLORS[appointment.status] || 'bg-default-light text-default-dark'
                        )}
                        disabled={!canManageAppointments}
                      >
                        <div className="flex flex-col gap-1">
                          {/* Hora e duração */}
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <Clock size={14} />
                            <span>
                              {formatTime(appointment.startDateTime)}
                              {appointment.endDateTime && (
                                <> - {formatTime(appointment.endDateTime)}</>
                              )}
                            </span>
                            <span className="ml-auto bg-black/20 px-2 py-0.5 rounded text-xs">
                              {STATUS_LABELS[appointment.status] || appointment.status}
                            </span>
                          </div>

                          {/* Imóvel */}
                          {appointment.estateTitle && (
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin size={14} />
                              <span className="font-medium truncate">
                                {appointment.estateTitle}
                              </span>
                            </div>
                          )}

                          {/* Visitante */}
                          {appointment.visitorName && (
                            <div className="flex items-center gap-2 text-xs">
                              <User size={14} />
                              <span className="truncate">
                                {appointment.visitorName}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-default-dark-light/60 italic">
                      Sem agendamentos
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Resumo do dia */}
      <div className="bg-default-light-alt rounded-lg p-4 border border-default-light-muted">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <TextView className="text-xs text-default-dark-light uppercase font-semibold">
              Total
            </TextView>
            <HeadingView level={4} className="text-distac-primary">
              {sortedAppointments.length}
            </HeadingView>
          </div>
          <div>
            <TextView className="text-xs text-default-dark-light uppercase font-semibold">
              Agendados
            </TextView>
            <HeadingView level={4} className="text-distac-primary">
              {sortedAppointments.filter(a => a.status === 'PENDING').length}
            </HeadingView>
          </div>
          <div>
            <TextView className="text-xs text-default-dark-light uppercase font-semibold">
              Confirmados
            </TextView>
            <HeadingView level={4} className="text-distac-secondary">
              {sortedAppointments.filter(a => a.status === 'CONFIRMED').length}
            </HeadingView>
          </div>
          <div>
            <TextView className="text-xs text-default-dark-light uppercase font-semibold">
              Concluídos
            </TextView>
            <HeadingView level={4} className="text-distac-secondary">
              {sortedAppointments.filter(a => a.status === 'CONCLUDED').length}
            </HeadingView>
          </div>
        </div>
      </div>
    </SectionView>
  )
}
