/**
 * Appointment.js
 * DTO + Model de domínio para agendamentos.
 * Sem dependências externas. Sem lógica de mapeamento de API.
 */
export class Appointment {
  #id
  #client
  #estateAgent
  #estate
  #eventType
  #durationMinutes
  #startDateTime
  #endDateTime
  #status
  #calBookingId
  #createdAt
  #updatedAt
  #eventTypeId
  #bookingUid
  #attendeeName
  #attendeeEmail
  #notes
  #reason

  constructor({
    id,
    client,
    estateAgent,
    estate,
    eventType,
    eventTypeId,
    durationMinutes,
    startDateTime,
    endDateTime,
    status,
    calBookingId,
    bookingUid,
    attendeeName,
    attendeeEmail,
    notes,
    reason,
    createdAt,
    updatedAt,
  }) {
    this.#id = id ?? null
    this.#client = client ?? null
    this.#estateAgent = estateAgent ?? null
    this.#estate = estate ?? null
    this.#eventType = eventType ?? null
    this.#eventTypeId = eventTypeId ?? null
    this.#durationMinutes = durationMinutes ?? 60
    this.#startDateTime = startDateTime ?? null
    this.#endDateTime = endDateTime ?? null
    this.#status = status ?? 'AGENDADO'
    this.#calBookingId = calBookingId ?? null
    this.#bookingUid = bookingUid ?? null
    this.#attendeeName = attendeeName ?? ''
    this.#attendeeEmail = attendeeEmail ?? ''
    this.#notes = notes ?? ''
    this.#reason = reason ?? ''
    this.#createdAt = createdAt ?? new Date().toISOString()
    this.#updatedAt = updatedAt ?? new Date().toISOString()
  }

  // ===== GETTERS =====
  get id() { return this.#id }
  get client() { return this.#client }
  get estateAgent() { return this.#estateAgent }
  get estate() { return this.#estate }
  get eventType() { return this.#eventType }
  get durationMinutes() { return this.#durationMinutes }
  get startDateTime() { return this.#startDateTime }
  get endDateTime() { return this.#endDateTime }
  get status() { return this.#status }
  get calBookingId() { return this.#calBookingId }
  get bookingUid() { return this.#bookingUid }
  get clientId() { return this.#client?.id ?? null }
  get estateAgentId() { return this.#estateAgent?.id ?? null }
  get attendeeName() { return this.#attendeeName }
  get attendeeEmail() { return this.#attendeeEmail }
  get notes() { return this.#notes }
  get reason() { return this.#reason }
  get createdAt() { return this.#createdAt }
  get updatedAt() { return this.#updatedAt }
  get eventTypeId() { return this.#eventTypeId }

  // ===== GETTERS DERIVADOS DO BACKEND ENRIQUECIDO =====
  get estateTitle() { return this.#estate?.title ?? 'Não informado' }
  get estateTypeKey() { return this.#estate?.type?.key ?? null }
  get estateTypeFriendlyName() { return this.#estate?.type?.friendlyName ?? 'Não informado' }
  get eventTypeTitle() { return this.#eventType?.title ?? 'Agendamento' }

  // ===== SETTERS =====
  set durationMinutes(v) { this.#durationMinutes = v }
  set startDateTime(v) { this.#startDateTime = v }
  set endDateTime(v) { this.#endDateTime = v }
  set status(v) { this.#status = v }
  set calBookingId(v) { this.#calBookingId = v }
  set updatedAt(v) { this.#updatedAt = v }

  // ===== LÓGICA DE DOMÍNIO =====
  // Regras sobre o próprio estado do objeto pertencem aqui.

  isActive() {
    return this.#status === 'AGENDADO'
  }

  hasCalBooking() {
    return Boolean(this.#calBookingId)
  }

  // ===== PAYLOADS PARA A API =====
  // O DTO conhece sua própria estrutura, então ele monta os payloads.
  // O Service apenas chama esses métodos — sem conhecer os campos internos.

  toReschedulePayload() {
    return {
      startDateTime: this.#startDateTime,
      endDateTime: this.#endDateTime,
      durationMinutes: this.#durationMinutes,
    }
  }

  toCreatePayload() {
    return {
      clientId: this.#client?.id ?? null,
      estateAgentId: this.#estateAgent?.id ?? null,
      estateId: this.#estate?.id ?? null,
      eventTypeId: this.#eventTypeId ?? null,
      startDateTime: this.#startDateTime,
      endDateTime: this.#endDateTime,
      durationMinutes: this.#durationMinutes,
    }
  }
}
