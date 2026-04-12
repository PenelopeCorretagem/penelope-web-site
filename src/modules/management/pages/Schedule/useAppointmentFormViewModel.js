/**
 * useAppointmentFormViewModel.js
 * ViewModel do formulário de agendamento
 */

import { useState, useCallback, useEffect } from 'react'
import { AppointmentFormModel } from './AppointmentFormModel'
import { getAllAdvertisements } from '@app/api/penelopec/realEstateAdvertisementAPI'
import { createAppointment } from '@app/api/calservice/appointmentCalApi'

export function useAppointmentFormViewModel(initialDate, initialHour, allAppointments = []) {
  const [model, setModel] = useState(() => {
    const date = new Date(initialDate)
    date.setHours(initialHour, 0, 0, 0)
    return new AppointmentFormModel({ startDateTime: date })
  })

  // ✅ Atualiza quando data/hora clicada mudam
  useEffect(() => {
    const date = new Date(initialDate)
    date.setHours(initialHour, 0, 0, 0)
    setModel(new AppointmentFormModel({ startDateTime: date }))
  }, [initialDate, initialHour])

  const [estates, setEstates] = useState([])
  const [loadingEstates, setLoadingEstates] = useState(false)
  const [estatesError, setEstatesError] = useState(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])

  // Carrega imóveis ativos ao montar
  useEffect(() => {
    const loadEstates = async () => {
      setLoadingEstates(true)
      setEstatesError(null)
      try {
        console.log('🔄 [SCHEDULE] Carregando imóveis ativos...')
        const data = await getAllAdvertisements({ active: true })
        
        const estatesArray = Array.isArray(data) ? data : (data.content || data.data || data.advertisements || [])
        setEstates(estatesArray)
        console.log('✨ [SCHEDULE] Imóveis carregados:', estatesArray.length)
      } catch (error) {
        console.error('❌ [SCHEDULE] Erro ao carregar imóveis:', error)
        console.error('📍 [SCHEDULE] Erro message:', error.message)
        console.error('📍 [SCHEDULE] Erro stack:', error.stack)
        setEstatesError('Erro ao carregar imóveis disponíveis')
      } finally {
        setLoadingEstates(false)
      }
    }

    loadEstates()
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
      }

      return updated
    })
    setValidationErrors([])
  }, [])

  const validate = useCallback(() => {
    const errors = model.getValidationErrors()
    setValidationErrors(errors)

    // Verifica conflitos de horário
    const hasConflict = allAppointments.some(appt =>
      model.hasTimeConflictWith(appt)
    )

    if (hasConflict) {
      errors.push('Este horário entra em conflito com outro agendamento do mesmo imóvel')
      setValidationErrors(errors)
      return false
    }

    return errors.length === 0
  }, [model, allAppointments])

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return false
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Obter userId do sessionStorage
      const userId = sessionStorage.getItem('userId')
      if (!userId) {
        throw new Error('Usuário não autenticado. Faça login para agendar.')
      }

      // TODO: Obter eventTypeId e estateAgentId da seleção do usuário ou contexto
      const payload = model.toRequestPayload(userId, 1, 1)
      await createAppointment(payload)
      return true
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      setSubmitError(error.message || 'Erro ao criar agendamento')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [model, validate])

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
      if (appt.estateId !== model.selectedEstate.id) {
        return false
      }

      const apptStart = new Date(appt.startDateTime).getTime()
      const apptEnd = new Date(appt.endDateTime).getTime()

      return !(testEndTime <= apptStart || testStartTime >= apptEnd)
    })
  }, [model.selectedEstate, model.startDateTime, model.durationMinutes, allAppointments])

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
    updateField,
    validate,
    handleSubmit,
    getEstateImageUrl,
    getEstateTitle,
    getAvailableHours,
    getAvailableTime,
  }
}
