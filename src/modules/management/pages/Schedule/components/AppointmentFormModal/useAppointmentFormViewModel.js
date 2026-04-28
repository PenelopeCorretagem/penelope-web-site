/**
 * useAppointmentFormViewModel.js
 * ViewModel do formulário de agendamento
 */

import { useState, useCallback, useEffect } from 'react'
import { AppointmentFormModel } from './AppointmentFormModel'
import { getAllAdvertisements } from '@api-penelopec/advertisementApi'
import { getUserById } from '@api-penelopec/userApi'
import { createAppointment, rescheduleAppointment } from '@service-calservice/appointmentCalService'
import { getAllEventTypes } from '@service-calservice/eventTypeService'
import { generateSlug } from '@shared/utils/sluggy/generateSlugUtil'

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
  mode = 'create',
  preselectedEstateReference = null
) {
  const isRescheduleMode = mode === 'reschedule'
  const isAdminUser = sessionStorage.getItem('userRole') === 'ADMINISTRADOR'

  const buildInitialModel = useCallback(() => {
    if (isRescheduleMode && appointmentToEdit) {
      return AppointmentFormModel.fromAppointment(appointmentToEdit)
    }

    const date = new Date(initialDate)
    date.setHours(initialHour, 0, 0, 0)
    return new AppointmentFormModel({ startDateTime: date })
  }, [appointmentToEdit, initialDate, initialHour, isRescheduleMode])

  const [model, setModel] = useState(() => buildInitialModel())
  const [estates, setEstates] = useState([])
  const [loadingEstates, setLoadingEstates] = useState(false)
  const [estatesError, setEstatesError] = useState(null)
  const [eventTypes, setEventTypes] = useState([])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])

  // Recria o formulário quando o slot muda e ao abrir o modal.
  useEffect(() => {
    if (!isOpen) return

    setModel(buildInitialModel())
    setValidationErrors([])
    setSubmitError(null)
  }, [buildInitialModel, isOpen])

  useEffect(() => {
    if (!isOpen || isRescheduleMode || !preselectedEstateReference) {
      return
    }

    if (!Array.isArray(estates) || estates.length === 0) {
      return
    }

    const targetEstateId = Number(preselectedEstateReference.preselectedEstateId)
    const targetEstateTitle = String(preselectedEstateReference.preselectedEstateTitle || '').trim()
    const targetEstateSlug = String(preselectedEstateReference.preselectedEstateSlug || '').trim()

    const matchedEstate = estates.find((estate) => {
      const estateId = Number(estate?.id ?? estate?.estate?.id)
      const estateTitle = String(estate?.estate?.title ?? estate?.title ?? '').trim()
      const estateSlug = generateSlug(estateTitle)

      return (targetEstateId && estateId === targetEstateId)
        || (targetEstateTitle && estateTitle === targetEstateTitle)
        || (targetEstateSlug && estateSlug === targetEstateSlug)
    })

    if (!matchedEstate) {
      return
    }

    setModel(prev => {
      if (prev.selectedEstate?.id === matchedEstate?.id || prev.selectedEstate?.estate?.id === matchedEstate?.estate?.id) {
        return prev
      }

      return new AppointmentFormModel({
        selectedEstate: matchedEstate,
        startDateTime: prev.startDateTime,
        durationMinutes: prev.durationMinutes,
        visitorName: prev.visitorName,
        visitorEmail: prev.visitorEmail,
        visitorPhone: prev.visitorPhone,
        status: prev.status,
        notes: prev.notes,
        reason: prev.reason,
      })
    })
  }, [estates, isOpen, isRescheduleMode, preselectedEstateReference])

  // Preenche automaticamente os dados do visitante para usuários não-admin.
  useEffect(() => {
    if (!isOpen || isRescheduleMode || isAdminUser) {
      return
    }

    const prefillVisitorData = async () => {
      const userId = sessionStorage.getItem('userId')
      const userEmailFromSession = sessionStorage.getItem('userEmail') || ''

      let visitorName = ''
      let visitorEmail = userEmailFromSession
      let visitorPhone = ''

      if (userId) {
        try {
          const user = await getUserById(userId)
          visitorName = user?.name || user?.nomeCompleto || ''
          visitorEmail = user?.email || userEmailFromSession
          visitorPhone = user?.phone || ''
        } catch {
          // Em caso de falha, mantém os dados disponíveis em sessão.
        }
      }

      setModel(prev => new AppointmentFormModel({
        selectedEstate: prev.selectedEstate,
        startDateTime: prev.startDateTime,
        durationMinutes: prev.durationMinutes,
        visitorName,
        visitorEmail,
        visitorPhone,
        status: prev.status,
        notes: prev.notes,
        reason: prev.reason,
      }))
    }

    prefillVisitorData()
  }, [isOpen, isRescheduleMode, isAdminUser])

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

    // Verifica conflitos de horário por corretor em agendamentos ativos.
    const selectedEstateAgentId = model.selectedEstate?.responsible?.id
    const targetEstateAgentId = isRescheduleMode
      ? appointmentToEdit?.estateAgentId
      : (selectedEstateAgentId ? Number(selectedEstateAgentId) : null)

    const isActiveAppointment = (status) => status === 'PENDING' || status === 'CONFIRMED'
    const nextStart = new Date(model.startDateTime).getTime()
    const nextEnd = nextStart + (60 * 60 * 1000)

    const hasConflict = targetEstateAgentId
      ? allAppointments.some(appt => {
        if (isRescheduleMode && appt.id === appointmentToEdit?.id) {
          return false
        }

        if (!isActiveAppointment(appt.status)) {
          return false
        }

        if (Number(appt.estateAgentId) !== Number(targetEstateAgentId)) {
          return false
        }

        const apptStart = new Date(appt.startDateTime).getTime()
        const apptEnd = new Date(appt.endDateTime).getTime()

        return !(nextEnd <= apptStart || nextStart >= apptEnd)
      })
      : false

    if (hasConflict) {
      errors.push('Este horário entra em conflito com outro agendamento ativo do corretor')
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

      const agentId = model.selectedEstate?.responsible?.id
      if (!agentId) {
        throw new Error('O imóvel selecionado não possui corretor responsável para este agendamento.')
      }

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
    const hours = Array.from({ length: 11 }, (_, i) => i + 9) // 09:00 - 19:00
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
