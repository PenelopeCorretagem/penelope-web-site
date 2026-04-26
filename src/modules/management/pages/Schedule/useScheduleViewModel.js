import { useState, useEffect, useCallback, useRef } from 'react'
import { ScheduleModel } from './ScheduleModel'
import * as appointmentCalService from '@service-calservice/appointmentCalService'
import { getAllEventTypes } from '@service-calservice/eventTypeService'

const getApiErrorMessage = (error, fallbackMessage) => {
  const violations = error?.response?.data?.violations
  if (Array.isArray(violations) && violations.length > 0) {
    return violations.map(item => item.message).join(' | ')
  }

  return error?.response?.data?.message || error?.message || fallbackMessage
}

const mapAppointmentToScheduleItem = (appointment, eventTypesById) => {
  const eventType = eventTypesById.get(appointment.eventTypeId) || null

  return {
    id: appointment.id,
    bookingUid: appointment.bookingUid,
    eventTypeId: appointment.eventTypeId,
    estateId: eventType?.estateId || null,
    clientId: appointment.clientId,
    estateAgentId: appointment.estateAgentId,
    durationMinutes: appointment.durationMinutes || 60,
    status: appointment.status || 'PENDING',
    startDateTime: appointment.startDateTime ? new Date(appointment.startDateTime) : null,
    endDateTime: appointment.endDateTime ? new Date(appointment.endDateTime) : null,
    attendeeName: appointment.attendeeName || '',
    attendeeEmail: appointment.attendeeEmail || '',
    notes: appointment.notes || '',
    reason: appointment.reason || '',
    title: eventType?.title || 'Agendamento',
    date: appointment.startDateTime ? new Date(appointment.startDateTime) : null,
  }
}

export function useScheduleViewModel() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [model] = useState(() => new ScheduleModel([]))
  const [eventTypesById, setEventTypesById] = useState(() => new Map())
  const [appointmentsForSelectedDate, setAppointmentsForSelectedDate] = useState([])
  const [totalAppointments, setTotalAppointments] = useState(model.getTotal())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const selectedDateRef = useRef(selectedDate)

  useEffect(() => {
    selectedDateRef.current = selectedDate
  }, [selectedDate])

  const refreshDerivedData = useCallback((dateToUse) => {
    setTotalAppointments(model.getTotal())
    setAppointmentsForSelectedDate(model.getByDate(dateToUse))
  }, [model])

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [appointments, eventTypes] = await Promise.all([
        appointmentCalService.getAllAppointments({ size: 100 }),
        getAllEventTypes({ size: 100 }),
      ])

      const eventTypeMap = new Map(eventTypes.map(eventType => [eventType.id, eventType]))
      const mappedAppointments = appointments.map(appointment =>
        mapAppointmentToScheduleItem(appointment, eventTypeMap)
      )

      setEventTypesById(eventTypeMap)
      model.setAppointments(mappedAppointments)
      refreshDerivedData(selectedDateRef.current)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao carregar agendamentos'))
    } finally {
      setLoading(false)
    }
  }, [model, refreshDerivedData])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Atualiza a lista filtrada toda vez que a data selecionada muda
  useEffect(() => {
    const appts = model.getByDate(selectedDate)
    setAppointmentsForSelectedDate(appts)
  }, [model, selectedDate])

  // Substitui todos os agendamentos (usado pelo backend)
  const setAppointments = useCallback((appointments = []) => {
    model.setAppointments(appointments)
    refreshDerivedData(selectedDate)
  }, [model, refreshDerivedData, selectedDate])

  // Adiciona um único agendamento e atualiza estados
  const addAppointment = useCallback((appointment) => {
    model.add(appointment)
    refreshDerivedData(selectedDate)
  }, [model, refreshDerivedData, selectedDate])

  const applyUpdatedAppointment = useCallback((updatedAppointment) => {
    const mapped = mapAppointmentToScheduleItem(updatedAppointment, eventTypesById)
    model.replaceById(updatedAppointment.id, mapped)
    refreshDerivedData(selectedDate)
    return mapped
  }, [model, eventTypesById, refreshDerivedData, selectedDate])

  const confirmAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentCalService.confirmAppointment(appointmentId)
      return applyUpdatedAppointment(updated)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao confirmar agendamento'))
      throw err
    }
  }, [applyUpdatedAppointment])

  const concludeAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentCalService.concludeAppointment(appointmentId)
      return applyUpdatedAppointment(updated)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao concluir agendamento'))
      throw err
    }
  }, [applyUpdatedAppointment])

  const cancelAppointment = useCallback(async (appointmentId, reason = null) => {
    try {
      setError(null)
      const updated = await appointmentCalService.cancelAppointment(appointmentId, reason)
      return applyUpdatedAppointment(updated)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao cancelar agendamento'))
      throw err
    }
  }, [applyUpdatedAppointment])

  const deleteAppointment = useCallback(async (appointmentId) => {
    await appointmentCalService.deleteAppointment(appointmentId)
    model.removeById(appointmentId)
    refreshDerivedData(selectedDate)
  }, [model, refreshDerivedData, selectedDate])

  const totalAppointmentsToday = appointmentsForSelectedDate.length

  // Próximos agendamentos (globais) — usa model.getAll()
  const upcomingAppointments = (() => {
    const all = model.getAll()
    const now = new Date()
    return all
      .filter(a => a.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5)
  })()

  // Total de agendamentos no mês selecionado
  const monthCount = (() => {
    const all = model.getAll()
    return all.filter(a => {
      const d = a.date
      return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear()
    }).length
  })()

  return {
    // Estado
    selectedDate,
    setSelectedDate,
    loading,
    error,

    // Dados
    appointmentsForSelectedDate,
    totalAppointments,
    totalAppointmentsToday,
    allAppointments: model.getAll(),

    // Commands for integration
    setAppointments,
    addAppointment,
    refreshAppointments: loadAppointments,
    confirmAppointment,
    concludeAppointment,
    cancelAppointment,
    deleteAppointment,
    loadAppointments,
    // Derivados
    upcomingAppointments,
    monthCount,
  }
}
