import { useMemo, useCallback, useState } from 'react'
import { WEEKDAY_LABELS, ScheduleModel } from '../ScheduleModel'

/**
 * useScheduleCalendarData.js
 * Hook para cálculos de datas e dados de calendário
 */

export function useScheduleCalendarData(selectedDate, filteredAppointments = []) {
  const weekdayLabels = useMemo(() => WEEKDAY_LABELS, [])

  const weekDates = useMemo(() => {
    return ScheduleModel.getWeekDates(selectedDate)
  }, [selectedDate])

  const calendarDays = useMemo(() => {
    return ScheduleModel.buildCalendarDays(selectedDate)
  }, [selectedDate])

  const hours = useMemo(() => Array.from({ length: 11 }, (_, index) => index + 9), [])

  const appointmentsByDay = useMemo(() => {
    return ScheduleModel.getAppointmentsByDay(weekDates, filteredAppointments)
  }, [weekDates, filteredAppointments])

  const appointmentsCountByDate = useMemo(() => {
    return ScheduleModel.getAppointmentsCountByDate(filteredAppointments)
  }, [filteredAppointments])

  const selectedDateAppointments = useMemo(() => {
    return ScheduleModel.getSelectedDateAppointments(filteredAppointments, selectedDate)
  }, [filteredAppointments, selectedDate])

  const selectedDateAppointmentsByStatus = useMemo(() => {
    return ScheduleModel.getAppointmentsByStatus(selectedDateAppointments)
  }, [selectedDateAppointments])

  const monthlyAppointmentsByStatus = useMemo(() => {
    return ScheduleModel.getMonthlyAppointmentsByStatus(filteredAppointments, selectedDate)
  }, [filteredAppointments, selectedDate])

  const currentMonthName = useMemo(() => {
    return selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }, [selectedDate])

  const navigateLabels = useMemo(() => {
    return ScheduleModel.getPeriodNavigationLabels('week')
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
