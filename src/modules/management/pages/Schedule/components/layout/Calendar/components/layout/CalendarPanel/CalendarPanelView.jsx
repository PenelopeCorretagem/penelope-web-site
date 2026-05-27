import { Calendar, CalendarDays, Calendar1, ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { STATUS_COLORS, STATUS_LABELS } from '../../../../../../ScheduleModel'

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const getScheduleAvailabilityForDate = (workSchedule, date) => {
  if (!workSchedule || !Array.isArray(workSchedule.availability)) {
    return []
  }

  const weekdayName = WEEKDAY_NAMES[date.getDay()]
  return workSchedule.availability.filter(item =>
    Array.isArray(item.days) && item.days.includes(weekdayName)
  )
}

const parseTimeString = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return null
  const [hour, minute] = timeString.split(':').map(value => Number(value.trim()))
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null
  return { hour, minute }
}

const getScheduleHours = (availability, durationMinutes) => {
  if (!Array.isArray(availability) || !durationMinutes) return []

  return availability.flatMap(item => {
    const start = parseTimeString(item.startTime)
    const end = parseTimeString(item.endTime)
    if (!start || !end) return []

    const startDate = new Date(2024, 0, 1, start.hour, start.minute)
    const endDate = new Date(2024, 0, 1, end.hour, end.minute)
    const durationMs = durationMinutes * 60 * 1000
    const step = 60 * 60 * 1000

    const hours = []
    let current = new Date(startDate)

    while (current.getTime() + durationMs <= endDate.getTime()) {
      hours.push(current.getHours())
      current = new Date(current.getTime() + step)
    }

    return hours
  }).filter((hour, index, self) => self.indexOf(hour) === index).sort((a, b) => a - b)
}

const isSlotAllowedBySchedule = (workSchedule, date, hour, durationMinutes = 60) => {
  if (!workSchedule) {
    return false
  }

  const availability = getScheduleAvailabilityForDate(workSchedule, date)
  if (availability.length === 0) {
    return false
  }

  const allowedHours = getScheduleHours(availability, durationMinutes)
  return allowedHours.includes(hour)
}

export function CalendarPanelView({
  viewMode,
  setViewMode,
  onNavigatePeriod,
  navigateLabels,
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
  canChangeViewMode = true,
  isAllAgentsMode = false,
  estateAgentScopeFilterOptions = [],
  workSchedule = null,
}) {
  const handleKeyActivate = (event, onActivate) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  const canCreateAppointments = typeof onTimeSlotClick === 'function'

  return (
    <div className="flex-1 min-h-[500px] xl:min-h-0 bg-default-light border-2 border-default-light-muted rounded-lg shadow p-4 md:p-6 overflow-hidden flex flex-col">
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

        <div className="flex flex-col items-end gap-2 xl:hidden">
          <div className="flex items-center gap-1">
            <ButtonView
              type="button"
              onClick={() => setViewMode('day')}
              active={viewMode === 'day'}
              color="white"
              width="fit"
              shape="square"
              className="!p-1.5 !min-w-0"
              title="Visualizacao diaria"
            >
              <Calendar1 size={14} />
            </ButtonView>
            {canChangeViewMode && (
              <>
                <ButtonView
                  type="button"
                  onClick={() => setViewMode('week')}
                  active={viewMode === 'week'}
                  color="white"
                  width="fit"
                  shape="square"
                  className="!p-1.5 !min-w-0"
                  title="Visualizacao semanal"
                >
                  <Calendar size={14} />
                </ButtonView>
                <ButtonView
                  type="button"
                  onClick={() => setViewMode('month')}
                  active={viewMode === 'month'}
                  color="white"
                  width="fit"
                  shape="square"
                  className="!p-1.5 !min-w-0"
                  title="Visualizacao mensal"
                >
                  <CalendarDays size={14} />
                </ButtonView>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ButtonView
              type="button"
              onClick={() => onNavigatePeriod(-1)}
              color="white"
              width="fit"
              shape="square"
              className="!p-1.5 !min-w-0"
              title="Período anterior"
              aria-label="Período anterior"
            >
              <ChevronLeft size={14} />
            </ButtonView>
            <ButtonView
              type="button"
              onClick={() => onNavigatePeriod(1)}
              color="white"
              width="fit"
              shape="square"
              className="!p-1.5 !min-w-0"
              title="Próximo período"
              aria-label="Próximo período"
            >
              <ChevronRight size={14} />
            </ButtonView>
          </div>
        </div>

        <div className="hidden xl:flex flex-col items-end gap-2">
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
            {canChangeViewMode && (
              <>
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
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            <ButtonView
              type="button"
              onClick={() => onNavigatePeriod(-1)}
              color="white"
              width="fit"
              shape="square"
              className="!p-2 !min-w-0"
              title={navigateLabels.previous}
              aria-label={navigateLabels.previous}
            >
              <ChevronLeft size={18} />
            </ButtonView>
            <ButtonView
              type="button"
              onClick={() => onNavigatePeriod(1)}
              color="white"
              width="fit"
              shape="square"
              className="!p-2 !min-w-0"
              title={navigateLabels.next}
              aria-label={navigateLabels.next}
            >
              <ChevronRight size={18} />
            </ButtonView>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        {viewMode === 'week' ? (
          <div className="grid grid-cols-8 gap-0.5 md:gap-2 min-w-full">
            <div className="w-8 md:w-16 flex-shrink-0">
              <div className="h-12" />
              {hours.map(hour => (
                <div key={hour} className="h-7 md:h-10 text-[9px] md:text-xs text-muted flex items-start justify-end pr-1 md:pr-2">
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
                  <button
                    type="button"
                    onClick={() => onSelectDate(date)}
                    className="h-12 w-full flex flex-col items-center justify-center border-b border-default-light-muted hover:bg-distac-primary/5 transition"
                    aria-label={`Selecionar ${weekdayLabels[dayIndex]} ${date.getDate()}`}
                  >
                    <p className="text-xs font-semibold text-default-dark">{weekdayLabels[dayIndex]}</p>
                    <p className="text-sm font-bold text-distac-primary">{date.getDate()}</p>
                  </button>

                  <div className="relative">
                    {hours.map(hour => {
                      const slotAppointments = dayAppointments.filter(appt => appt.startDateTime.getHours() === hour)
                      const isHourAllowed = isSlotAllowedBySchedule(workSchedule, date, hour)
                      const isSlotDisabled = isPastDate(date) || !isHourAllowed

                      return (
                        <div
                          key={`${dateKey}-${hour}`}
                          role={canCreateAppointments && !isSlotDisabled ? 'button' : undefined}
                          tabIndex={canCreateAppointments && !isSlotDisabled ? 0 : -1}
                          onClick={canCreateAppointments && !isSlotDisabled ? () => onTimeSlotClick(date, hour) : undefined}
                          onKeyDown={canCreateAppointments && !isSlotDisabled ? (event) => handleKeyActivate(event, () => onTimeSlotClick(date, hour)) : undefined}
                          className={`h-7 md:h-10 border-b border-default-light-muted w-full transition relative block md:p-1 overflow-hidden ${
                            isPastDate(date)
                              ? 'opacity-80 cursor-not-allowed bg-default-dark-light pointer-events-none'
                              : !isHourAllowed
                                ? 'opacity-60 cursor-not-allowed bg-slate-100'
                                : canCreateAppointments
                                  ? 'bg-default-light hover:bg-distac-primary-light cursor-pointer'
                                  : 'bg-default-light'
                          }`}
                        >
                          <div className="absolute inset-0 pointer-events-none">
                            {slotAppointments.map((appt, index) => {
                              const startMinutes = appt.startDateTime.getMinutes()
                              const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768
                              const slotRowHeight = isDesktop ? 32 : 28
                              const topOffset = (startMinutes / 60) * slotRowHeight
                              const height = (appt.durationMinutes / 60) * slotRowHeight
                              const widthPercent = 100 / slotAppointments.length
                              const leftPercent = index * widthPercent

                              return (
                                <div
                                  key={appt.id}
                                  role="button"
                                  tabIndex={0}
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    onOpenAppointmentTools(appt)
                                  }}
                                  onKeyDown={(event) => {
                                    event.stopPropagation()
                                    handleKeyActivate(event, () => onOpenAppointmentTools(appt))
                                  }}
                                  className={`absolute rounded-sm p-0.5 text-default-light text-[10px] overflow-hidden cursor-pointer pointer-events-auto ${STATUS_COLORS[appt.status] || 'bg-slate-400'}`}
                                  style={{
                                    top: `${topOffset}px`,
                                    left: `calc(${leftPercent}% + 2px)`,
                                    width: `calc(${widthPercent}% - 4px)`,
                                    minHeight: `${Math.max(height, isDesktop ? 12 : 8)}px`,
                                    maxHeight: `${Math.max(slotRowHeight - 2, 0)}px`,
                                    zIndex: 10 + index,
                                  }}
                                  title={appt.title || 'Agendamento'}
                                >
                                  <p className="font-semibold truncate text-xs">{appt.title || 'Agendamento'}</p>
                                  <p className="hidden md:block text-[9px] opacity-90">
                                    {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(startMinutes).padStart(2, '0')}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ) : viewMode === 'day' ? (
          isAllAgentsMode ? (
            // Visualização em colunas por corretor
            <div className="min-w-full h-full flex flex-col">
              <div className="flex items-center justify-center pb-3 border-b border-default-light-muted">
                <div className="text-center">
                  <p className="text-xs text-muted uppercase tracking-widest">
                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                  </p>
                  <p className="text-xl font-bold text-distac-primary">{selectedDate.getDate()}</p>
                </div>
              </div>

              <div className="flex-1 relative mt-3 overflow-x-auto">
                <div className="flex gap-1.5">
                  {/* Coluna de horários */}
                  <div className="w-8 md:w-12 flex-shrink-0">
                    {hours.map(hour => (
                      <div key={hour} className="h-16 text-[9px] md:text-xs text-muted flex items-start justify-end pr-0.5 md:pr-1 font-medium">
                        {String(hour).padStart(2, '0')}:00
                      </div>
                    ))}
                  </div>

                  {/* Colunas por corretor (sem TODOS) */}
                  {estateAgentScopeFilterOptions.filter(agent => agent.value !== 'TODOS').map(agent => {
                    const agentAppointments = selectedDateAppointments.filter(appt => String(appt.estateAgentId) === String(agent.value))

                    return (
                      <div key={`agent-${agent.value}`} className="flex-1 min-w-[200px] border border-default-light-muted rounded-lg bg-default-light-alt overflow-hidden">
                        {/* Header com nome do corretor */}
                        <div className="bg-distac-secondary text-default-light px-2 py-1.5 text-center border-b border-default-light-muted">
                          <p className="text-xs font-semibold truncate">{agent.label}</p>
                          <p className="text-[10px] opacity-90">{agentAppointments.length} agend.</p>
                        </div>

                        {/* Grid de horários */}
                        <div className="relative">
                          {hours.map(hour => {
                            const slotAppointments = agentAppointments.filter(appt => appt.startDateTime.getHours() === hour)
                            const isSlotDisabled = isPastDate(selectedDate)
                            const handleAgentSlotClick = () => {
                              if (!onTimeSlotClick || isSlotDisabled) return

                              onTimeSlotClick(selectedDate, hour)
                            }

                            return (
                              <div
                                key={`slot-${agent.value}-${hour}`}
                                role={canCreateAppointments && !isSlotDisabled ? 'button' : undefined}
                                tabIndex={canCreateAppointments && !isSlotDisabled ? 0 : -1}
                                onClick={canCreateAppointments && !isSlotDisabled ? handleAgentSlotClick : undefined}
                                onKeyDown={canCreateAppointments && !isSlotDisabled ? (event) => handleKeyActivate(event, handleAgentSlotClick) : undefined}
                                className={`h-16 border-b border-default-light-muted relative p-0.5 ${isSlotDisabled ? 'bg-default-dark-light opacity-80 cursor-not-allowed' : 'bg-default-light hover:bg-distac-primary-light/30 cursor-pointer'} transition`}
                              >
                                {slotAppointments.map((appt, index) => {
                                  const startMinutes = appt.startDateTime.getMinutes()
                                  const slotRowHeight = 64
                                  const topOffset = (startMinutes / 60) * slotRowHeight * 0.85
                                  const height = (appt.durationMinutes / 60) * slotRowHeight * 0.85

                                  return (
                                    <div
                                      key={appt.id}
                                      role="button"
                                      tabIndex={0}
                                      onClick={(event) => {
                                        event.stopPropagation()
                                        onOpenAppointmentTools(appt)
                                      }}
                                      onKeyDown={(event) => {
                                        event.stopPropagation()
                                        handleKeyActivate(event, () => onOpenAppointmentTools(appt))
                                      }}
                                      className={`absolute rounded-sm p-0.5 text-default-light text-[8px] overflow-hidden shadow-sm cursor-pointer pointer-events-auto ${STATUS_COLORS[appt.status] || 'bg-slate-400'}`}
                                      style={{
                                        top: `${topOffset}px`,
                                        left: '2px',
                                        right: '2px',
                                        width: 'calc(100% - 4px)',
                                        minHeight: `${Math.max(height, 12)}px`,
                                        maxHeight: `${slotRowHeight - 4}px`,
                                        zIndex: 10 + index,
                                      }}
                                      title={appt.title || 'Agendamento'}
                                    >
                                      <p className="font-semibold text-[8px] leading-tight">{appt.title || 'Agend.'}</p>
                                      <p className="text-[7px] opacity-90 leading-tight mt-0.5">
                                        {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(startMinutes).padStart(2, '0')} ({appt.durationMinutes}m)
                                      </p>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Visualização padrão de um único agendador
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
                  <div className="flex gap-2 md:gap-4">
                    <div className="w-10 md:w-16 flex-shrink-0">
                      {hours.map(hour => (
                        <div key={hour} className="h-16 text-[10px] md:text-xs text-muted flex items-start justify-end pr-1 md:pr-2 font-medium">
                          {String(hour).padStart(2, '0')}:00
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 relative">
                      {hours.map(hour => {
                        const slotAppointments = selectedDateAppointments.filter(
                          appt => appt.startDateTime.getHours() === hour
                        )

                        const isHourAllowed = isSlotAllowedBySchedule(workSchedule, selectedDate, hour)
                        const isSlotDisabled = isPastDate(selectedDate) || !isHourAllowed

                        return (
                          <div
                            key={`hour-${hour}`}
                            role={canCreateAppointments && !isSlotDisabled ? 'button' : undefined}
                            tabIndex={canCreateAppointments && !isSlotDisabled ? 0 : -1}
                            onClick={canCreateAppointments && !isSlotDisabled ? () => onTimeSlotClick(selectedDate, hour) : undefined}
                            onKeyDown={canCreateAppointments && !isSlotDisabled ? (event) => handleKeyActivate(event, () => onTimeSlotClick(selectedDate, hour)) : undefined}
                            className={`h-16 border-b border-default-light-muted w-full transition relative block p-1 overflow-hidden ${
                              isPastDate(selectedDate)
                                ? 'opacity-80 cursor-not-allowed bg-default-dark-light pointer-events-none'
                                : !isHourAllowed
                                  ? 'bg-slate-100 opacity-60 cursor-not-allowed'
                                  : canCreateAppointments
                                    ? 'bg-default-light hover:bg-distac-primary-light cursor-pointer'
                                    : 'bg-default-light'
                            }`}
                          >
                            <div className="absolute inset-0 pointer-events-none">
                              {slotAppointments.map((appt, index) => {
                                const startMinutes = appt.startDateTime.getMinutes()
                                const slotRowHeight = 56
                                const topOffset = (startMinutes / 60) * slotRowHeight
                                const height = (appt.durationMinutes / 60) * slotRowHeight
                                const widthPercent = 100 / slotAppointments.length
                                const leftPercent = index * widthPercent

                                return (
                                  <div
                                    key={appt.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      onOpenAppointmentTools(appt)
                                    }}
                                    onKeyDown={(event) => {
                                      event.stopPropagation()
                                      handleKeyActivate(event, () => onOpenAppointmentTools(appt))
                                    }}
                                    className={`absolute rounded-sm p-0.5 text-default-light text-[10px] overflow-hidden shadow-md cursor-pointer pointer-events-auto ${STATUS_COLORS[appt.status] || 'bg-slate-400'}`}
                                    style={{
                                      top: `${topOffset}px`,
                                      left: `calc(${leftPercent}% + 2px)`,
                                      width: `calc(${widthPercent}% - 4px)`,
                                      minHeight: `${Math.max(height, 14)}px`,
                                      maxHeight: `${Math.max(slotRowHeight - 8, 0)}px`,
                                      zIndex: 10 + index,
                                    }}
                                    title={appt.title || 'Agendamento'}
                                  >
                                    <p className="font-semibold text-xs">{appt.title || 'Agendamento'}</p>
                                    <p className="text-[10px] opacity-90 mt-1">
                                      {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(startMinutes).padStart(2, '0')} ({appt.durationMinutes}min)
                                    </p>
                                    <p className="text-[10px] opacity-75 mt-1">{STATUS_LABELS[appt.status]}</p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="min-w-full">
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs font-semibold text-muted uppercase tracking-widest">
              {weekdayLabels.map(label => (
                <div key={`month-header-${label}`}>{label}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`month-empty-${index}`}
                      className="min-h-16 md:min-h-32 bg-default-light-muted border border-default-light-muted"
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
                const defaultMonthHour = hours && hours.length > 0 ? hours[0] : 10
                const handleMonthDayAction = () => {
                  if (onTimeSlotClick && !isPastCellDate) {
                    onTimeSlotClick(cellDate, defaultMonthHour)
                    return
                  }

                  onSelectDate(cellDate)
                }

                return (
                  <div
                    key={`month-day-${day}`}
                    role="button"
                    tabIndex={0}
                    onClick={handleMonthDayAction}
                    onKeyDown={(event) => handleKeyActivate(event, handleMonthDayAction)}
                    className={[
                      'min-h-16 md:min-h-32 rounded-lg border p-1 md:p-2 text-left transition flex flex-col gap-0.5 md:gap-1 overflow-hidden',
                      isSelectedDay ? 'border-distac-primary bg-distac-primary/5' : 'border-default-light-muted',
                      isPastCellDate
                        ? 'bg-default-dark-light opacity-80'
                        : 'bg-default-light-alt hover:border-distac-primary/60 hover:bg-distac-primary/5 cursor-pointer',
                    ].filter(Boolean).join(' ')}
                  >
                    <div className="flex items-center justify-between gap-1 overflow-hidden">
                      <span className="text-[11px] md:text-sm font-semibold text-default-dark">{day}</span>
                      {dayAppointments.length > 0 && (
                        <span className="text-[9px] md:text-[10px] font-semibold rounded-full bg-distac-primary text-default-light px-1.5 py-0.5">
                          {dayAppointments.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {dayAppointments.slice(0, 3).map(appt => (
                        <div
                          key={appt.id}
                          role="button"
                          tabIndex={0}
                          onClick={(event) => {
                            event.stopPropagation()
                            onOpenAppointmentTools(appt)
                          }}
                          onKeyDown={(event) => {
                            event.stopPropagation()
                            handleKeyActivate(event, () => onOpenAppointmentTools(appt))
                          }}
                          className={`w-4 h-1.5 md:w-full md:h-auto rounded-md md:rounded md:px-2 md:py-1 text-[10px] text-left flex items-center justify-between gap-2 overflow-hidden ${STATUS_COLORS[appt.status] || 'bg-slate-400 text-default-light'}`}
                        >
                          <span className="hidden md:block truncate">
                            {String(appt.startDateTime.getHours()).padStart(2, '0')}:{String(appt.startDateTime.getMinutes()).padStart(2, '0')} {appt.title || 'Agendamento'}
                          </span>
                        </div>
                      ))}

                      {dayAppointments.length > 3 && (
                        <p className="text-[10px] text-muted">+{dayAppointments.length - 3} agendamento(s)</p>
                      )}
                    </div>
                  </div>
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
