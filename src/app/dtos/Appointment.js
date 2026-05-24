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
  #durationMinutes
  #startDateTime
  #endDateTime
  #status
  #calBookingId
  #createdAt
  #updatedAt

  constructor({
    id,
    client,
    estateAgent,
    estate,
    durationMinutes,
    startDateTime,
    endDateTime,
    status,
    calBookingId,
    createdAt,
    updatedAt,
  }) {
    this.#id = id ?? null
    this.#client = client ?? null
    this.#estateAgent = estateAgent ?? null
    this.#estate = estate ?? null
    this.#durationMinutes = durationMinutes ?? 60
    this.#startDateTime = startDateTime ?? null
    this.#endDateTime = endDateTime ?? null
    this.#status = status ?? 'AGENDADO'
    this.#calBookingId = calBookingId ?? null
    this.#createdAt = createdAt ?? new Date().toISOString()
    this.#updatedAt = updatedAt ?? new Date().toISOString()
  }

  // ===== GETTERS =====
  get id() { return this.#id }
  get client() { return this.#client }
  get estateAgent() { return this.#estateAgent }
  get estate() { return this.#estate }
  get durationMinutes() { return this.#durationMinutes }
  get startDateTime() { return this.#startDateTime }
  get endDateTime() { return this.#endDateTime }
  get status() { return this.#status }
  get calBookingId() { return this.#calBookingId }
  get createdAt() { return this.#createdAt }
  get updatedAt() { return this.#updatedAt }

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
      startDateTime: this.#startDateTime,
      endDateTime: this.#endDateTime,
      durationMinutes: this.#durationMinutes,
    }
  }
}
