import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * useScheduleUIState.js
 * Hook para gerenciar estado da interface (modais, abas, confirmações)
 */

export function useScheduleUIState() {
  const [viewMode, setViewMode] = useState('week')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedModalDate, setSelectedModalDate] = useState(new Date())
  const [selectedModalHour, setSelectedModalHour] = useState(10)
  const [appointmentToEdit, setAppointmentToEdit] = useState(null)
  const [busyAppointmentId, setBusyAppointmentId] = useState(null)
  const [selectedAppointmentForTools, setSelectedAppointmentForTools] = useState(null)
  const [confirmationAlert, setConfirmationAlert] = useState(null)
  const [isConfirmationAlertProcessing, setIsConfirmationAlertProcessing] = useState(false)
  const [successAlert, setSuccessAlert] = useState(null)
  const [errorAlert, setErrorAlert] = useState(null)
  const successAlertTimeoutRef = useRef(null)
  const errorAlertTimeoutRef = useRef(null)

  const handleTimeSlotClick = useCallback((date, hour, isPastDate) => {
    if (isPastDate) return

    setSelectedModalDate(date)
    setSelectedModalHour(hour)
    setAppointmentToEdit(null)
    setIsModalOpen(true)
  }, [])

  const handleRescheduleAppointment = useCallback((appointment) => {
    if (!appointment) return

    setAppointmentToEdit(appointment)
    setSelectedModalDate(appointment.startDateTime)
    setSelectedModalHour(appointment.startDateTime.getHours())
    setIsModalOpen(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false)
    setAppointmentToEdit(null)
  }, [])

  const handleOpenAppointmentTools = useCallback((appointment) => {
    if (!appointment) return

    setSelectedAppointmentForTools(appointment)
  }, [])

  const handleCloseAppointmentTools = useCallback(() => {
    setSelectedAppointmentForTools(null)
  }, [])

  const closeConfirmationAlert = useCallback(() => {
    setConfirmationAlert(null)
    setIsConfirmationAlertProcessing(false)
  }, [])

  const openConfirmationAlert = useCallback(({ type = 'warning', message, confirmLabel, confirmColor = 'pink', onConfirm }) => {
    setConfirmationAlert({ type, message, confirmLabel, confirmColor, onConfirm })
    setIsConfirmationAlertProcessing(false)
  }, [])

  const closeSuccessAlert = useCallback(() => {
    setSuccessAlert(null)

    if (successAlertTimeoutRef.current) {
      clearTimeout(successAlertTimeoutRef.current)
      successAlertTimeoutRef.current = null
    }
  }, [])

  const openSuccessAlert = useCallback((message, durationMs = 2000) => {
    if (!message) return

    setSuccessAlert({ type: 'success', message })

    if (successAlertTimeoutRef.current) {
      clearTimeout(successAlertTimeoutRef.current)
    }

    successAlertTimeoutRef.current = setTimeout(() => {
      setSuccessAlert(null)
      successAlertTimeoutRef.current = null
    }, durationMs)
  }, [])

  const closeErrorAlert = useCallback(() => {
    setErrorAlert(null)

    if (errorAlertTimeoutRef.current) {
      clearTimeout(errorAlertTimeoutRef.current)
      errorAlertTimeoutRef.current = null
    }
  }, [])

  const openErrorAlert = useCallback((message, durationMs = 0) => {
    if (!message) return

    setErrorAlert({ type: 'error', message })

    if (errorAlertTimeoutRef.current) {
      clearTimeout(errorAlertTimeoutRef.current)
      errorAlertTimeoutRef.current = null
    }

    if (durationMs > 0) {
      errorAlertTimeoutRef.current = setTimeout(() => {
        setErrorAlert(null)
        errorAlertTimeoutRef.current = null
      }, durationMs)
    }
  }, [])

  const runConfirmationAlertAction = useCallback(async () => {
    if (!confirmationAlert?.onConfirm) return

    const action = confirmationAlert.onConfirm
    setIsConfirmationAlertProcessing(true)

    try {
      await action()
    } finally {
      setIsConfirmationAlertProcessing(false)
    }
  }, [confirmationAlert])

  useEffect(() => {
    return () => {
      if (successAlertTimeoutRef.current) {
        clearTimeout(successAlertTimeoutRef.current)
      }

      if (errorAlertTimeoutRef.current) {
        clearTimeout(errorAlertTimeoutRef.current)
      }
    }
  }, [])

  return {
    viewMode,
    setViewMode,
    isModalOpen,
    selectedModalDate,
    selectedModalHour,
    appointmentToEdit,
    busyAppointmentId,
    setBusyAppointmentId,
    selectedAppointmentForTools,
    confirmationAlert,
    isConfirmationAlertProcessing,
    successAlert,
    errorAlert,
    handleTimeSlotClick,
    handleRescheduleAppointment,
    handleModalClose,
    handleOpenAppointmentTools,
    handleCloseAppointmentTools,
    closeConfirmationAlert,
    openConfirmationAlert,
    closeSuccessAlert,
    openSuccessAlert,
    closeErrorAlert,
    openErrorAlert,
    runConfirmationAlertAction,
  }
}
