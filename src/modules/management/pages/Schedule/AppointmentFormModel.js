/**
 * AppointmentFormModel.js
 * Lógica de negócio para agendamento de visitas
 */

export class AppointmentFormModel {
  #selectedEstate
  #startDateTime
  #durationMinutes
  #visitorName
  #visitorEmail
  #visitorPhone
  #status
  #notes
  #reason

  constructor({
    selectedEstate = null,
    startDateTime = new Date(),
    durationMinutes = 30,
    visitorName = '',
    visitorEmail = '',
    visitorPhone = '',
    status = 'PENDING',
    notes = '',
    reason = '',
  } = {}) {
    this.#selectedEstate = selectedEstate
    this.#startDateTime = startDateTime
    this.#durationMinutes = durationMinutes
    this.#visitorName = visitorName
    this.#visitorEmail = visitorEmail
    this.#visitorPhone = visitorPhone
    this.#status = status
    this.#notes = notes
    this.#reason = reason
  }

  static fromAppointment(appointment = {}) {
    return new AppointmentFormModel({
      selectedEstate: appointment.estate || null,
      startDateTime: appointment.startDateTime ? new Date(appointment.startDateTime) : new Date(),
      durationMinutes: appointment.durationMinutes || 30,
      visitorName: appointment.attendeeName || '',
      visitorEmail: appointment.attendeeEmail || '',
      visitorPhone: '',
      status: appointment.status || 'PENDING',
      notes: appointment.notes || '',
      reason: appointment.reason || '',
    })
  }

  get selectedEstate() {
    return this.#selectedEstate
  }

  set selectedEstate(value) {
    this.#selectedEstate = value
  }

  get startDateTime() {
    return this.#startDateTime
  }

  set startDateTime(value) {
    this.#startDateTime = value
  }

  get durationMinutes() {
    return this.#durationMinutes
  }

  set durationMinutes(value) {
    this.#durationMinutes = value
  }

  get visitorName() {
    return this.#visitorName
  }

  set visitorName(value) {
    this.#visitorName = value
  }

  get visitorEmail() {
    return this.#visitorEmail
  }

  set visitorEmail(value) {
    this.#visitorEmail = value
  }

  get visitorPhone() {
    return this.#visitorPhone
  }

  set visitorPhone(value) {
    this.#visitorPhone = value
  }

  get status() {
    return this.#status
  }

  set status(value) {
    this.#status = value
  }

  get notes() {
    return this.#notes
  }

  set notes(value) {
    this.#notes = value
  }

  get reason() {
    return this.#reason
  }

  set reason(value) {
    this.#reason = value
  }

  /**
   * Retorna a hora final do agendamento
   */
  getEndDateTime() {
    const end = new Date(this.#startDateTime)
    end.setMinutes(end.getMinutes() + this.#durationMinutes)
    return end
  }

  /**
   * Formata a hora de início
   */
  getFormattedStartTime() {
    const hours = String(this.#startDateTime.getHours()).padStart(2, '0')
    const minutes = String(this.#startDateTime.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  /**
   * Formata a hora final
   */
  getFormattedEndTime() {
    const end = this.getEndDateTime()
    const hours = String(end.getHours()).padStart(2, '0')
    const minutes = String(end.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }

  /**
   * Valida se o formulário está preenchido corretamente
   */
  isValid() {
    return (
      this.#selectedEstate?.id &&
      this.#startDateTime &&
      this.#durationMinutes > 0 &&
      this.#visitorName.trim().length > 0 &&
      this.#visitorEmail.trim().length > 0 &&
      this.#visitorPhone.trim().length > 0
    )
  }

  /**
   * Retorna os erros de validação
   */
  getValidationErrors({ isRescheduleMode = false } = {}) {
    const errors = []

    if (!isRescheduleMode && !this.#selectedEstate?.id) {
      errors.push('Selecione um imóvel')
    }

    if (!this.#startDateTime) {
      errors.push('Selecione a data e hora')
    }

    // ✅ Validar se a data é no passado
    if (this.#startDateTime) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const startDate = new Date(this.#startDateTime)
      startDate.setHours(0, 0, 0, 0)
      
      if (startDate < today) {
        errors.push('Não é possível agendar em datas passadas')
      }
    }

    if (this.#durationMinutes <= 0) {
      errors.push('A duração deve ser maior que 0 minutos')
    }

    if (!isRescheduleMode && this.#visitorName.trim().length === 0) {
      errors.push('Digite o nome do visitante')
    }

    if (!isRescheduleMode && this.#visitorEmail.trim().length === 0) {
      errors.push('Digite o email do visitante')
    } else if (!isRescheduleMode && !this.isValidEmail(this.#visitorEmail)) {
      errors.push('Email inválido')
    }

    if (!isRescheduleMode && this.#visitorPhone.trim().length === 0) {
      errors.push('Digite o telefone do visitante')
    }

    if (isRescheduleMode && this.#reason.trim().length === 0) {
      errors.push('Informe o motivo do reagendamento')
    }

    return errors
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Retorna os dados formatados para enviar à API
   * @param {object} ids - IDs obrigatórios para criação
   * @param {number|string} ids.clientId - ID do cliente
   * @param {number|string} ids.eventTypeId - ID do tipo de evento
   * @param {number|string} ids.estateAgentId - ID do corretor responsável
   */
  toRequestPayload({ clientId, eventTypeId, estateAgentId }) {
    const endDateTime = new Date(this.#startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + this.#durationMinutes)

    // Converter para número se necessário
    const normalizedClientId = clientId ? Number(clientId) : null
    const eventId = Number(eventTypeId)
    const agentId = Number(estateAgentId)

    if (!normalizedClientId) {
      throw new Error('clientId (userId) é obrigatório para criar um agendamento')
    }

    if (!eventId) {
      throw new Error('eventTypeId é obrigatório para criar um agendamento')
    }

    if (!agentId) {
      throw new Error('estateAgentId é obrigatório para criar um agendamento')
    }

    const phoneLine = this.#visitorPhone?.trim()
      ? `\nTelefone: ${this.#visitorPhone.trim()}`
      : ''
    const baseNotes = this.#notes?.trim() || ''
    const notes = `${baseNotes}${phoneLine}`.trim()

    const formatAsLocalIso = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    }

    return {
      clientId: normalizedClientId,
      estateAgentId: agentId,
      eventTypeId: eventId,
      startDateTime: formatAsLocalIso(this.#startDateTime),
      endDateTime: formatAsLocalIso(endDateTime),
      attendeeName: this.#visitorName.trim(),
      attendeeEmail: this.#visitorEmail.trim(),
      notes,
    }
  }

  toReschedulePayload() {
    const endDateTime = new Date(this.#startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + this.#durationMinutes)

    const formatAsLocalIso = (date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    }

    return {
      startDateTime: formatAsLocalIso(this.#startDateTime),
      endDateTime: formatAsLocalIso(endDateTime),
      reason: this.#reason.trim() || 'Reagendado pelo gestor no painel de agenda',
    }
  }

  /**
   * Verifica se o horário está em conflito com um agendamento existente
   */
  hasTimeConflictWith(otherAppointment) {
    if (this.#selectedEstate?.id !== otherAppointment.estateId) {
      return false
    }

    const thisStart = this.#startDateTime.getTime()
    const thisEnd = this.getEndDateTime().getTime()
    const otherStart = new Date(otherAppointment.startDateTime).getTime()
    const otherEnd = new Date(otherAppointment.endDateTime).getTime()

    // Verifica sobrecarga de datas
    return !(thisEnd <= otherStart || thisStart >= otherEnd)
  }

  /**
   * Retorna a hora inicial como string para input datetime-local
   */
  getDateTimeLocalString() {
    const year = this.#startDateTime.getFullYear()
    const month = String(this.#startDateTime.getMonth() + 1).padStart(2, '0')
    const day = String(this.#startDateTime.getDate()).padStart(2, '0')
    const hours = String(this.#startDateTime.getHours()).padStart(2, '0')
    const minutes = String(this.#startDateTime.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }
}
