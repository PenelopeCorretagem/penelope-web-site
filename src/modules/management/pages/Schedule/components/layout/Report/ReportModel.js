/**
 * ReportModel.js
 * Modelo de negócio para relatórios de agendamentos
 * Calcula KPIs e agrega dados para visualização
 */

export const PERIOD_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
}

export const PERIOD_LABELS = {
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
}

export class ReportModel {
  #appointments = []
  #periodType = PERIOD_TYPES.MONTHLY
  #startDate = null
  #endDate = null

  constructor(appointments = [], periodType = PERIOD_TYPES.MONTHLY, startDate = null, endDate = null) {
    this.#appointments = Array.isArray(appointments) ? appointments : []
    this.#periodType = periodType || PERIOD_TYPES.MONTHLY
    this.#startDate = startDate
    this.#endDate = endDate
  }

  get appointments() {
    return this.#getFilteredAppointments()
  }

  get periodType() {
    return this.#periodType
  }

  setAppointments(appointments = []) {
    this.#appointments = Array.isArray(appointments) ? appointments : []
  }

  setPeriodType(periodType) {
    if (Object.values(PERIOD_TYPES).includes(periodType)) {
      this.#periodType = periodType
    }
  }

  setDateRange(startDate, endDate) {
    this.#startDate = startDate
    this.#endDate = endDate
  }

  /**
   * Retorna agendamentos filtrados por data (se definidas)
   * @private
   */
  #getFilteredAppointments() {
    if (!this.#startDate && !this.#endDate) {
      return [...this.#appointments]
    }

    return this.#appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startDateTime)

      if (this.#startDate) {
        const start = new Date(this.#startDate)
        start.setHours(0, 0, 0, 0)
        if (appointmentDate < start) return false
      }

      if (this.#endDate) {
        const end = new Date(this.#endDate)
        end.setHours(23, 59, 59, 999)
        if (appointmentDate > end) return false
      }

      return true
    })
  }

  /**
   * Calcula taxa de confirmação
   * (agendamentos confirmados / total de agendados)
   */
  getConfirmationRate() {
    const appointments = this.appointments
    if (appointments.length === 0) return 0
    const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length
    return Math.round((confirmed / appointments.length) * 100)
  }

  /**
   * Calcula taxa de conclusão
   * (agendamentos concluídos / total de confirmados)
   */
  getCompletionRate() {
    const appointments = this.appointments
    const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length
    if (confirmed === 0) return 0
    const concluded = appointments.filter(a => a.status === 'CONCLUDED').length
    return Math.round((concluded / confirmed) * 100)
  }

  /**
   * Calcula taxa de cancelamento
   * (agendamentos cancelados / total de agendados)
   */
  getCancellationRate() {
    const appointments = this.appointments
    if (appointments.length === 0) return 0
    const cancelled = appointments.filter(a => a.status === 'CANCELLED').length
    return Math.round((cancelled / appointments.length) * 100)
  }

  /**
   * Retorna distribuição de status
   */
  getStatusDistribution() {
    const appointments = this.appointments
    const distribution = {
      PENDING: 0,
      CONFIRMED: 0,
      CONCLUDED: 0,
      CANCELLED: 0,
    }

    appointments.forEach(appointment => {
      if (distribution.hasOwnProperty(appointment.status)) {
        distribution[appointment.status] += 1
      }
    })

    return distribution
  }

  /**
   * Retorna contagem de agendamentos por imóvel
   */
  getAppointmentsByEstate() {
    const appointments = this.appointments
    const estateMap = new Map()

    appointments.forEach(appointment => {
      const estateTitle = appointment.estateTitle || 'Sem informação'
      estateMap.set(estateTitle, (estateMap.get(estateTitle) || 0) + 1)
    })

    return Array.from(estateMap.entries())
      .map(([estate, count]) => ({ estate, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 imóveis
  }

  /**
   * Retorna contagem de agendamentos por tipo de imóvel
   */
  getAppointmentsByEstateType() {
    const appointments = this.appointments
    const typeMap = new Map()

    appointments.forEach(appointment => {
      const typeKey = appointment.estateTypeKey || 'DESCONHECIDO'
      const typeLabel = this.#getEstateTypeLabel(typeKey)
      typeMap.set(typeLabel, (typeMap.get(typeLabel) || 0) + 1)
    })

    return Array.from(typeMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
  }

  /**
   * Retorna distribuição de agendamentos por dia da semana
   */
  getAppointmentsByWeekDay() {
    const appointments = this.appointments
    const WEEKDAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const weekDayMap = new Map()

    appointments.forEach(appointment => {
      const dayOfWeek = appointment.startDateTime.getDay()
      const dayName = WEEKDAY_NAMES[dayOfWeek]
      weekDayMap.set(dayOfWeek, (weekDayMap.get(dayOfWeek) || 0) + 1)
    })

    return Array.from({ length: 7 }, (_, index) => ({
      day: WEEKDAY_NAMES[index],
      count: weekDayMap.get(index) || 0,
    }))
  }

  /**
   * Retorna série de dados por período (data, contagem)
   */
  getTimeSeriesData() {
    const appointments = this.appointments
    const timeSeriesMap = new Map()

    appointments.forEach(appointment => {
      const key = this.#getDateKeyByPeriod(appointment.startDateTime)
      timeSeriesMap.set(key, (timeSeriesMap.get(key) || 0) + 1)
    })

    const sortedKeys = Array.from(timeSeriesMap.keys()).sort()
    return sortedKeys.map(key => ({
      period: this.#formatDateKeyByPeriod(key),
      count: timeSeriesMap.get(key),
    }))
  }

  /**
   * Retorna série de dados por período com divisão por status
   */
  getTimeSeriesDataByStatus() {
    const appointments = this.appointments
    const timeSeriesMap = new Map()

    appointments.forEach(appointment => {
      const key = this.#getDateKeyByPeriod(appointment.startDateTime)
      const status = appointment.status || 'DESCONHECIDO'

      if (!timeSeriesMap.has(key)) {
        timeSeriesMap.set(key, { PENDING: 0, CONFIRMED: 0, CONCLUDED: 0, CANCELLED: 0 })
      }

      const data = timeSeriesMap.get(key)
      if (data.hasOwnProperty(status)) {
        data[status] += 1
      }
    })

    const sortedKeys = Array.from(timeSeriesMap.keys()).sort()
    return sortedKeys.map(key => {
      const statusData = timeSeriesMap.get(key)
      return {
        period: this.#formatDateKeyByPeriod(key),
        ...statusData,
      }
    })
  }

  /**
   * Retorna total de agendamentos
   */
  getTotalAppointments() {
    return this.appointments.length
  }

  /**
   * Retorna total de agendados (status PENDING)
   */
  getTotalPending() {
    return this.appointments.filter(a => a.status === 'PENDING').length
  }

  /**
   * Retorna total de confirmados
   */
  getTotalConfirmed() {
    return this.appointments.filter(a => a.status === 'CONFIRMED').length
  }

  /**
   * Retorna total de concluídos
   */
  getTotalConcluded() {
    return this.appointments.filter(a => a.status === 'CONCLUDED').length
  }

  /**
   * Retorna total de cancelados
   */
  getTotalCancelled() {
    return this.appointments.filter(a => a.status === 'CANCELLED').length
  }

  /**
   * Gera chave de data baseada no período
   * @private
   */
  #getDateKeyByPeriod(date) {
    const d = new Date(date)

    switch (this.#periodType) {
      case PERIOD_TYPES.DAILY:
        return d.toISOString().split('T')[0]

      case PERIOD_TYPES.WEEKLY: {
        const week = Math.ceil((d.getDate() - d.getDay()) / 7)
        const month = String(d.getMonth() + 1).padStart(2, '0')
        return `${d.getFullYear()}-W${String(week).padStart(2, '0')}-M${month}`
      }

      case PERIOD_TYPES.MONTHLY:
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

      case PERIOD_TYPES.YEARLY:
        return String(d.getFullYear())

      default:
        return d.toISOString().split('T')[0]
    }
  }

  /**
   * Formata chave de data para exibição
   * @private
   */
  #formatDateKeyByPeriod(key) {
    switch (this.#periodType) {
      case PERIOD_TYPES.DAILY: {
        const [year, month, day] = key.split('-')
        return `${day}/${month}/${year}`
      }

      case PERIOD_TYPES.WEEKLY: {
        const parts = key.split('-')
        const week = parts[1].replace('W', '')
        const month = parts[2].replace('M', '')
        return `Sem. ${week}/${month}/${parts[0]}`
      }

      case PERIOD_TYPES.MONTHLY: {
        const [year, month] = key.split('-')
        const date = new Date(year, parseInt(month) - 1)
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      }

      case PERIOD_TYPES.YEARLY:
        return key

      default:
        return key
    }
  }

  /**
   * Retorna label legível para tipo de imóvel
   * @private
   */
  #getEstateTypeLabel(typeKey) {
    const labels = {
      APARTAMENTO: 'Apartamento',
      CASA: 'Casa',
      TERRENO: 'Terreno',
      COMERCIAL: 'Comercial',
      SALA: 'Sala',
      GARAGEM: 'Garagem',
      CHACARA: 'Chácara',
      SITIO: 'Sítio',
      LOJA: 'Loja',
    }
    return labels[typeKey] || typeKey
  }
}

export default ReportModel
