import { getEstateTypeByApiValue, getEstateTypeByKey } from '@constant/estateTypes'

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
    return this.#appointments.filter(appointment => {
      const appointmentDate = appointment.startDateTime instanceof Date
        ? appointment.startDateTime
        : new Date(appointment.startDateTime)

      if (this.#startDate && appointmentDate < this.#startDate) return false
      if (this.#endDate && appointmentDate > this.#endDate) return false
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
    return parseFloat(((confirmed / appointments.length) * 100).toFixed(2))
  }

  /**
   * Calcula taxa de conclusão
   * (agendamentos concluídos / total de agendamentos)
   */
  getCompletionRate() {
    const appointments = this.appointments
    if (appointments.length === 0) return 0
    const concluded = appointments.filter(a => a.status === 'CONCLUDED').length
    return parseFloat(((concluded / appointments.length) * 100).toFixed(2))
  }

  /**
   * Calcula taxa de cancelamento
   * (agendamentos cancelados / total de agendados)
   */
  getCancellationRate() {
    const appointments = this.appointments
    if (appointments.length === 0) return 0
    const cancelled = appointments.filter(a => a.status === 'CANCELLED').length
    return parseFloat(((cancelled / appointments.length) * 100).toFixed(2))
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
      if (Object.prototype.hasOwnProperty.call(distribution, appointment.status)) {
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
    if (appointments.length === 0) return []

    const estateMap = new Map()

    appointments.forEach(appointment => {
      const estateTitle = appointment.estateTitle || appointment.title || 'Sem informação'
      const key = appointment.estateTypeKey || 'Desconhecido'
      const normalizedKey = typeof key === 'string' ? key.toUpperCase() : key

      if (!estateMap.has(estateTitle)) {
        estateMap.set(estateTitle, { estate: estateTitle, count: 0, typeKey: normalizedKey })
      }
      estateMap.get(estateTitle).count += 1
    })

    return Array.from(estateMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  /**
   * Retorna contagem de agendamentos por tipo de imóvel
   */
  getAppointmentsByEstateType() {
    const appointments = this.appointments
    if (appointments.length === 0) return []

    const typeMap = new Map()

    appointments.forEach(appointment => {
      const rawKey = appointment.estateTypeKey || 'Desconhecido'
      const key = typeof rawKey === 'string' ? rawKey.toUpperCase() : rawKey
      const normalizedType = getEstateTypeByKey(key) || getEstateTypeByApiValue(key)
      const typeKey = normalizedType?.key || key

      const typeLabel = normalizedType?.friendlyName
        || appointment.estateTypeFriendlyName
        || key
        || 'Desconhecido'

      if (!typeMap.has(typeLabel)) {
        typeMap.set(typeLabel, { type: typeLabel, count: 0, typeKey })
      }
      typeMap.get(typeLabel).count += 1
    })

    return Array.from(typeMap.values())
      .sort((a, b) => b.count - a.count)
  }

  /**
   * Retorna distribuição de agendamentos por dia da semana.
   * Retorna [] quando não há appointments — evita renderizar gráfico vazio.
   * Retorna apenas os dias que têm ao menos 1 agendamento.
   */
  getAppointmentsByWeekDay() {
    const appointments = this.appointments
    if (appointments.length === 0) return []

    const WEEKDAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    const weekDayMap = new Map()

    appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.startDateTime)
      if (Number.isNaN(appointmentDate.getTime())) return
      const dayOfWeek = appointmentDate.getDay()
      weekDayMap.set(dayOfWeek, (weekDayMap.get(dayOfWeek) || 0) + 1)
    })

    // Só inclui dias com ao menos 1 agendamento, ordenados Dom→Sab
    return Array.from({ length: 7 }, (_, index) => {
      const count = weekDayMap.get(index) || 0
      return count > 0 ? { day: WEEKDAY_NAMES[index], count } : null
    }).filter(Boolean)
  }

  /**
   * Retorna série de dados por período (data, contagem)
   */
  getTimeSeriesData() {
    const appointments = this.appointments
    if (appointments.length === 0) return []

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
    if (appointments.length === 0) return []

    const timeSeriesMap = new Map()

    appointments.forEach(appointment => {
      const key = this.#getDateKeyByPeriod(appointment.startDateTime)
      const status = appointment.status || 'DESCONHECIDO'

      if (!timeSeriesMap.has(key)) {
        timeSeriesMap.set(key, { PENDING: 0, CONFIRMED: 0, CONCLUDED: 0, CANCELLED: 0 })
      }

      const data = timeSeriesMap.get(key)
      if (Object.prototype.hasOwnProperty.call(data, status)) {
        data[status] += 1
      }
    })

    const sortedKeys = Array.from(timeSeriesMap.keys()).sort()
    return sortedKeys.map(key => ({
      period: this.#formatDateKeyByPeriod(key),
      ...timeSeriesMap.get(key),
    }))
  }

  /**
   * Retorna total de agendamentos
   */
  getTotalAppointments() {
    return this.appointments.length
  }

  getTotalPending() {
    return this.appointments.filter(a => a.status === 'PENDING').length
  }

  getTotalConfirmed() {
    return this.appointments.filter(a => a.status === 'CONFIRMED').length
  }

  getTotalConcluded() {
    return this.appointments.filter(a => a.status === 'CONCLUDED').length
  }

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

}

export default ReportModel
