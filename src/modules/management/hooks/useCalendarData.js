import { useMemo } from 'react'
import { CalendarModel, WEEKDAY_LABELS } from '@management/models/CalendarModel'

/**
 * useCalendarData.js
 * Hook para cálculos de datas e dados de calendário.
 */

export function useCalendarData(selectedDate, filteredAppointments = []) {
  const weekdayLabels = useMemo(() => WEEKDAY_LABELS, [])

  const weekDates = useMemo(() => {
    return CalendarModel.getWeekDates(selectedDate)
  }, [selectedDate])

  const calendarDays = useMemo(() => {
    return CalendarModel.buildCalendarDays(selectedDate)
  }, [selectedDate])

  const hours = useMemo(() => Array.from({ length: 11 }, (_, index) => index + 9), [])

  const appointmentsByDay = useMemo(() => {
    return CalendarModel.getAppointmentsByDay(weekDates, filteredAppointments)
  }, [weekDates, filteredAppointments])

  const appointmentsCountByDate = useMemo(() => {
    return CalendarModel.getAppointmentsCountByDate(filteredAppointments)
  }, [filteredAppointments])

  const selectedDateAppointments = useMemo(() => {
    return CalendarModel.getSelectedDateAppointments(filteredAppointments, selectedDate)
  }, [filteredAppointments, selectedDate])

  const selectedDateAppointmentsByStatus = useMemo(() => {
    return CalendarModel.getAppointmentsByStatus(selectedDateAppointments)
  }, [selectedDateAppointments])

  const monthlyAppointmentsByStatus = useMemo(() => {
    return CalendarModel.getMonthlyAppointmentsByStatus(filteredAppointments, selectedDate)
  }, [filteredAppointments, selectedDate])

  const currentMonthName = useMemo(() => {
    return selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }, [selectedDate])

  const navigateLabels = useMemo(() => {
    return CalendarModel.getPeriodNavigationLabels('week')
  }, [])

  return {
    weekdayLabels,
    weekDates,
    calendarDays,
    hours,
    appointmentsByDay,
    appointmentsCountByDate,
    selectedDateAppointments,
    selectedDateAppointmentsByStatus,
    monthlyAppointmentsByStatus,
    currentMonthName,
    navigateLabels,
  }
}
