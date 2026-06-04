import { useState, useCallback, useMemo } from 'react'
import ReportModel, { PERIOD_TYPES } from './ReportModel'

/**
 * useReportViewModel.js
 * Hook para gerenciar lógica de relatórios
 */

export function useReportViewModel(appointments = []) {
  const [periodType, setPeriodType] = useState(PERIOD_TYPES.MONTHLY)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [dateError, setDateError] = useState('')

  const reportModel = useMemo(
    () => new ReportModel(appointments, periodType, startDate, endDate),
    [appointments, periodType, startDate, endDate]
  )

  const confirmationRate = useMemo(
    () => reportModel.getConfirmationRate(),
    [reportModel]
  )
  const completionRate = useMemo(
    () => reportModel.getCompletionRate(),
    [reportModel]
  )
  const cancellationRate = useMemo(
    () => reportModel.getCancellationRate(),
    [reportModel]
  )

  const statusDistribution = useMemo(
    () => reportModel.getStatusDistribution(),
    [reportModel]
  )
  const appointmentsByEstate = useMemo(
    () => reportModel.getAppointmentsByEstate(),
    [reportModel]
  )
  const appointmentsByEstateType = useMemo(
    () => reportModel.getAppointmentsByEstateType(),
    [reportModel]
  )
  const appointmentsByWeekDay = useMemo(
    () => reportModel.getAppointmentsByWeekDay(),
    [reportModel]
  )
  const timeSeriesData = useMemo(
    () => reportModel.getTimeSeriesData(),
    [reportModel]
  )
  const timeSeriesDataByStatus = useMemo(
    () => reportModel.getTimeSeriesDataByStatus(),
    [reportModel]
  )

  const totalAppointments = useMemo(
    () => reportModel.getTotalAppointments(),
    [reportModel]
  )
  const totalPending = useMemo(
    () => reportModel.getTotalPending(),
    [reportModel]
  )
  const totalConfirmed = useMemo(
    () => reportModel.getTotalConfirmed(),
    [reportModel]
  )
  const totalConcluded = useMemo(
    () => reportModel.getTotalConcluded(),
    [reportModel]
  )
  const totalCancelled = useMemo(
    () => reportModel.getTotalCancelled(),
    [reportModel]
  )

  const handlePeriodChange = useCallback(newPeriodType => {
    setPeriodType(newPeriodType)
  }, [])

  const handleDateChange = useCallback((newStartDate, newEndDate) => {
    if (newStartDate && newEndDate && newEndDate < newStartDate) {
      setDateError('Data de fim não pode ser menor que a data inicial.')
      return
    }

    setDateError('')
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }, [])

  const handleResetDates = useCallback(() => {
    setStartDate(null)
    setEndDate(null)
    setDateError('')
  }, [])

  return {
    // Estado - Período
    periodType,
    handlePeriodChange,

    // Estado - Datas
    startDate,
    endDate,
    dateError,
    handleDateChange,
    handleResetDates,

    // KPIs
    confirmationRate,
    completionRate,
    cancellationRate,

    // Distribuições
    statusDistribution,
    appointmentsByEstate,
    appointmentsByEstateType,
    appointmentsByWeekDay,

    // Séries temporais
    timeSeriesData,
    timeSeriesDataByStatus,

    // Totalizadores
    totalAppointments,
    totalPending,
    totalConfirmed,
    totalConcluded,
    totalCancelled,
  }
}
