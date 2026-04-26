/**
 * AppointmentCal.js
 * DTO que representa um agendamento completo do cal-service
 * Usado para gerenciar appointmet criados via cal-service.
 */

export class AppointmentCal {
  #id
  #bookingUid
  #eventTypeId
  #clientId
  #estateAgentId
  #estateId
  #durationMinutes
  #status
  #startDateTime
  #endDateTime
  #attendeeName
  #attendeeEmail
  #notes
  #reason
  #createdAt
  #updatedAt

  constructor({
    id = null,
    bookingUid = null,
    eventTypeId = null,
    clientId = null,
    estateAgentId = null,
    estateId = null,
    durationMinutes = 60,
    status = 'PENDING',
    startDateTime = null,
    endDateTime = null,
    attendeeName = '',
    attendeeEmail = '',
    notes = '',
    reason = '',
    createdAt = null,
    updatedAt = null,
  }) {
    this.#id = id
    this.#bookingUid = bookingUid
    this.#eventTypeId = eventTypeId
    this.#clientId = clientId
    this.#estateAgentId = estateAgentId
    this.#estateId = estateId
    this.#durationMinutes = durationMinutes
    this.#status = status
    this.#startDateTime = startDateTime ? new Date(startDateTime) : null
    this.#endDateTime = endDateTime ? new Date(endDateTime) : null
    this.#attendeeName = attendeeName
    this.#attendeeEmail = attendeeEmail
    this.#notes = notes
    this.#reason = reason
    this.#createdAt = createdAt ? new Date(createdAt) : null
    this.#updatedAt = updatedAt ? new Date(updatedAt) : null
  }

  get id() { return this.#id }
  get bookingUid() { return this.#bookingUid }
  get eventTypeId() { return this.#eventTypeId }
  get clientId() { return this.#clientId }
  get estateAgentId() { return this.#estateAgentId }
  get estateId() { return this.#estateId }
  get durationMinutes() { return this.#durationMinutes }
  get status() { return this.#status }
  get startDateTime() { return this.#startDateTime }
  get endDateTime() { return this.#endDateTime }
  get attendeeName() { return this.#attendeeName }
  get attendeeEmail() { return this.#attendeeEmail }
  get notes() { return this.#notes }
  get reason() { return this.#reason }
  get createdAt() { return this.#createdAt }
  get updatedAt() { return this.#updatedAt }

  set status(v) { this.#status = v }

  /**
   * Verifica se o appointment está em estado terminal
   */
  isTerminal() {
    return this.#status === 'CANCELLED' || this.#status === 'CONCLUDED'
  }

  /**
   * Verifica se pode ser reagendado
   */
  canBeRescheduled() {
    return !this.isTerminal() && this.#status === 'PENDING'
  }

  /**
   * Converte para payload para reagendamento
   */
  toReschedulePayload() {
    return {
      startDateTime: this.#startDateTime,
      endDateTime: this.#endDateTime,
    }
  }

  /**
   * Converte para payload de criação
   */
  toCreatePayload() {
    return {
      eventTypeId: this.#eventTypeId,
      clientId: this.#clientId,
      estateAgentId: this.#estateAgentId,
      estateId: this.#estateId,
      startDateTime: this.#startDateTime,
      endDateTime: this.#endDateTime,
      attendeeName: this.#attendeeName,
      attendeeEmail: this.#attendeeEmail,
      notes: this.#notes,
    }
  }

  /**
   * Cria uma instância a partir dos dados da API
   */
  static fromApi(data) {
    if (!data) return null
    return new AppointmentCal({
      id: data.id,
      bookingUid: data.bookingUid,
      eventTypeId: data.eventTypeId,
      clientId: data.clientId,
      estateAgentId: data.estateAgentId,
      estateId: data.estateId,
      durationMinutes: data.durationMinutes,
      status: data.status,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      attendeeName: data.attendeeName,
      attendeeEmail: data.attendeeEmail,
      notes: data.notes,
      reason: data.reason,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }

  /**
   * Resumo do agendamento
   */
  summary() {
    return {
      id: this.#id,
      bookingUid: this.#bookingUid,
      startTime: this.#startDateTime?.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: this.#status,
    }
  }
}
