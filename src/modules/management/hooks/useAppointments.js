import { useState, useCallback } from 'react'
import * as appointmentService from '@service-calservice/appointmentService'
import { AppointmentCollectionModel } from '@management/models/AppointmentCollectionModel'

/**
 * useAppointments.js
 * Hook simplificado para gerenciar carregamento, CRUD e coleta de agendamentos.
 *
 * Com o novo endpoint /appointments/report, o backend retorna dados já enriquecidos:
 * - estateTitle, estateTypeKey, estateTypeFriendlyName já vêm do backend
 * - cliente, corretor, imóvel e tipo de imóvel já são retornados completos
 * - nenhuma heurística de título ou cruzamento de dados é necessária
 */



export function useAppointments() {
  const [model] = useState(() => new AppointmentCollectionModel([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalAppointments, setTotalAppointments] = useState(model.getTotal())

  const refreshDerivedData = useCallback(() => {
    setTotalAppointments(model.getTotal())
  }, [model])

  /**
   * Carrega agendamentos com todas as informações enriquecidas do backend
   */
  const loadAppointments = useCallback(async (selectedDate, filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await appointmentService.getAppointmentsReport({
        size: 100,
        ...filters,
      })

      const appointments = response?.content || []
      model.setAppointments(appointments)
      refreshDerivedData()
    } catch (err) {
      setError(err.message || 'Erro ao carregar agendamentos')
    } finally {
      setLoading(false)
    }
  }, [model, refreshDerivedData])

  const setAppointments = useCallback((appointments = [], selectedDate) => {
    model.setAppointments(appointments)
    refreshDerivedData()
  }, [model, refreshDerivedData])

  const addAppointment = useCallback((appointment, selectedDate) => {
    model.add(appointment)
    refreshDerivedData()
  }, [model, refreshDerivedData])

  const applyUpdatedAppointment = useCallback((updatedAppointment, selectedDate) => {
    model.replaceById(updatedAppointment.id, updatedAppointment)
    refreshDerivedData()
    return updatedAppointment
  }, [model, refreshDerivedData])

  const confirmAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentService.confirmAppointment(appointmentId)
      return updated
    } catch (err) {
      setError(err.message || 'Erro ao confirmar agendamento')
      throw err
    }
  }, [])

  const concludeAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentService.concludeAppointment(appointmentId)
      return updated
    } catch (err) {
      setError(err.message || 'Erro ao concluir agendamento')
      throw err
    }
  }, [])

  const cancelAppointment = useCallback(async (appointmentId, reason = null) => {
    try {
      setError(null)
      const updated = await appointmentService.cancelAppointment(appointmentId, reason)
      return updated
    } catch (err) {
      setError(err.message || 'Erro ao cancelar agendamento')
      throw err
    }
  }, [])

  const deleteAppointment = useCallback(async (appointmentId, selectedDate) => {
    try {
      setError(null)
      await appointmentService.deleteAppointment(appointmentId)
      model.removeById(appointmentId)
      refreshDerivedData()
    } catch (err) {
      setError(err.message || 'Erro ao excluir agendamento')
      throw err
    }
  }, [model, refreshDerivedData])

  return {
    model,
    loading,
    error,
    setError,
    totalAppointments,
    loadAppointments,
    setAppointments,
    addAppointment,
    applyUpdatedAppointment,
    confirmAppointment,
    concludeAppointment,
    cancelAppointment,
    deleteAppointment,
  }
}
