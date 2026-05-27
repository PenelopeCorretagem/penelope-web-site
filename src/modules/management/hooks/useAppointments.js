import { useState, useCallback } from 'react'
import * as appointmentService from '@service-calservice/appointmentService'
import { getAllEventTypes } from '@service-calservice/eventTypeService'
import { getAllAdvertisements } from '@service-penelopec/advertisementService'
import { getEstateTypeByApiValue, getEstateTypeByKey } from '@constant/estateTypes'
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

const normalizeTextForMatch = (text) => String(text || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9çãáâàéêíóôõúüñ\s-]/gi, '')
  .replace(/\s+/g, ' ')

const createAdvertisementMapByTitle = (advertisements = []) => {
  return new Map(
    advertisements
      .filter(ad => ad?.estate?.title)
      .map(ad => [normalizeTextForMatch(ad.estate.title), ad])
  )
}

const findAdvertisementByTitle = (title, advertisements = [], advertisementMapByTitle = new Map()) => {
  const normalizedTitle = normalizeTextForMatch(title)
  if (!normalizedTitle) {
    return null
  }

  if (advertisementMapByTitle.has(normalizedTitle)) {
    const matched = advertisementMapByTitle.get(normalizedTitle)
    // eslint-disable-next-line no-console
    console.log('[DEBUG][AppointmentReport] found advertisement exact title', {
      title,
      normalizedTitle,
      matchedTitle: matched?.estate?.title,
    })
    return matched
  }

  const exactMatch = advertisements.find(ad => normalizeTextForMatch(ad?.estate?.title) === normalizedTitle)
  if (exactMatch) {
    // eslint-disable-next-line no-console
    console.log('[DEBUG][AppointmentReport] found advertisement exact title fallback', {
      title,
      normalizedTitle,
      matchedTitle: exactMatch?.estate?.title,
    })
    return exactMatch
  }

  const fuzzyMatch = advertisements.find(ad => {
    const normalizedAdTitle = normalizeTextForMatch(ad?.estate?.title)
    return normalizedAdTitle && (
      normalizedAdTitle.includes(normalizedTitle) || normalizedTitle.includes(normalizedAdTitle)
    )
  }) || null

  if (!fuzzyMatch) {
    // eslint-disable-next-line no-console
    console.log('[DEBUG][AppointmentReport] no advertisement match for title', {
      title,
      normalizedTitle,
      advertisementTitles: advertisements
        .map(ad => normalizeTextForMatch(ad?.estate?.title))
        .filter(Boolean)
        .slice(0, 40),
    })
  }

  return fuzzyMatch
}

const mapAppointmentToScheduleItem = (
  appointment,
  eventTypesById,
  advertisements = [],
  advertisementMapByTitle = new Map()
) => {
  const eventType = eventTypesById.get(appointment.eventTypeId) || null
  const estateTitle = String(appointment.estate?.title || eventType?.title || 'Imóvel não informado').trim()
  let matchedAdvertisement = findAdvertisementByTitle(estateTitle, advertisements, advertisementMapByTitle)

  if (!matchedAdvertisement && appointment.eventTypeId) {
    matchedAdvertisement = advertisements.find(ad => ad?.eventTypeId?.id === appointment.eventTypeId) || null
    if (matchedAdvertisement) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG][AppointmentReport] matched advertisement by eventTypeId fallback', {
        appointmentId: appointment.id,
        eventTypeId: appointment.eventTypeId,
        matchedAdvertisementTitle: matchedAdvertisement?.estate?.title,
      })
    }
  }

  if (!matchedAdvertisement) {
    const titleWords = normalizeTextForMatch(estateTitle).split(' ').filter(Boolean)
    const fuzzyMatch = advertisements.find(ad => {
      const normalizedAdTitle = normalizeTextForMatch(ad?.estate?.title)
      if (!normalizedAdTitle) return false

      const adWords = new Set(normalizedAdTitle.split(' ').filter(Boolean))
      const sharedWords = titleWords.filter(word => adWords.has(word))
      return sharedWords.length >= Math.max(1, titleWords.length - 1)
    }) || null

    if (fuzzyMatch) {
      matchedAdvertisement = fuzzyMatch
      // eslint-disable-next-line no-console
      console.log('[DEBUG][AppointmentReport] matched advertisement by fuzzy word fallback', {
        appointmentId: appointment.id,
        estateTitle,
        matchedAdvertisementTitle: matchedAdvertisement?.estate?.title,
      })
    }
  }

  const rawEstateTypeKey = matchedAdvertisement?.estate?.type?.key || appointment.estateTypeKey || null
  const normalizedEstateType = getEstateTypeByKey(rawEstateTypeKey) || getEstateTypeByApiValue(rawEstateTypeKey)
  const estateTypeKey = normalizedEstateType?.key || rawEstateTypeKey
  const estateTypeFriendlyName = matchedAdvertisement?.estate?.type?.friendlyName || normalizedEstateType?.friendlyName || appointment.estateTypeFriendlyName || 'Não informado'
  const estateId = eventType?.estateId || appointment.estate?.id || null

  if (!matchedAdvertisement || estateTypeFriendlyName === 'Não informado') {
    // eslint-disable-next-line no-console
    console.log('[DEBUG][AppointmentReport] mapping appointment to schedule item', {
      appointmentId: appointment.id,
      bookingUid: appointment.bookingUid,
      eventTypeId: appointment.eventTypeId,
      eventTypeTitle: eventType?.title,
      estateTitle,
      rawEstateTypeKey,
      estateTypeKey,
      normalizedEstateType,
      estateTypeFriendlyName,
      matchedAdvertisementTitle: matchedAdvertisement?.estate?.title,
      matchedAdvertisementTypeKey: matchedAdvertisement?.estate?.type?.key,
      matchedAdvertisementTypeFriendlyName: matchedAdvertisement?.estate?.type?.friendlyName,
      appointmentEstateTypeKey: appointment.estateTypeKey,
      appointmentEstateTypeFriendlyName: appointment.estateTypeFriendlyName,
      advertisementMapHasKey: advertisementMapByTitle.has(normalizeTextForMatch(estateTitle)),
    })
  }

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
  const [advertisementList, setAdvertisementList] = useState([])
  const [advertisementMapByTitle, setAdvertisementMapByTitle] = useState(() => new Map())
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

      // Log da consulta de agendamento/eventType antes do fetch
      // O filtro principal vem do escopo do relatório e do mês/dia selecionado.
      // Esse log deve mostrar se estamos consultando pelo mesmo período e corretor.
      // eslint-disable-next-line no-console
      console.log('[DEBUG][AppointmentReport] query start', {
        selectedDate,
        filters,
      })

      const [appointments, eventTypes] = await Promise.all([
        appointmentService.getAllAppointments({ size: 100, ...filters }),
        getAllEventTypes({ size: 100 }),
      ])

      // eslint-disable-next-line no-console
      console.log('[DEBUG][AppointmentReport] fetched base data', {
        appointmentsCount: Array.isArray(appointments) ? appointments.length : 0,
        appointmentIds: Array.isArray(appointments) ? appointments.map(a => a.id).slice(0, 30) : [],
        eventTypesCount: Array.isArray(eventTypes) ? eventTypes.length : 0,
        eventTypeIds: Array.isArray(eventTypes) ? eventTypes.map(t => t.id).slice(0, 50) : [],
      })

      const eventTypeMap = new Map(eventTypes.map(eventType => [eventType.id, eventType]))
      const advertisements = await getAllAdvertisements()

      // eslint-disable-next-line no-console
      console.log('[DEBUG][AppointmentReport] fetched advertisements', {
        advertisementCount: Array.isArray(advertisements) ? advertisements.length : 0,
        advertisementTitles: Array.isArray(advertisements)
          ? advertisements
            .map(ad => ad?.estate?.title)
            .filter(Boolean)
            .slice(0, 40)
          : [],
      })

      const matchedAdvertisementMap = createAdvertisementMapByTitle(advertisements)

      // eslint-disable-next-line no-console
      console.log('[DEBUG][AppointmentReport] advertisement map keys', {
        keyCount: matchedAdvertisementMap.size,
        sampleKeys: Array.from(matchedAdvertisementMap.keys()).slice(0, 40),
      })

      const mappedAppointments = appointments.map(appointment =>
        mapAppointmentToScheduleItem(
          appointment,
          eventTypeMap,
          advertisements,
          matchedAdvertisementMap
        )
      )

      // eslint-disable-next-line no-console
      console.log('[AppointmentReport] mappedAppointments:', mappedAppointments)

      setEventTypesById(eventTypeMap)
      setAdvertisementList(advertisements)
      setAdvertisementMapByTitle(matchedAdvertisementMap)
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
    const mapped = mapAppointmentToScheduleItem(
      updatedAppointment,
      eventTypesById,
      advertisementList,
      advertisementMapByTitle
    )
    model.replaceById(updatedAppointment.id, mapped)
    refreshDerivedData(selectedDate)
    return mapped
  }, [model, eventTypesById, advertisementList, advertisementMapByTitle, refreshDerivedData])

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
