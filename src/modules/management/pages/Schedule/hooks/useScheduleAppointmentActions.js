import { useCallback } from 'react'

/**
 * useScheduleAppointmentActions.js
 * Hook para gerenciar ações de agendamento (confirm, conclude, cancel, delete)
 */

export function useScheduleAppointmentActions(appointmentService) {
  const executeConfirm = useCallback(async (appointmentId) => {
    try {
      const updated = await appointmentService.confirmAppointment(appointmentId)
      return updated
    } catch (err) {
      throw err
    }
  }, [appointmentService])

  const executeConclude = useCallback(async (appointmentId) => {
    try {
      const updated = await appointmentService.concludeAppointment(appointmentId)
      return updated
    } catch (err) {
      throw err
    }
  }, [appointmentService])

  const executeCancel = useCallback(async (appointmentId, reason = 'Cancelado pelo gestor no painel de agenda') => {
    try {
      const updated = await appointmentService.cancelAppointment(appointmentId, reason)
      return updated
    } catch (err) {
      throw err
    }
  }, [appointmentService])

  const executeDelete = useCallback(async (appointmentId) => {
    try {
      await appointmentService.deleteAppointment(appointmentId)
    } catch (err) {
      throw err
    }
  }, [appointmentService])

  return {
    executeConfirm,
    executeConclude,
    executeCancel,
    executeDelete,
  }
}
