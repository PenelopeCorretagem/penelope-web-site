import { useState, useCallback, useMemo, useEffect } from 'react'
import ReportModel, { PERIOD_TYPES } from '../components/layout/Report/ReportModel'

/**
 * useScheduleReportData.js
 * Hook para gerenciar lógica de relatórios
 */

export function useScheduleReportData(appointments = []) {
  const [periodType, setPeriodType] = useState(PERIOD_TYPES.MONTHLY)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [reportModel] = useState(() => new ReportModel(appointments, periodType, startDate, endDate))

  // Atualiza modelo quando appointments muda
  useEffect(() => {
    reportModel.setAppointments(appointments)
  }, [appointments, reportModel])

  // Atualiza período do modelo quando muda
  useEffect(() => {
    reportModel.setPeriodType(periodType)
  }, [periodType, reportModel])

  // Atualiza range de datas do modelo quando muda
  useEffect(() => {
    reportModel.setDateRange(startDate, endDate)
  }, [startDate, endDate, reportModel])

  const confirmationRate = useMemo(() => reportModel.getConfirmationRate(), [reportModel, appointments, startDate, endDate])
  const completionRate = useMemo(() => reportModel.getCompletionRate(), [reportModel, appointments, startDate, endDate])
  const cancellationRate = useMemo(() => reportModel.getCancellationRate(), [reportModel, appointments, startDate, endDate])

  const statusDistribution = useMemo(() => reportModel.getStatusDistribution(), [reportModel, appointments, startDate, endDate])
  const appointmentsByEstate = useMemo(() => reportModel.getAppointmentsByEstate(), [reportModel, appointments, startDate, endDate])
  const appointmentsByEstateType = useMemo(() => reportModel.getAppointmentsByEstateType(), [reportModel, appointments, startDate, endDate])
  const appointmentsByWeekDay = useMemo(() => reportModel.getAppointmentsByWeekDay(), [reportModel, appointments, startDate, endDate])
  const timeSeriesData = useMemo(() => reportModel.getTimeSeriesData(), [reportModel, appointments, periodType, startDate, endDate])
  const timeSeriesDataByStatus = useMemo(() => reportModel.getTimeSeriesDataByStatus(), [reportModel, appointments, periodType, startDate, endDate])

  const totalAppointments = useMemo(() => reportModel.getTotalAppointments(), [reportModel, appointments, startDate, endDate])
  const totalPending = useMemo(() => reportModel.getTotalPending(), [reportModel, appointments, startDate, endDate])
  const totalConfirmed = useMemo(() => reportModel.getTotalConfirmed(), [reportModel, appointments, startDate, endDate])
  const totalConcluded = useMemo(() => reportModel.getTotalConcluded(), [reportModel, appointments, startDate, endDate])
  const totalCancelled = useMemo(() => reportModel.getTotalCancelled(), [reportModel, appointments, startDate, endDate])

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
    // Estado - Período
    periodType,
    handlePeriodChange,

    // Estado - Datas
    startDate,
    endDate,
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
