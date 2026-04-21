/**
 * useCalServiceAppointments.js
 * Hook customizado para gerenciar appointments do cal-service
 * 
 * Exemplo de implementação para referência
 * Use como base para integrar com ScheduleView
 */

import { useState, useEffect, useCallback } from 'react'
import * as appointmentCalService from '@service-calservice/appointmentCalService'

/**
 * Hook para gerenciar appointments com filtros
 * @param {object} initialFilters - Filtros iniciais { estateId, status, dateFrom, dateTo }
 * @returns {object} State e métodos para gerenciar appointments
 */
export function useCalServiceAppointments(initialFilters = {}) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)

  // Carrega appointments com filtros
  const loadAppointments = useCallback(async (filtersToUse = filters) => {
    try {
      setLoading(true)
      setError(null)
      const data = await appointmentCalService.getAllAppointments(filtersToUse)
      setAppointments(data)
    } catch (err) {
      setError(err.message || 'Erro ao carregar agendamentos')
      console.error('❌ Erro ao carregar appointments:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Carrega appointments ao montar ou filtros mudarem
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Busca um appointment específico
  const getById = useCallback(async (id) => {
    try {
      return await appointmentCalService.getAppointmentById(id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Cria novo appointment
  const create = useCallback(async (appointmentData) => {
    try {
      const created = await appointmentCalService.createAppointment(appointmentData)
      setAppointments([...appointments, created])
      return created
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [appointments])

  // Reagenda appointment
  const reschedule = useCallback(async (id, rescheduleData) => {
    try {
      const updated = await appointmentCalService.rescheduleAppointment(id, rescheduleData)
      setAppointments(appointments.map(a => a.id === id ? updated : a))
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [appointments])

  // Confirma appointment (PENDING → CONFIRMED)
  const confirm = useCallback(async (id) => {
    try {
      const confirmed = await appointmentCalService.confirmAppointment(id)
      setAppointments(appointments.map(a => a.id === id ? confirmed : a))
      return confirmed
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [appointments])

  // Conclui appointment (CONFIRMED → CONCLUDED)
  const conclude = useCallback(async (id) => {
    try {
      const concluded = await appointmentCalService.concludeAppointment(id)
      setAppointments(appointments.map(a => a.id === id ? concluded : a))
      return concluded
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [appointments])

  // Cancela appointment
  const cancel = useCallback(async (id, reason) => {
    try {
      const cancelled = await appointmentCalService.cancelAppointment(id, reason)
      setAppointments(appointments.map(a => a.id === id ? cancelled : a))
      return cancelled
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [appointments])

  // Deleta appointment
  const remove = useCallback(async (id) => {
    try {
      await appointmentCalService.deleteAppointment(id)
      setAppointments(appointments.filter(a => a.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [appointments])

  // Atualiza filtros e recarrega
  const updateFilters = useCallback(async (newFilters) => {
    setFilters(newFilters)
    await loadAppointments(newFilters)
  }, [loadAppointments])

  return {
    // Estado
    appointments,
    loading,
    error,
    filters,

    // Comandos
    loadAppointments,
    updateFilters,
    create,
    getById,
    reschedule,
    confirm,
    conclude,
    cancel,
    remove,

    // Derivados
    pending: appointments.filter(a => a.status === 'PENDING'),
    confirmed: appointments.filter(a => a.status === 'CONFIRMED'),
    concluded: appointments.filter(a => a.status === 'CONCLUDED'),
    cancelled: appointments.filter(a => a.status === 'CANCELLED'),
  }
}
