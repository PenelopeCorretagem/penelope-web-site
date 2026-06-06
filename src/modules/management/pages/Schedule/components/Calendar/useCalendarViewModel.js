import { useState, useCallback, useMemo, useEffect } from 'react'
import CalendarModel from './CalendarModel'

/**
 * useCalendarViewModel.js
 * Hook para gerenciar lógica de visualização do calendário
 */

export function useCalendarViewModel(appointments = []) {
  const [calendarModel] = useState(() => new CalendarModel(appointments, new Date(), 'month'))
  const [viewMode, setViewMode] = useState('month')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [forceUpdate, setForceUpdate] = useState(0)

  // Atualiza modelo quando appointments muda
  useEffect(() => {
    calendarModel.setAppointments(appointments)
    setForceUpdate(prev => prev + 1)
  }, [appointments, calendarModel])

  // Atualiza modelo quando viewMode muda
  useEffect(() => {
    calendarModel.setViewMode(viewMode)
  }, [viewMode, calendarModel])

  // Atualiza modelo quando selectedDate muda
  useEffect(() => {
    calendarModel.setSelectedDate(selectedDate)
  }, [selectedDate, calendarModel])

  const currentMonthName = useMemo(() => calendarModel.getCurrentMonthName(), [selectedDate, forceUpdate])
  const weekdayLabels = useMemo(() => CalendarModel.getWeekdayLabels(), [])
  const weekDates = useMemo(() => calendarModel.getWeekDates(), [selectedDate, forceUpdate])
  const calendarDays = useMemo(() => calendarModel.getMonthDays(), [selectedDate, forceUpdate])
  const hours = useMemo(() => CalendarModel.getBusinessHours(), [])

  const selectedDateAppointments = useMemo(
    () => calendarModel.getAppointmentsForDay(selectedDate),
    [selectedDate, appointments, forceUpdate]
  )

  const selectedDateAppointmentsByStatus = useMemo(
    () => calendarModel.getAppointmentsByStatusForDay(selectedDate),
    [selectedDate, appointments, forceUpdate]
  )

  const appointmentsCountByDate = useMemo(() => calendarModel.getAppointmentCountByDate(), [appointments, forceUpdate])

  const monthlyAppointmentsByStatus = useMemo(
    () => calendarModel.getMonthlyAppointmentsByStatus(),
    [selectedDate, appointments, forceUpdate]
  )

  const navigateLabels = useMemo(() => CalendarModel.getPeriodNavigationLabels(viewMode), [viewMode])

  const appointmentsByDay = useMemo(
    () => {
      const map = {}
      appointments.forEach(appt => {
        const dateKey = new Date(appt.startDateTime).toISOString().split('T')[0]
        if (!map[dateKey]) {
          map[dateKey] = []
        }
        map[dateKey].push(appt)
      })
      return map
    },
    [appointments]
  )

  const handleNavigatePeriod = useCallback(
    direction => {
      const newDate = new Date(selectedDate)

      switch (viewMode) {
        case 'day':
          newDate.setDate(newDate.getDate() + direction)
          break
        case 'week':
          newDate.setDate(newDate.getDate() + direction * 7)
          break
        case 'month':
          newDate.setMonth(newDate.getMonth() + direction)
          break
        default:
          break
      }

      setSelectedDate(newDate)
    },
    [selectedDate, viewMode]
  )

  const handleGoToToday = useCallback(() => {
    setSelectedDate(new Date())
  }, [])

  const handleChangeMonth = useCallback(direction => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setSelectedDate(newDate)
  }, [selectedDate])

  return {
    // Estado do modelo
    viewMode,
    setViewMode,
    selectedDate,
    setSelectedDate,

    // Labels e formatação
    currentMonthName,
    weekdayLabels,
    navigateLabels,

    // Dados de navegação
    weekDates,
    calendarDays,
    hours,

    // Agendamentos
    selectedDateAppointments,
    selectedDateAppointmentsByStatus,
    appointmentsCountByDate,
    monthlyAppointmentsByStatus,
    appointmentsByDay,

    // Ações
    handleNavigatePeriod,
    handleGoToToday,
    handleChangeMonth,

    // Utilitários estáticos
    isPastDate: CalendarModel.isPastDate,
    isSameDay: CalendarModel.isSameDay,
  }
}
