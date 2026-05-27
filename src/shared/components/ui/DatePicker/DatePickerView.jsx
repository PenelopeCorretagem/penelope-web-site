import { useState, useEffect, useRef } from 'react'
import { InputView } from '@shared/components/ui/Input/InputView'
import { CalendarView } from '@shared/components/ui/Calendar/CalendarView'
import { ChevronDown } from 'lucide-react'

const toIsoDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toDisplayDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const parseIsoDate = (value) => {
  if (!value) return null
  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return null
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  if (Number.isNaN(parsed.getTime())) return null
  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return null
  }
  return parsed
}

const parseDisplayDate = (value) => {
  if (!value) return null
  const digits = String(value).replace(/\D/g, '')
  if (digits.length !== 8) return null

  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)

  const parsed = new Date(Number(year), Number(month) - 1, Number(day))
  if (Number.isNaN(parsed.getTime())) return null
  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return null
  }

  return parsed
}

const maskDisplayDate = (value) => {
  const digits = String(value).replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const isValidPartialDate = (value) => {
  const digits = String(value).replace(/\D/g, '')
  if (digits.length === 0) return true

  if (digits.length === 1) {
    return /^[0-3]$/.test(digits)
  }

  if (digits.length === 2) {
    const day = Number(digits)
    return day >= 1 && day <= 31
  }

  if (digits.length === 3) {
    const day = Number(digits.slice(0, 2))
    const monthFirstDigit = digits[2]
    return day >= 1 && day <= 31 && /^[0-1]$/.test(monthFirstDigit)
  }

  if (digits.length === 4) {
    const day = Number(digits.slice(0, 2))
    const month = Number(digits.slice(2, 4))
    return day >= 1 && day <= 31 && month >= 1 && month <= 12
  }

  if (digits.length <= 8) {
    const day = Number(digits.slice(0, 2))
    const month = Number(digits.slice(2, 4))
    if (day < 1 || day > 31 || month < 1 || month > 12) return false
    if (digits.length < 8) return true
    return parseDisplayDate(value) !== null
  }

  return false
}

export function DatePickerView({
  value = '',
  onChange,
  placeholder = 'Selecione a data',
  className = '',
  calendarClassName = '',
  inputClassName = '',
  minDate = null,
  maxDate = null,
  disabled = false,
  readOnly = false,
  hasLabel = true,
  required = false,
  name = '',
  id = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [monthDate, setMonthDate] = useState(parseIsoDate(value) || new Date())
  const [inputValue, setInputValue] = useState(value || '')
  const wrapperRef = useRef(null)

  useEffect(() => {
    const parsed = parseIsoDate(value)
    setInputValue(parsed ? toDisplayDate(parsed) : '')
    if (parsed) {
      setMonthDate(parsed)
    }
  }, [value])

  const handleInputValueChange = (nextValue) => {
    const typed = String(nextValue)
    const masked = maskDisplayDate(typed)

    if (!isValidPartialDate(masked)) {
      return
    }

    setInputValue(masked)

    if (typeof onChange !== 'function') return

    const parsed = parseDisplayDate(masked)
    if (parsed) {
      onChange(toIsoDate(parsed))
    } else if (masked.replace(/\D/g, '').length === 0) {
      onChange('')
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleSelectDate = (date) => {
    const nextValue = toIsoDate(date)
    setInputValue(nextValue)
    setMonthDate(date)
    setIsOpen(false)
    if (typeof onChange === 'function') {
      onChange(nextValue)
    }
  }

  const handleMonthChange = (direction) => {
    const next = new Date(monthDate)
    next.setMonth(next.getMonth() + direction)
    setMonthDate(next)
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`.trim()}>
      <InputView
        type="text"
        value={inputValue}
        onChange={handleInputValueChange}
        onClick={() => {
          if (!disabled && !readOnly) {
            setIsOpen(prev => !prev)
          }
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        hasLabel={hasLabel}
        required={required}
        className={`min-w-36 ${inputClassName}`.trim()}
        id={id}
        name={name}
      />
      <button
        type="button"
        onClick={() => {
          if (!disabled && !readOnly) {
            setIsOpen(prev => !prev)
          }
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-default-dark"
        aria-label="Abrir calendário"
        tabIndex={-1}
      >
        <ChevronDown size={18} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 top-full left-0 mt-2 ${calendarClassName || 'w-[min(100vw,18rem)]'}`.trim()}>
          <CalendarView
            selectedDate={parseIsoDate(value)}
            monthDate={monthDate}
            onSelectDate={handleSelectDate}
            onChangeMonth={handleMonthChange}
            minDate={minDate}
            maxDate={maxDate}
            allowPastDates={true}
            className="shadow-lg"
          />
        </div>
      )}
    </div>
  )
}
