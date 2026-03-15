/**
 * Representa um agendamento de visita a um imóvel.
 */
export class Appointment {
  // ===== PRIVATE FIELDS =====
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

  // ===== MÉTODOS DE NEGÓCIO =====

  /**
   * Verifica se o agendamento está ativo (não cancelado ou concluído).
   */
  isActive() {
    return this.#status === 'AGENDADO'
  }

  /**
   * Verifica se o agendamento tem integração com Cal.com.
   */
  hasCalBooking() {
    return Boolean(this.#calBookingId)
  }

  /**
   * Retorna um resumo do agendamento.
   */
  summary() {
    const clientName = this.#client?.name || 'Cliente não informado'
    const estateTitle = this.#estate?.title || 'Imóvel não informado'
    return `${clientName} - ${estateTitle} (${this.#startDateTime})`
  }

  /**
   * Converte para payload aceito pela API para reagendamento.
   */
  toReschedulePayload() {
    return {
      startDateTime: this.#startDateTime,
      endDateTime: this.#endDateTime,
      durationMinutes: this.#durationMinutes,
    }
  }

  /**
   * Converte dados recebidos da API para instância da entidade.
   */
  static fromApi(apiData) {
    return new Appointment({
      id: apiData.id,
      client: apiData.client ? {
        id: apiData.client.id,
        name: apiData.client.name,
      } : null,
      estateAgent: apiData.estateAgent ? {
        id: apiData.estateAgent.id,
        name: apiData.estateAgent.name,
      } : null,
      estate: apiData.estate ? {
        id: apiData.estate.id,
        title: apiData.estate.title,
      } : null,
      durationMinutes: apiData.durationMinutes,
      startDateTime: apiData.startDateTime,
      endDateTime: apiData.endDateTime,
      status: apiData.status,
      calBookingId: apiData.calBookingId,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
    })
  }
}
