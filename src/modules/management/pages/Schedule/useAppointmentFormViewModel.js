/**
 * useAppointmentFormViewModel.js
 * ViewModel do formulário de agendamento
 */

import { useState, useCallback, useEffect } from 'react'
import { AppointmentFormModel } from './AppointmentFormModel'
import { getAllAdvertisements } from '@api-penelopec/advertisementApi'
import { createAppointment, rescheduleAppointment } from '@service-calservice/appointmentCalService'
import { getAllEventTypes } from '@service-calservice/eventTypeService'

const getApiErrorMessage = (error, fallbackMessage) => {
  const violations = error?.response?.data?.violations
  if (Array.isArray(violations) && violations.length > 0) {
    return violations.map(item => item.message).join(' | ')
  }

  return error?.response?.data?.message || error?.message || fallbackMessage
}

export function useAppointmentFormViewModel(
  initialDate,
  initialHour,
  allAppointments = [],
  isOpen = false,
  appointmentToEdit = null,
  mode = 'create'
) {
  const isRescheduleMode = mode === 'reschedule'

  const buildInitialModel = useCallback(() => {
    if (isRescheduleMode && appointmentToEdit) {
      return AppointmentFormModel.fromAppointment(appointmentToEdit)
    }

    const date = new Date(initialDate)
    date.setHours(initialHour, 0, 0, 0)
    return new AppointmentFormModel({ startDateTime: date })
  }, [appointmentToEdit, initialDate, initialHour, isRescheduleMode])

  const [model, setModel] = useState(() => buildInitialModel())

  // Recria o formulário quando o slot muda e ao abrir o modal.
  useEffect(() => {
    if (!isOpen) return

    setModel(buildInitialModel())
    setValidationErrors([])
    setSubmitError(null)
  }, [buildInitialModel, isOpen])

  const [estates, setEstates] = useState([])
  const [loadingEstates, setLoadingEstates] = useState(false)
  const [estatesError, setEstatesError] = useState(null)
  const [eventTypes, setEventTypes] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])

  // Carrega imóveis ativos e event types ao montar
  useEffect(() => {
    const loadData = async () => {
      setLoadingEstates(true)
      setEstatesError(null)

      try {
        const [estatesData, eventTypesData] = await Promise.all([
          getAllAdvertisements({ active: true }),
          getAllEventTypes({ size: 200 }),
        ])

        const estatesArray = Array.isArray(estatesData)
          ? estatesData
          : (estatesData.content || estatesData.data || estatesData.advertisements || [])
        const visibleEventTypes = eventTypesData.filter(eventType => !eventType.hidden)
        setEstates(estatesArray)
        setEventTypes(visibleEventTypes)
      } catch (error) {
        setEstatesError(getApiErrorMessage(error, 'Erro ao carregar imóveis disponíveis'))
      } finally {
        setLoadingEstates(false)
      }
    }

    loadData()
  }, [])

  const updateField = useCallback((fieldName, value) => {
    setModel(prev => {
      const updated = new AppointmentFormModel({
        selectedEstate: prev.selectedEstate,
        startDateTime: prev.startDateTime,
        durationMinutes: prev.durationMinutes,
        visitorName: prev.visitorName,
        visitorEmail: prev.visitorEmail,
        visitorPhone: prev.visitorPhone,
        status: prev.status,
        notes: prev.notes,
        reason: prev.reason,
      })

      if (fieldName === 'estate') {
        updated.selectedEstate = value
      } else if (fieldName === 'startDateTime') {
        updated.startDateTime = value
      } else if (fieldName === 'durationMinutes') {
        updated.durationMinutes = value
      } else if (fieldName === 'visitorName') {
        updated.visitorName = value
      } else if (fieldName === 'visitorEmail') {
        updated.visitorEmail = value
      } else if (fieldName === 'visitorPhone') {
        updated.visitorPhone = value
      } else if (fieldName === 'status') {
        updated.status = value
      } else if (fieldName === 'notes') {
        updated.notes = value
      } else if (fieldName === 'reason') {
        updated.reason = value
      }

      return updated
    })
    setValidationErrors([])
  }, [])

  const validate = useCallback(() => {
    const errors = [...model.getValidationErrors({ isRescheduleMode })]

    if (!isRescheduleMode) {
      const selectedEstateId = model.selectedEstate?.estate?.id
      const hasEventTypeForEstate = eventTypes.some(eventType => eventType.estateId === selectedEstateId)
      if (!hasEventTypeForEstate) {
        errors.push('Não existe tipo de evento ativo para este imóvel')
      }
    }

    setValidationErrors(errors)

    // Verifica conflitos de horário
    const hasConflict = allAppointments.some(appt => {
      if (isRescheduleMode && appt.id === appointmentToEdit?.id) {
        return false
      }

      return model.hasTimeConflictWith(appt)
    })

    if (hasConflict) {
      errors.push('Este horário entra em conflito com outro agendamento do mesmo imóvel')
      setValidationErrors(errors)
      return false
    }

    return errors.length === 0
  }, [model, allAppointments, eventTypes, appointmentToEdit, isRescheduleMode])

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return false
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (isRescheduleMode) {
        if (!appointmentToEdit?.id) {
          throw new Error('Agendamento inválido para reagendamento.')
        }

        await rescheduleAppointment(appointmentToEdit.id, model.toReschedulePayload())
        return true
      }

      // O usuário autenticado é utilizado para rastreabilidade de cliente/corretor.
      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não autenticado. Faça login para agendar.')
      }

      const selectedEstateId = model.selectedEstate?.estate?.id
      const eventType = eventTypes.find(item => item.estateId === selectedEstateId)
      if (!eventType) {
        throw new Error('Não foi encontrado tipo de evento ativo para o imóvel selecionado.')
      }

      const agentId = model.selectedEstate?.responsible?.id || userId
      const payload = model.toRequestPayload({
        clientId: userId,
        eventTypeId: eventType.id,
        estateAgentId: agentId,
      })

      await createAppointment(payload)
      return true
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, isRescheduleMode ? 'Erro ao reagendar agendamento' : 'Erro ao criar agendamento'))
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [appointmentToEdit, eventTypes, isRescheduleMode, model, validate])

  const getEstateImageUrl = useCallback((estate) => {
    if (!estate) return null

    // Procura pela imagem com type 'Capa' (cover)
    if (estate.images && Array.isArray(estate.images)) {
      // Primeira prioridade: Capa
      const capaImage = estate.images.find(img => img.type === 'Capa')
      if (capaImage?.url) {
        return capaImage.url
      }

      // Segunda prioridade: primeira imagem da galeria
      const galeriaImage = estate.images.find(img => img.type === 'Galeria')
      if (galeriaImage?.url) {
        return galeriaImage.url
      }

      // Terceira prioridade: qualquer imagem
      if (estate.images[0]?.url) {
        return estate.images[0].url
      }
    }

    return null
  }, [])

  const getEstateTitle = useCallback((estate) => {
    const title = estate?.title || 'Imóvel sem título'
    return title
  }, [])

  const getAvailableTime = useCallback((startHour) => {
    if (isRescheduleMode) {
      return true
    }

    // Verifica se o horário está disponível para o imóvel selecionado
    if (!model.selectedEstate) {
      return true
    }

    const testStart = new Date(model.startDateTime)
    testStart.setHours(startHour, 0, 0, 0)

    const testEnd = new Date(testStart)
    testEnd.setMinutes(testEnd.getMinutes() + model.durationMinutes)

    const testStartTime = testStart.getTime()
    const testEndTime = testEnd.getTime()

    return !allAppointments.some(appt => {
      if (appt.estateId !== model.selectedEstate?.estate?.id) {
        return false
      }

      const apptStart = new Date(appt.startDateTime).getTime()
      const apptEnd = new Date(appt.endDateTime).getTime()

      return !(testEndTime <= apptStart || testStartTime >= apptEnd)
    })
  }, [isRescheduleMode, model.selectedEstate, model.startDateTime, model.durationMinutes, allAppointments])

  const getAvailableHours = useCallback(() => {
    // Retorna um array de horas disponíveis para o dia selecionado
    const hours = Array.from({ length: 13 }, (_, i) => i + 7) // 07:00 - 19:00
    return hours.filter(hour => getAvailableTime(hour))
  }, [getAvailableTime])

  return {
    model,
    estates,
    loadingEstates,
    estatesError,
    isSubmitting,
    submitError,
    validationErrors,
    isRescheduleMode,
    appointmentToEdit,
    updateField,
    validate,
    handleSubmit,
    getEstateImageUrl,
    getEstateTitle,
    getAvailableHours,
    getAvailableTime,
  }
}
