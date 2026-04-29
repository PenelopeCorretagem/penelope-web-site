import { useState, useEffect, useCallback, useRef } from 'react'
import * as appointmentCalService from '@service-calservice/appointmentCalService'
import { getAllEventTypes } from '@service-calservice/eventTypeService'
import { getAllAdvertisements } from '@service-penelopec/advertisementService'
import { ScheduleModel } from '../ScheduleModel'

/**
 * useScheduleAppointments.js
 * Hook para gerenciar carregamento, CRUD e mapeamento de agendamentos
 */

const getApiErrorMessage = (error, fallbackMessage) => {
  const violations = error?.response?.data?.violations
  if (Array.isArray(violations) && violations.length > 0) {
    return violations.map(item => item.message).join(' | ')
  }

  return error?.response?.data?.message || error?.message || fallbackMessage
}

const mapAppointmentToScheduleItem = (appointment, eventTypesById, estateDataById) => {
  const eventType = eventTypesById.get(appointment.eventTypeId) || null
  const estateData = eventType?.estateId ? (estateDataById.get(eventType.estateId) || null) : null

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
    estateTitle: estateData?.title || 'Imóvel não informado',
    estateTypeKey: estateData?.typeKey || null,
    estateTypeFriendlyName: estateData?.typeFriendlyName || 'Não informado',
    date: appointment.startDateTime ? new Date(appointment.startDateTime) : null,
  }
}

export function useScheduleAppointments() {
  const [model] = useState(() => new ScheduleModel([]))
  const [eventTypesById, setEventTypesById] = useState(() => new Map())
  const [estateDataById, setEstateDataById] = useState(() => new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalAppointments, setTotalAppointments] = useState(model.getTotal())

  const selectedDateRef = useRef(null)

  const refreshDerivedData = useCallback((dateToUse) => {
    setTotalAppointments(model.getTotal())
  }, [model])

  const loadAppointments = useCallback(async (selectedDate, filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const [appointments, eventTypes, advertisements] = await Promise.all([
        appointmentCalService.getAllAppointments({ size: 100, ...filters }),
        getAllEventTypes({ size: 100 }),
        getAllAdvertisements({ active: true, size: 100 }),
      ])

      const eventTypeMap = new Map(eventTypes.map(eventType => [eventType.id, eventType]))
      const nextEstateDataById = new Map(
        advertisements
          .map(advertisement => {
            const estateId = advertisement?.estate?.id
            const estateTitle = advertisement?.estate?.title
            const estateType = advertisement?.estate?.type

            return [
              estateId,
              {
                title: estateTitle || 'Imóvel não informado',
                typeKey: estateType?.key || null,
                typeFriendlyName: estateType?.friendlyName || 'Não informado',
              },
            ]
          })
          .filter(([estateId]) => estateId)
      )

      const mappedAppointments = appointments.map(appointment =>
        mapAppointmentToScheduleItem(appointment, eventTypeMap, nextEstateDataById)
      )

      setEventTypesById(eventTypeMap)
      setEstateDataById(nextEstateDataById)
      model.setAppointments(mappedAppointments)
      refreshDerivedData(selectedDate)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao carregar agendamentos'))
    } finally {
      setLoading(false)
    }
  }, [model, refreshDerivedData])

  // Operações CRUD
  const setAppointments = useCallback((appointments = [], selectedDate) => {
    model.setAppointments(appointments)
    refreshDerivedData(selectedDate)
  }, [model, refreshDerivedData])

  const addAppointment = useCallback((appointment, selectedDate) => {
    model.add(appointment)
    refreshDerivedData(selectedDate)
  }, [model, refreshDerivedData])

  const applyUpdatedAppointment = useCallback((updatedAppointment, selectedDate) => {
    const mapped = mapAppointmentToScheduleItem(updatedAppointment, eventTypesById, estateDataById)
    model.replaceById(updatedAppointment.id, mapped)
    refreshDerivedData(selectedDate)
    return mapped
  }, [model, eventTypesById, estateDataById, refreshDerivedData])

  const confirmAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentCalService.confirmAppointment(appointmentId)
      return updated
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao confirmar agendamento'))
      throw err
    }
  }, [])

  const concludeAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentCalService.concludeAppointment(appointmentId)
      return updated
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao concluir agendamento'))
      throw err
    }
  }, [])

  const cancelAppointment = useCallback(async (appointmentId, reason = null) => {
    try {
      setError(null)
      const updated = await appointmentCalService.cancelAppointment(appointmentId, reason)
      return updated
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao cancelar agendamento'))
      throw err
    }
  }, [])

  const deleteAppointment = useCallback(async (appointmentId, selectedDate) => {
    try {
      setError(null)
      await appointmentCalService.deleteAppointment(appointmentId)
      model.removeById(appointmentId)
      refreshDerivedData(selectedDate)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao excluir agendamento'))
      throw err
    }
  }, [model, refreshDerivedData])

  return {
    model,
    eventTypesById,
    estateDataById,
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
