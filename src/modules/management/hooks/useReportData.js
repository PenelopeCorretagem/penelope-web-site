import { useState, useCallback, useMemo, useEffect } from 'react'
import ReportModel, { PERIOD_TYPES } from '../pages/AppointmentReport/components/layout/Report/ReportModel'

/**
 * useReportData.js
 * Hook para gerenciar lógica de relatórios de agendamento.
 */

export function useReportData(appointments = []) {
  const [periodType, setPeriodType] = useState(PERIOD_TYPES.MONTHLY)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [reportModel] = useState(() => new ReportModel(appointments, periodType, startDate, endDate))

  useEffect(() => {
    reportModel.setAppointments(appointments)
  }, [appointments, reportModel])

  useEffect(() => {
    reportModel.setPeriodType(periodType)
  }, [periodType, reportModel])

  useEffect(() => {
    reportModel.setDateRange(startDate, endDate)
  }, [startDate, endDate, reportModel])

  const confirmationRate = useMemo(() => reportModel.getConfirmationRate(), [reportModel])
  const completionRate = useMemo(() => reportModel.getCompletionRate(), [reportModel])
  const cancellationRate = useMemo(() => reportModel.getCancellationRate(), [reportModel])

  const statusDistribution = useMemo(() => reportModel.getStatusDistribution(), [reportModel])
  const appointmentsByEstate = useMemo(() => reportModel.getAppointmentsByEstate(), [reportModel])
  const appointmentsByEstateType = useMemo(() => reportModel.getAppointmentsByEstateType(), [reportModel])
  const appointmentsByWeekDay = useMemo(() => reportModel.getAppointmentsByWeekDay(), [reportModel])
  const timeSeriesData = useMemo(() => reportModel.getTimeSeriesData(), [reportModel])
  const timeSeriesDataByStatus = useMemo(() => reportModel.getTimeSeriesDataByStatus(), [reportModel])

  const totalAppointments = useMemo(() => reportModel.getTotalAppointments(), [reportModel])
  const totalPending = useMemo(() => reportModel.getTotalPending(), [reportModel])
  const totalConfirmed = useMemo(() => reportModel.getTotalConfirmed(), [reportModel])
  const totalConcluded = useMemo(() => reportModel.getTotalConcluded(), [reportModel])
  const totalCancelled = useMemo(() => reportModel.getTotalCancelled(), [reportModel])

  const handlePeriodChange = useCallback((newPeriodType) => {
    setPeriodType(newPeriodType)
  }, [])

  const handleDateChange = useCallback((newStartDate, newEndDate) => {
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }, [])

  const handleResetDates = useCallback(() => {
    setStartDate(null)
    setEndDate(null)
  }, [])

  return {
    periodType,
    handlePeriodChange,
    startDate,
    endDate,
    handleDateChange,
    handleResetDates,
    confirmationRate,
    completionRate,
    cancellationRate,
    statusDistribution,
    appointmentsByEstate,
    appointmentsByEstateType,
    appointmentsByWeekDay,
    timeSeriesData,
    timeSeriesDataByStatus,
    totalAppointments,
    totalPending,
    totalConfirmed,
    totalConcluded,
    totalCancelled,
  }
}
