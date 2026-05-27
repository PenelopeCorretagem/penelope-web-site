import { useState, useCallback } from 'react'
import * as appointmentService from '@service-calservice/appointmentService'
import { getAllEventTypes } from '@service-calservice/eventTypeService'
import { getAllAdvertisements } from '@service-penelopec/advertisementService'
import { AppointmentCollectionModel } from '@management/models/AppointmentCollectionModel'

/**
 * useAppointments.js
 * Hook para gerenciar carregamento, CRUD e mapeamento de agendamentos.
 */

const getApiErrorMessage = (error, fallbackMessage) => {
  const violations = error?.response?.data?.violations
  if (Array.isArray(violations) && violations.length > 0) {
    return violations.map(item => item.message).join(' | ')
  }

  return error?.response?.data?.message || error?.message || fallbackMessage
}

const mapAppointmentToScheduleItem = (appointment, eventTypesById, advertisementMapByTitle) => {
  const eventType = eventTypesById.get(appointment.eventTypeId) || null
  const estateTitle = String(eventType?.title || appointment.estate?.title || 'Imóvel não informado').trim()
  const matchedAdvertisement = advertisementMapByTitle.get(estateTitle.toLowerCase()) || null
  const estateTypeKey = matchedAdvertisement?.estate?.type?.key || appointment.estateTypeKey || null
  const estateTypeFriendlyName = matchedAdvertisement?.estate?.type?.friendlyName || appointment.estateTypeFriendlyName || 'Não informado'
  const estateId = eventType?.estateId || appointment.estate?.id || null

  return {
    id: appointment.id,
    bookingUid: appointment.bookingUid,
    eventTypeId: appointment.eventTypeId,
    estateId,
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
    createdAt: appointment.createdAt || null,
    updatedAt: appointment.updatedAt || null,
    title: eventType?.title || 'Agendamento',
    estateTitle,
    estateTypeKey,
    estateTypeFriendlyName,
    date: appointment.startDateTime ? new Date(appointment.startDateTime) : null,
  }
}

export function useAppointments() {
  const [model] = useState(() => new AppointmentCollectionModel([]))
  const [eventTypesById, setEventTypesById] = useState(() => new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalAppointments, setTotalAppointments] = useState(model.getTotal())

  const refreshDerivedData = useCallback(() => {
    setTotalAppointments(model.getTotal())
  }, [model])

  const loadAppointments = useCallback(async (selectedDate, filters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const [appointments, eventTypes] = await Promise.all([
        appointmentService.getAllAppointments({ size: 100, ...filters }),
        getAllEventTypes({ size: 100 }),
      ])

      const eventTypeMap = new Map(eventTypes.map(eventType => [eventType.id, eventType]))
      const eventTypeCreatedAtValues = eventTypes
        .map(type => type.createdAt)
        .filter(Boolean)
        .map(date => new Date(date))
        .filter(date => !Number.isNaN(date.getTime()))

      let dateFilters = { active: true }
      if (eventTypeCreatedAtValues.length > 0) {
        const sortedDates = eventTypeCreatedAtValues.sort((a, b) => a.getTime() - b.getTime())
        dateFilters = {
          createdAtMin: sortedDates[0].toISOString().split('T')[0],
          createdAtMax: sortedDates[sortedDates.length - 1].toISOString().split('T')[0],
          active: true,
        }
      }

      const advertisements = await getAllAdvertisements(dateFilters)

      const advertisementMapByTitle = new Map(
        advertisements
          .filter(ad => ad?.estate?.title)
          .map(ad => [String(ad.estate.title).trim().toLowerCase(), ad])
      )

      const mappedAppointments = appointments.map(appointment =>
        mapAppointmentToScheduleItem(appointment, eventTypeMap, advertisementMapByTitle)
      )

      // eslint-disable-next-line no-console
      console.log('[AppointmentReport] mappedAppointments:', mappedAppointments)

      setEventTypesById(eventTypeMap)
      model.setAppointments(mappedAppointments)
      refreshDerivedData(selectedDate)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao carregar agendamentos'))
    } finally {
      setLoading(false)
    }
  }, [model, refreshDerivedData])

  const setAppointments = useCallback((appointments = [], selectedDate) => {
    model.setAppointments(appointments)
    refreshDerivedData(selectedDate)
  }, [model, refreshDerivedData])

  const addAppointment = useCallback((appointment, selectedDate) => {
    model.add(appointment)
    refreshDerivedData(selectedDate)
  }, [model, refreshDerivedData])

  const applyUpdatedAppointment = useCallback((updatedAppointment, selectedDate) => {
    const mapped = mapAppointmentToScheduleItem(updatedAppointment, eventTypesById)
    model.replaceById(updatedAppointment.id, mapped)
    refreshDerivedData(selectedDate)
    return mapped
  }, [model, eventTypesById, refreshDerivedData])

  const confirmAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentService.confirmAppointment(appointmentId)
      return updated
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao confirmar agendamento'))
      throw err
    }
  }, [])

  const concludeAppointment = useCallback(async (appointmentId) => {
    try {
      setError(null)
      const updated = await appointmentService.concludeAppointment(appointmentId)
      return updated
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao concluir agendamento'))
      throw err
    }
  }, [])

  const cancelAppointment = useCallback(async (appointmentId, reason = null) => {
    try {
      setError(null)
      const updated = await appointmentService.cancelAppointment(appointmentId, reason)
      return updated
    } catch (err) {
      setError(getApiErrorMessage(err, 'Erro ao cancelar agendamento'))
      throw err
    }
  }, [])

  const deleteAppointment = useCallback(async (appointmentId, selectedDate) => {
    try {
      setError(null)
      await appointmentService.deleteAppointment(appointmentId)
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
