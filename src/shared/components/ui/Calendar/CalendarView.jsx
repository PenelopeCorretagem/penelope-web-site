import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

const getCalendarDays = (baseDate) => {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const firstDay = new Date(year, month, 1)

  const startDate = new Date(firstDay)
  startDate.setDate(firstDay.getDate() - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)
    return date
  })
}

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

const toDateKey = (date) => date.toISOString().split('T')[0]

export function CalendarView({
  selectedDate = null,
  monthDate = null,
  onSelectDate,
  onChangeMonth,
  appointmentCountByDate = {},
  minDate = null,
  maxDate = null,
  isPastDate,
  allowPastDates = false,
  allowOtherMonthDates = true,
  isSameDay: customIsSameDay,
  weekDayLabels = WEEKDAY_LABELS,
  className = '',
  cellHeight = 'h-8',
}) {
  const currentDate = useMemo(() => {
    return monthDate instanceof Date ? monthDate : selectedDate instanceof Date ? selectedDate : new Date()
  }, [monthDate, selectedDate])

  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const monthName = `${MONTH_LABELS[currentDate.getMonth()]} ${currentDate.getFullYear()}`

  const dayCells = useMemo(() => getCalendarDays(currentDate), [currentDate])
  const sameDay = customIsSameDay || isSameDay

  const handleSelect = (date) => {
    if (typeof onSelectDate === 'function') {
      onSelectDate(date)
    }
  }

  const handleChangeMonth = (direction) => {
    if (typeof onChangeMonth === 'function') {
      onChangeMonth(direction)
    }
  }

  return (
    <div className={`w-full rounded-lg border border-default-light-muted bg-default-light p-3 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted">Calendário</p>
          <h3 className="text-sm font-semibold text-default-dark">{monthName}</h3>
        </div>

        {typeof onChangeMonth === 'function' && (
          <div className="flex items-center gap-1">
            <ButtonView
              type="button"
              width="fit"
              shape="square"
              color="white"
              className="!p-2 !min-w-0"
              onClick={() => handleChangeMonth(-1)}
              title="Mês anterior"
            >
              <ChevronLeft size={16} />
            </ButtonView>
            <ButtonView
              type="button"
              width="fit"
              shape="square"
              color="white"
              className="!p-2 !min-w-0"
              onClick={() => handleChangeMonth(1)}
              title="Próximo mês"
            >
              <ChevronRight size={16} />
            </ButtonView>
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted mb-2">
        {weekDayLabels.map(label => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayCells.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth()
          const dateKey = toDateKey(date)
          const selected = selectedDate instanceof Date && sameDay(date, selectedDate)
          const isPast = typeof isPastDate === 'function' ? isPastDate(date) : date < today
          const isBeforeMin = minDate instanceof Date && date < minDate
          const isAfterMax = maxDate instanceof Date && date > maxDate
          const isDisabledByRange = isBeforeMin || isAfterMax
          const hasAppointments = Boolean(appointmentCountByDate[dateKey])

          const buttonClasses = [
            'rounded-md',
            'text-[12px]',
            'font-medium',
            'transition',
            'relative',
            'w-full',
            cellHeight,
            'flex',
            'items-center',
            'justify-center',
            'focus:outline-none',
          ]

          const isDisabledByOtherMonth = !isCurrentMonth && !allowOtherMonthDates
          const isDisabledByPast = !allowPastDates && isPast
          const isDisabled = isDisabledByOtherMonth || isDisabledByPast || isDisabledByRange

          if (!isCurrentMonth) {
            buttonClasses.push('bg-default-light-muted', 'text-default-dark-muted')
          }

          if (selected) {
            buttonClasses.push('bg-distac-primary', 'text-default-light')
          } else if (isPast) {
            buttonClasses.push('bg-default-dark-light', 'text-default-light', 'hover:bg-default-dark-muted')
          } else if (isDisabled) {
            buttonClasses.push('bg-default-light-muted', 'text-default-dark-light', 'cursor-not-allowed')
          } else {
            buttonClasses.push('bg-default-light-alt', 'text-default-dark', 'hover:bg-distac-primary-light')
          }

          return (
            <button
              key={`${dateKey}-${index}`}
              type="button"
              onClick={() => !isDisabled && handleSelect(date)}
              disabled={isDisabled}
              className={buttonClasses.join(' ')}
              aria-label={`Selecionar ${date.toLocaleDateString('pt-BR')}`}
            >
              <span>{date.getDate()}</span>
              {hasAppointments && isCurrentMonth && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-distac-primary" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
