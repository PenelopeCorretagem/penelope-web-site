import { useState, useCallback, useMemo, useEffect } from 'react'
import ReportModel, { PERIOD_TYPES } from '../ReportModel'

/**
 * useScheduleReportData.js
 * Hook para gerenciar lógica de relatórios
 */

export function useScheduleReportData(appointments = []) {
  const [periodType, setPeriodType] = useState(PERIOD_TYPES.MONTHLY)
  const [reportModel] = useState(() => new ReportModel(appointments, periodType))

  // Atualiza modelo quando appointments muda
  useEffect(() => {
    reportModel.setAppointments(appointments)
  }, [appointments, reportModel])

  // Atualiza período do modelo quando muda
  useEffect(() => {
    reportModel.setPeriodType(periodType)
  }, [periodType, reportModel])

  const confirmationRate = useMemo(() => reportModel.getConfirmationRate(), [reportModel, appointments])
  const completionRate = useMemo(() => reportModel.getCompletionRate(), [reportModel, appointments])
  const cancellationRate = useMemo(() => reportModel.getCancellationRate(), [reportModel, appointments])

  const statusDistribution = useMemo(() => reportModel.getStatusDistribution(), [reportModel, appointments])
  const appointmentsByEstate = useMemo(() => reportModel.getAppointmentsByEstate(), [reportModel, appointments])
  const appointmentsByEstateType = useMemo(() => reportModel.getAppointmentsByEstateType(), [reportModel, appointments])
  const appointmentsByWeekDay = useMemo(() => reportModel.getAppointmentsByWeekDay(), [reportModel, appointments])
  const timeSeriesData = useMemo(() => reportModel.getTimeSeriesData(), [reportModel, appointments, periodType])
  const timeSeriesDataByStatus = useMemo(() => reportModel.getTimeSeriesDataByStatus(), [reportModel, appointments, periodType])

  const totalAppointments = useMemo(() => reportModel.getTotalAppointments(), [reportModel, appointments])
  const totalPending = useMemo(() => reportModel.getTotalPending(), [reportModel, appointments])
  const totalConfirmed = useMemo(() => reportModel.getTotalConfirmed(), [reportModel, appointments])
  const totalConcluded = useMemo(() => reportModel.getTotalConcluded(), [reportModel, appointments])
  const totalCancelled = useMemo(() => reportModel.getTotalCancelled(), [reportModel, appointments])

  const handlePeriodChange = useCallback((newPeriodType) => {
    setPeriodType(newPeriodType)
  }, [])

  return {
    // Estado
    periodType,
    handlePeriodChange,

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
