import { useCallback } from 'react'

/**
 * useAppointmentActions.js
 * Hook para gerenciar ações de agendamento (confirm, conclude, cancel, delete).
 */

export function useAppointmentActions(appointmentService) {
  const executeConfirm = useCallback(async (appointmentId) => {
    return appointmentService.confirmAppointment(appointmentId)
  }, [appointmentService])

  const executeConclude = useCallback(async (appointmentId) => {
    return appointmentService.concludeAppointment(appointmentId)
  }, [appointmentService])

  const executeCancel = useCallback(async (appointmentId, reason = 'Cancelado pelo gestor no painel de agenda') => {
    return appointmentService.cancelAppointment(appointmentId, reason)
  }, [appointmentService])

  const executeDelete = useCallback(async (appointmentId) => {
    return appointmentService.deleteAppointment(appointmentId)
  }, [appointmentService])

  return {
    executeConfirm,
    executeConclude,
    executeCancel,
    executeDelete,
  }
}
