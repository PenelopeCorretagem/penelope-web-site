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

  constructor({
    selectedEstate = null,
    startDateTime = new Date(),
    durationMinutes = 30,
    visitorName = '',
    visitorEmail = '',
    visitorPhone = '',
    status = 'PENDING',
    notes = '',
  } = {}) {
    this.#selectedEstate = selectedEstate
    this.#startDateTime = startDateTime
    this.#durationMinutes = durationMinutes
    this.#visitorName = visitorName
    this.#visitorEmail = visitorEmail
    this.#visitorPhone = visitorPhone
    this.#status = status
    this.#notes = notes
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
  getValidationErrors() {
    const errors = []

    if (!this.#selectedEstate?.id) {
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

    if (this.#visitorName.trim().length === 0) {
      errors.push('Digite o nome do visitante')
    }

    if (this.#visitorEmail.trim().length === 0) {
      errors.push('Digite o email do visitante')
    } else if (!this.isValidEmail(this.#visitorEmail)) {
      errors.push('Email inválido')
    }

    if (this.#visitorPhone.trim().length === 0) {
      errors.push('Digite o telefone do visitante')
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
   * @param {number|string} userId - ID do usuário logado (para clientId)
   * @param {number|string} eventTypeId - ID do tipo de evento (padrão: 1)
   * @param {number|string} estateAgentId - ID do agente de estate (padrão: 1)
   */
  toRequestPayload(userId = null, eventTypeId = 1, estateAgentId = 1) {
    const endDateTime = new Date(this.#startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + this.#durationMinutes)

    // Converter para número se necessário
    const clientId = userId ? Number(userId) : null
    const eventId = Number(eventTypeId)
    const agentId = Number(estateAgentId)

    if (!clientId) {
      throw new Error('clientId (userId) é obrigatório para criar um agendamento')
    }

    return {
      estateId: this.#selectedEstate?.id,
      clientId,                                    // ✅ Agora é um número
      startDateTime: this.#startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),      // ✅ Campo obrigatório
      durationMinutes: this.#durationMinutes,
      visitorName: this.#visitorName.trim(),
      visitorEmail: this.#visitorEmail.trim(),
      visitorPhone: this.#visitorPhone.trim(),
      eventTypeId: eventId,                        // ✅ Agora é um número
      estateAgentId: agentId,                      // ✅ Agora é um número
      status: this.#status,
      notes: this.#notes.trim(),
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
