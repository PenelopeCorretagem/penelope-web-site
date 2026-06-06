import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { CalendarView as SharedCalendarView } from '@shared/components/ui/Calendar/CalendarView'
import { STATUS_LABELS } from '../../../../ScheduleModel'

export function CalendarRightSidebarView({
  weekdayLabels,
  selectedDate,
  appointmentsCountByDate,
  monthlyAppointmentsByStatus,
  onGoToToday,
  onChangeMonth,
  onSelectDate,
  isPastDate,
  isSameDay,
}) {
  const isToday = selectedDate instanceof Date && isSameDay(selectedDate, new Date())

  return (
    <aside className="w-full xl:w-64 flex-shrink-0 bg-default-light rounded-lg shadow p-4 overflow-y-auto flex flex-col xl:h-full xl:min-h-0">
      <div className="hidden xl:block mb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-semibold text-default-dark uppercase">Navegação</h3>
          <ButtonView
            type="button"
            onClick={onGoToToday}
            color={isToday ? 'pink' : 'brown'}
            width="fit"
            shape="rectangle"
            className="!px-3 !py-2 !text-xs !font-medium"
          >
            Hoje
          </ButtonView>
        </div>

        <SharedCalendarView
          selectedDate={selectedDate}
          monthDate={selectedDate}
          onSelectDate={onSelectDate}
          onChangeMonth={onChangeMonth}
          appointmentCountByDate={appointmentsCountByDate}
          isPastDate={isPastDate}
          allowPastDates={true}
          allowOtherMonthDates={true}
          isSameDay={isSameDay}
          weekDayLabels={weekdayLabels}
          className="bg-default-light !p-2"
          cellHeight="h-6"
        />
      </div>

      <div className="xl:border-t pt-2 xl:pt-4 space-y-3">
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
