import { Calendar, CalendarDays, Calendar1, Wrench } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { STATUS_COLORS, STATUS_LABELS } from '../ScheduleModel'

export function ScheduleCalendarPanelView({
  viewMode,
  setViewMode,
  weekdayLabels,
  weekDates,
  selectedDate,
  selectedDateAppointments,
  filteredAppointments,
  calendarDays,
  hours,
  appointmentsByDay,
  onSelectDate,
  onOpenAppointmentTools,
  onTimeSlotClick,
  isPastDate,
  isSameDay,
}) {
  return (
    <div className="flex-1 min-h-0 bg-default-light border-2 border-default-light-muted rounded-lg shadow p-6 overflow-hidden flex flex-col">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted mb-1">
            {viewMode === 'week' ? 'Semana de' : viewMode === 'day' ? 'Dia selecionado' : 'Mes selecionado'}
          </p>
          <h2 className="text-xl font-semibold">
            {viewMode === 'week'
              ? `${weekDates[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} - ${weekDates[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`
              : viewMode === 'day'
                ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <ButtonView
            type="button"
            onClick={() => setViewMode('day')}
            active={viewMode === 'day'}
            color="white"
            width="fit"
            shape="square"
            className="!p-2 !min-w-0"
            title="Visualizacao diaria"
          >
            <Calendar1 size={18} />
          </ButtonView>
          <ButtonView
            type="button"
            onClick={() => setViewMode('week')}
            active={viewMode === 'week'}
            color="white"
            width="fit"
            shape="square"
            className="!p-2 !min-w-0"
            title="Visualizacao semanal"
          >
            <Calendar size={18} />
          </ButtonView>
          <ButtonView
            type="button"
            onClick={() => setViewMode('month')}
            active={viewMode === 'month'}
            color="white"
            width="fit"
            shape="square"
             className="!p-2 !min-w-0"
            title="Visualizacao mensal"
          >
            <CalendarDays size={18} />
          </ButtonView>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {viewMode === 'week' ? (
          <div className="grid grid-cols-8 gap-2 min-w-full">
            <div className="w-16 flex-shrink-0">
              <div className="h-12" />
              {hours.map(hour => (
                <div key={hour} className="h-12 text-xs text-muted flex items-start justify-end pr-2">
                  {String(hour).padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {weekDates.map((date, dayIndex) => {
              const isSelectedDay = date.toDateString() === selectedDate.toDateString()
              const dateKey = date.toISOString().split('T')[0]
              const dayAppointments = appointmentsByDay[dateKey] || []

              return (
                <div
                  key={dateKey}
                  className={`flex-1 border-l ${isSelectedDay ? 'bg-distac-primary/5 border-distac-primary' : 'border-default-light-muted'}`}
                >
                  <div className="h-12 flex flex-col items-center justify-center border-b border-default-light-muted">
                    <p className="text-xs font-semibold text-default-dark">{weekdayLabels[dayIndex]}</p>
                    <p className="text-sm font-bold text-distac-primary">{date.getDate()}</p>
                  </div>

                  <div className="relative">
                    {hours.map(hour => {
                      const slotAppointments = dayAppointments.filter(appt => appt.startDateTime.getHours() === hour)

                      return (
                        <button
                          key={`${dateKey}-${hour}`}
                          type="button"
                          onClick={() => onTimeSlotClick(date, hour)}
                          disabled={isPastDate(date)}
                          className={`h-10 border-b border-default-light-muted w-full transition relative block p-1 ${
                            isPastDate(date)
                              ? 'opacity-80 cursor-not-allowed bg-default-dark-light pointer-events-none'
                              : 'bg-default-light hover:bg-distac-primary-light'
                          }`}
                        >
                          <div className="absolute inset-0 pointer-events-none">
                            {slotAppointments.map((appt, index) => {
                              const startMinutes = appt.startDateTime.getMinutes()
                              const slotRowHeight = 40
                              const topOffset = (startMinutes / 60) * slotRowHeight * 0.85
                              const height = (appt.durationMinutes / 60) * slotRowHeight * 0.85
                              const horizontalOffset = index * 10
                              const rightOffset = (slotAppointments.length - 1 - index) * 10

                              return (
                                <div
                                  key={appt.id}
                                  className={`absolute rounded-sm p-0.5 text-default-light text-[10px] overflow-hidden cursor-pointer pointer-events-auto ${STATUS_COLORS[appt.status] || 'bg-slate-400'}`}
                                  style={{
                                    top: `${topOffset}px`,
                                    left: `${4 + horizontalOffset}px`,
                                    right: `${4 + rightOffset}px`,
                                    minHeight: `${Math.max(height, 12)}px`,
                                    maxHeight: `${slotRowHeight - 6}px`,
                                    zIndex: 10 + index,
                                  }}
                                  title={appt.title || 'Agendamento'}
                                >
                                  <p className="font-semibold truncate text-xs">{appt.title || 'Agendamento'}</p>
                                  <p className="text-[9px] opacity-90">
                                    {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(startMinutes).padStart(2, '0')}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      onOpenAppointmentTools(appt)
                                    }}
                                    className="absolute top-1 right-1 rounded-sm bg-default-light/90 p-0.5 text-default-dark hover:bg-default-light"
                                    aria-label="Abrir ferramentas do agendamento"
                                  >
                                    <Wrench size={10} />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : viewMode === 'day' ? (
          <div className="min-w-full h-full flex flex-col">
            <div className="flex flex-col">
              <div className="flex items-center justify-center pb-4 border-b border-default-light-muted">
                <div className="text-center">
                  <p className="text-xs text-muted uppercase tracking-widest">
                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                  </p>
                  <p className="text-2xl font-bold text-distac-primary">{selectedDate.getDate()}</p>
                </div>
              </div>

              <div className="flex-1 relative mt-4">
                <div className="flex gap-4">
                  <div className="w-16 flex-shrink-0">
                    {hours.map(hour => (
                      <div key={hour} className="h-20 text-xs text-muted flex items-start justify-end pr-2 font-medium">
                        {String(hour).padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 relative">
                    {hours.map(hour => {
                      const slotAppointments = selectedDateAppointments.filter(
                        appt => appt.startDateTime.getHours() === hour
                      )

                      return (
                        <button
                          key={`hour-${hour}`}
                          type="button"
                          onClick={() => onTimeSlotClick(selectedDate, hour)}
                          disabled={isPastDate(selectedDate)}
                          className={`h-16 border-b border-default-light-muted w-full transition relative block p-1 ${
                            isPastDate(selectedDate)
                              ? 'opacity-80 cursor-not-allowed bg-default-dark-light pointer-events-none'
                              : 'bg-default-light hover:bg-distac-primary-light'
                          }`}
                        >
                          <div className="absolute inset-0 pointer-events-none">
                            {slotAppointments.map((appt, index) => {
                              const startMinutes = appt.startDateTime.getMinutes()
                              const slotRowHeight = 64
                              const topOffset = (startMinutes / 60) * slotRowHeight * 0.85
                              const height = (appt.durationMinutes / 60) * slotRowHeight * 0.85
                              const horizontalOffset = index * 10
                              const rightOffset = (slotAppointments.length - 1 - index) * 10

                              return (
                                <div
                                  key={appt.id}
                                  className={`absolute rounded-sm p-0.5 text-default-light text-[10px] overflow-hidden shadow-md cursor-pointer pointer-events-auto ${STATUS_COLORS[appt.status] || 'bg-slate-400'}`}
                                  style={{
                                    top: `${topOffset}px`,
                                    left: `${4 + horizontalOffset}px`,
                                    right: `${4 + rightOffset}px`,
                                    minHeight: `${Math.max(height, 14)}px`,
                                    maxHeight: `${slotRowHeight - 8}px`,
                                    zIndex: 10 + index,
                                  }}
                                  title={appt.title || 'Agendamento'}
                                >
                                  <p className="font-semibold text-xs">{appt.title || 'Agendamento'}</p>
                                  <p className="text-[10px] opacity-90 mt-1">
                                    {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(startMinutes).padStart(2, '0')} ({appt.durationMinutes}min)
                                  </p>
                                  <p className="text-[10px] opacity-75 mt-1">{STATUS_LABELS[appt.status]}</p>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      onOpenAppointmentTools(appt)
                                    }}
                                    className="absolute top-1 right-1 rounded-sm bg-default-light/90 p-0.5 text-default-dark hover:bg-default-light"
                                    aria-label="Abrir ferramentas do agendamento"
                                  >
                                    <Wrench size={11} />
                                  </button>
                                </div>
                              )
                            })}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-muted uppercase tracking-widest">
              {weekdayLabels.map(label => (
                <div key={`month-header-${label}`}>{label}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`month-empty-${index}`}
                      className="min-h-32 bg-default-light-muted border border-default-light-muted"
                    />
                  )
                }

                const cellDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)
                const dateKey = cellDate.toISOString().split('T')[0]
                const dayAppointments = filteredAppointments.filter(
                  appt => appt.startDateTime.toISOString().split('T')[0] === dateKey
                )
                const isSelectedDay = isSameDay(cellDate, selectedDate)
                const isPastCellDate = isPastDate(cellDate)

                return (
                  <button
                    key={`month-day-${day}`}
                    type="button"
                    onClick={() => onSelectDate(cellDate)}
                    className={[
                      'min-h-32 rounded-lg border p-2 text-left transition flex flex-col gap-1',
                      isSelectedDay ? 'border-distac-primary bg-distac-primary/5' : 'border-default-light-muted',
                      isPastCellDate ? 'bg-default-dark-light opacity-80' : 'bg-default-light-alt hover:border-distac-primary/60 hover:bg-distac-primary/5',
                    ].filter(Boolean).join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-default-dark">{day}</span>
                      {dayAppointments.length > 0 && (
                        <span className="text-[10px] font-semibold rounded-full bg-distac-primary text-default-light px-2 py-0.5">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {dayAppointments.slice(0, 3).map(appt => (
                        <button
                          key={appt.id}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            onOpenAppointmentTools(appt)
                          }}
                          className={`w-full rounded px-2 py-1 text-[10px] text-left flex items-center justify-between gap-2 ${STATUS_COLORS[appt.status] || 'bg-slate-400 text-default-light'}`}
                        >
                          <span className="truncate">
                            {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(appt.startDateTime.getMinutes()).padStart(2, '0')} {appt.title || 'Agendamento'}
                          </span>
                          <Wrench size={10} />
                        </button>
                      ))}

                      {dayAppointments.length > 3 && (
                        <p className="text-[10px] text-muted">+{dayAppointments.length - 3} agendamento(s)</p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t flex gap-4 justify-center flex-wrap text-xs">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${STATUS_COLORS[status]}`} />
            <span className="text-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
