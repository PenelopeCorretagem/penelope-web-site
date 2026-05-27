import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'

/**
 * DateTimeSelectionView.jsx
 * Componente para seleção de data e hora com calendário visual
 * Bloqueia datas passadas e horas anteriores à atual
 */

const HOURS = Array.from({ length: 11 }, (_, i) => i + 9) // 9-19
const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAY_NAMES_PT = {
  Sunday: 'Domingo',
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
}

const parseTimeString = (timeString) => {
  if (!timeString || typeof timeString !== 'string') {
    return null
  }

  const [hour, minute] = timeString.split(':').map(value => Number(value.trim()))
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null
  }

  return { hour, minute }
}

const getScheduleAvailabilityForDate = (workSchedule, date) => {
  if (!workSchedule || !Array.isArray(workSchedule.availability)) {
    return []
  }

  const weekdayName = WEEKDAY_NAMES[date.getDay()]
  return workSchedule.availability.filter(item =>
    Array.isArray(item.days) && item.days.includes(weekdayName)
  )
}

const getScheduleHours = (availability, durationMinutes) => {
  if (!availability || !durationMinutes) return []

  return availability.flatMap(item => {
    const start = parseTimeString(item.startTime)
    const end = parseTimeString(item.endTime)
    if (!start || !end) return []

    const startDate = new Date(2024, 0, 1, start.hour, start.minute)
    const endDate = new Date(2024, 0, 1, end.hour, end.minute)
    const step = 60 * 60 * 1000
    const durationMs = durationMinutes * 60 * 1000

    const hours = []
    let current = new Date(startDate)

    while (current.getTime() + durationMs <= endDate.getTime()) {
      hours.push(current.getHours())
      current = new Date(current.getTime() + step)
    }

    return hours
  }).filter((hour, index, self) => self.indexOf(hour) === index).sort((a, b) => a - b)
}

const buildCalendarDays = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const monthStartOffset = firstDayOfMonth.getDay()

  const blanks = Array.from({ length: monthStartOffset }, () => null)
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
  return [...blanks, ...days]
}

const startOfDay = (date) => {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  return nextDate
}

const isSameDay = (firstDate, secondDate) => {
  return startOfDay(firstDate).getTime() === startOfDay(secondDate).getTime()
}

const isPastDate = (date) => {
  const today = startOfDay(new Date())
  const checkDate = startOfDay(date)
  return checkDate < today
}

const getMonthName = (date) => {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

const formatLocalDateTime = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function DateTimeSelectionView({
  dateTimeValue = '',
  onDateTimeChange = () => {},
  disabled = false,
  durationMinutes = 60,
  workSchedule = null,
  availableSlots = [],
  slotsLoading = false,
  slotsError = null,
  showDuration = true,
  leftFooter = null,
  notesSection = null,
}) {
  const [viewMonth, setViewMonth] = useState(() => new Date())

  const selectedDate = useMemo(() => {
    if (!dateTimeValue) return new Date()
    return new Date(dateTimeValue)
  }, [dateTimeValue])

  const selectedHour = useMemo(() => {
    if (!dateTimeValue) return 9
    return new Date(dateTimeValue).getHours()
  }, [dateTimeValue])

  const calendarDays = useMemo(() => buildCalendarDays(viewMonth), [viewMonth])
  const monthName = useMemo(() => getMonthName(viewMonth), [viewMonth])

  const handlePrevMonth = () => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const handleSelectDate = (day) => {
    if (!day) return

    const cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day)

    // Não permitir data passada
    if (isPastDate(cellDate)) return

    // Manter hora atual ou resetar para 9 se for data futura
    const hour = isSameDay(cellDate, new Date()) ? selectedHour : 9
    const newDateTime = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(), hour, 0, 0, 0)

    onDateTimeChange({ target: { value: formatLocalDateTime(newDateTime) } })
  }

  const handleSelectHour = (hour) => {
    const newDateTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, 0, 0, 0)

    onDateTimeChange({ target: { value: formatLocalDateTime(newDateTime) } })
  }

  const getAvailableHours = () => {
    const scheduleAvailability = getScheduleAvailabilityForDate(workSchedule, selectedDate)
    const now = new Date()
    const isToday = isSameDay(selectedDate, now)

    let availableHours = []

    if (Array.isArray(availableSlots) && availableSlots.length > 0) {
      availableHours = Array.from(new Set(
        availableSlots
          .map(slot => {
            const slotDate = new Date(slot)
            return isSameDay(slotDate, selectedDate) ? slotDate.getHours() : null
          })
          .filter(hour => Number.isFinite(hour))
      )).sort((a, b) => a - b)
    } else if (scheduleAvailability.length > 0) {
      availableHours = getScheduleHours(scheduleAvailability, durationMinutes)
    } else {
      availableHours = HOURS
    }

    if (isToday) {
      const currentHour = now.getHours()
      return availableHours.filter(h => h > currentHour)
    }

    return availableHours
  }

  const availableHours = getAvailableHours()

  const isScheduleDay = (date) => {
    if (!workSchedule) return true
    const scheduleAvailability = getScheduleAvailabilityForDate(workSchedule, date)
    return scheduleAvailability.length > 0
  }

  const renderCalendarDay = (day, index) => {
    if (!day) {
      return <div key={`empty-${index}`} className="bg-slate-50" />
    }

    const cellDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day)
    const isSelected = isSameDay(cellDate, selectedDate)
    const isDisabled = isPastDate(cellDate) || !isScheduleDay(cellDate)
    const isToday = isSameDay(cellDate, new Date())

    return (
      <button
        key={`day-${day}`}
        type="button"
        onClick={() => handleSelectDate(day)}
        disabled={isDisabled}
        style={isSelected
          ? { boxShadow: 'inset 0 0 0 2px #b33c8e', color: '#ebe9e9' }
          : isToday
            ? { boxShadow: 'inset 0 0 0 2px #36221d' }
            : undefined
        }
        className={`aspect-square rounded-md text-sm font-medium transition ${
          isSelected
            ? 'bg-distac-primary font-semibold'
            : isToday
              ? 'font-semibold'
              : isDisabled
                ? 'bg-slate-100 opacity-50 cursor-not-allowed'
                : 'bg-white border border-slate-200 hover:border-distac-primary hover:bg-distac-primary/5'
        }`}
      >
        {day}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-default-dark mb-3 uppercase">
          Selecione Data e Hora
        </label>

        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Calendário */}
          <div className="w-full lg:w-[22rem] lg:flex-shrink-0 bg-white border border-slate-200 rounded-lg p-3 lg:p-4">
            {/* Header do calendário */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-default-dark capitalize">{monthName}</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-100 rounded transition"
                  aria-label="Mês anterior"
                >
                  <ChevronLeft size={18} className="text-default-dark" />
                </button>
                <button
                  type="button"
                  onClick={handleToday}
                  className="px-2 py-1 text-xs font-medium text-distac-primary border border-distac-primary rounded hover:bg-distac-primary/5 transition"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-100 rounded transition"
                  aria-label="Próximo mês"
                >
                  <ChevronRight size={18} className="text-default-dark" />
                </button>
              </div>
            </div>

            {workSchedule ? (
              <div className="mb-3 rounded-lg bg-distac-primary-light border border-distac-primary/20 p-3 text-xs text-default-dark">
                <p className="font-semibold text-default-dark mb-1">Horários de trabalho</p>
                {workSchedule.availability.map((item, index) => (
                  <p key={index} className="text-sm leading-tight">
                    {item.days.map(day => WEEKDAY_NAMES_PT[day] || day).join(', ')}: {item.startTime} - {item.endTime}
                  </p>
                ))}
              </div>
            ) : null}

            {/* Labels dos dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAY_LABELS.map(label => (
                <div
                  key={label}
                  className="text-center text-[10px] font-semibold text-muted uppercase"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Grid de dias */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => renderCalendarDay(day, index))}
            </div>

            {/* Info */}
            <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-muted space-y-1">
              <p><strong>Selecionado:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
            </div>

            {leftFooter && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                {leftFooter}
              </div>
            )}
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            {showDuration && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-default-dark uppercase mb-1">Duração: <span className="text-sm text-default-dark">60 minutos</span></p>
              </div>
            )}

            {/* Selector de Horas */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-default-dark mb-3 uppercase">
                Horário de Início
              </p>

              {slotsLoading && (
                <div className="bg-slate-50 border border-slate-200 text-default-dark p-3 rounded text-sm mb-3">
                  Carregando horários disponíveis...
                </div>
              )}

              {slotsError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded text-sm mb-3">
                  {slotsError}
                </div>
              )}

              {availableHours.length === 0 && !slotsLoading ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded text-sm">
                  Nenhum horário disponível para o dia selecionado.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {HOURS.map(hour => {
                    const isAvailable = availableHours.includes(hour)
                    const isSelected = selectedHour === hour

                    return (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => handleSelectHour(hour)}
                        disabled={!isAvailable || disabled}
                        style={isSelected
                          ? { boxShadow: 'inset 0 0 0 2px #b33c8e', color: '#ebe9e9' }
                          : undefined
                        }
                        className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                          isSelected
                            ? 'bg-distac-primary font-semibold'
                            : isAvailable
                              ? 'bg-white border border-slate-200 hover:border-distac-primary hover:bg-distac-primary/5'
                              : 'bg-slate-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {String(hour).padStart(2, '0')}:00
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {notesSection && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                {notesSection}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
