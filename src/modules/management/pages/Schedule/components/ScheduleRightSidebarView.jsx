import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { STATUS_LABELS } from '../ScheduleModel'

export function ScheduleRightSidebarView({
  currentMonthName,
  weekdayLabels,
  calendarDays,
  selectedDate,
  appointmentsCountByDate,
  monthlyAppointmentsByStatus,
  onGoToToday,
  onChangeMonth,
  onSelectDate,
  isPastDate,
  isSameDay,
}) {
  const renderMiniCalendarDay = (day, index) => {
    if (!day) {
      return <div key={`empty-${index}`} className="bg-default-light-muted" />
    }

    const cellDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
    const isCurrent = day === selectedDate.getDate()
    const isPassedDay = isPastDate(cellDate)
    const dateKey = cellDate.toISOString().split('T')[0]
    const count = appointmentsCountByDate[dateKey] || 0

    return (
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => onSelectDate(cellDate)}
        className={`aspect-square rounded-md text-sm font-medium transition relative ${
          isCurrent
            ? 'bg-distac-primary text-default-light'
            : isPassedDay
              ? 'bg-default-light-muted text-default-dark-light opacity-60'
              : 'bg-default-light-alt text-default-dark hover:bg-default-light-muted'
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

  return (
    <aside className="w-64 bg-default-light rounded-lg shadow p-4 overflow-y-auto flex flex-col">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-default-dark">Navegação</h3>
          <ButtonView
            type="button"
            onClick={onGoToToday}
            color="brown"
            width="fit"
            shape="rectangle"
            className="!px-3 !py-2 !text-xs !font-medium"
          >
            Hoje
          </ButtonView>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-default-dark">{currentMonthName}</h3>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onChangeMonth(-1)}
              className="p-1 hover:bg-default-light-muted rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => onChangeMonth(1)}
              className="p-1 hover:bg-default-light-muted rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted mb-2">
          {weekdayLabels.map(label => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => renderMiniCalendarDay(day, index))}
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-2">Resumo mensal por status</p>
          <div className="space-y-2 text-sm">
            {monthlyAppointmentsByStatus.length === 0 ? (
              <p className="text-xs text-muted">Nenhum agendamento no mes.</p>
            ) : (
              monthlyAppointmentsByStatus.map(item => (
                <div
                  key={item.status}
                  className="flex items-center justify-between gap-3 rounded-md bg-default-light-alt border border-default-light-muted px-3 py-2"
                >
                  <span className="text-xs text-default-dark truncate">
                    {STATUS_LABELS[item.status] || item.status}
                  </span>
                  <span className="text-xs font-semibold text-distac-primary">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
