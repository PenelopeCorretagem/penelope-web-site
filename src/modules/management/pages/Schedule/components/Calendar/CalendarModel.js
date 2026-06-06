/**
 * CalendarModel.js
 * Modelo de negócio para calendário de agendamentos
 * Lógica pura de cálculo de datas, períodos e navegação
 */

export class CalendarModel {
  #viewMode = 'month' // 'day', 'week', 'month'
  #selectedDate = new Date()
  #appointments = []

  constructor(appointments = [], selectedDate = new Date(), viewMode = 'month') {
    this.#appointments = Array.isArray(appointments) ? appointments : []
    this.#selectedDate = selectedDate instanceof Date ? new Date(selectedDate) : new Date()
    this.#viewMode = viewMode
  }

  get viewMode() {
    return this.#viewMode
  }

  get selectedDate() {
    return new Date(this.#selectedDate)
  }

  get appointments() {
    return [...this.#appointments]
  }

  setViewMode(mode) {
    if (['day', 'week', 'month'].includes(mode)) {
      this.#viewMode = mode
    }
  }

  setSelectedDate(date) {
    if (date instanceof Date) {
      this.#selectedDate = new Date(date)
    }
  }

  setAppointments(appointments = []) {
    this.#appointments = Array.isArray(appointments) ? appointments : []
  }

  /**
   * Verifica se uma data é no passado (ignora horas)
   */
  static isPastDate(date) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }

  /**
   * Verifica se duas datas são o mesmo dia
   */
  static isSameDay(date1, date2) {
    if (!date1 || !date2) return false
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  /**
   * Retorna os rótulos de navegação baseado no modo de visualização
   */
  static getPeriodNavigationLabels(viewMode) {
    switch (viewMode) {
      case 'day':
        return { prev: 'Dia Anterior', next: 'Próximo Dia' }
      case 'week':
        return { prev: 'Semana Anterior', next: 'Próxima Semana' }
      case 'month':
        return { prev: 'Mês Anterior', next: 'Próximo Mês' }
      default:
        return { prev: 'Anterior', next: 'Próximo' }
    }
  }

  /**
   * Retorna os rótulos dos dias da semana em português
   */
  static getWeekdayLabels() {
    return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  }

  /**
   * Retorna os rótulos dos meses em português
   */
  static getMonthLabels() {
    return [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]
  }

  /**
   * Retorna o nome do mês e ano atual (ex: "Maio 2024")
   */
  getCurrentMonthName() {
    const monthLabels = CalendarModel.getMonthLabels()
    return `${monthLabels[this.#selectedDate.getMonth()]} ${this.#selectedDate.getFullYear()}`
  }

  /**
   * Retorna o array de datas da semana (segunda a domingo)
   */
  getWeekDates() {
    const date = new Date(this.#selectedDate)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajusta para segunda-feira
    const startDate = new Date(date.setDate(diff))

    return Array.from({ length: 7 }, (_, i) => {
      const weekDate = new Date(startDate)
      weekDate.setDate(startDate.getDate() + i)
      return weekDate
    })
  }

  /**
   * Retorna array de datas do mês inteiro (com dias vazios no início/fim)
   */
  getMonthDays() {
    const year = this.#selectedDate.getFullYear()
    const month = this.#selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    let currentDate = new Date(startDate)

    while (currentDate <= lastDay || currentDate.getDay() !== 0) {
      days.push(currentDate.getDate() === 1 && currentDate.getMonth() !== month ? null : currentDate.getDate())
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  /**
   * Retorna as horas de funcionamento (0-23)
   */
  static getBusinessHours() {
    return Array.from({ length: 24 }, (_, i) => i)
  }

  /**
   * Retorna agendamentos de um dia específico
   */
  getAppointmentsForDay(date) {
    const targetDate = new Date(date)
    targetDate.setHours(0, 0, 0, 0)

    return this.#appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startDateTime)
      appointmentDate.setHours(0, 0, 0, 0)
      return appointmentDate.getTime() === targetDate.getTime()
    })
  }

  /**
   * Retorna agendamentos por status para um dia
   */
  getAppointmentsByStatusForDay(date) {
    const dayAppointments = this.getAppointmentsForDay(date)
    const statusMap = {
      PENDING: [],
      CONFIRMED: [],
      CONCLUDED: [],
      CANCELLED: [],
    }

    dayAppointments.forEach(appointment => {
      if (statusMap.hasOwnProperty(appointment.status)) {
        statusMap[appointment.status].push(appointment)
      }
    })

    return statusMap
  }

  /**
   * Retorna contagem de agendamentos por data (para mini-calendário)
   */
  getAppointmentCountByDate() {
    const countMap = {}

    this.#appointments.forEach(appointment => {
      const dateKey = new Date(appointment.startDateTime).toISOString().split('T')[0]
      countMap[dateKey] = (countMap[dateKey] || 0) + 1
    })

    return countMap
  }

  /**
   * Retorna distribuição de status para o mês inteiro
   */
  getMonthlyAppointmentsByStatus() {
    const statusMap = {
      PENDING: 0,
      CONFIRMED: 0,
      CONCLUDED: 0,
      CANCELLED: 0,
    }

    const year = this.#selectedDate.getFullYear()
    const month = this.#selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    this.#appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.startDateTime)
      if (appointmentDate >= firstDay && appointmentDate <= lastDay) {
        if (statusMap.hasOwnProperty(appointment.status)) {
          statusMap[appointment.status] += 1
        }
      }
    })

    return statusMap
  }

  /**
   * Navega para próximo/anterior período
   */
  navigatePeriod(direction) {
    const newDate = new Date(this.#selectedDate)

    switch (this.#viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + direction)
        break
      case 'week':
        newDate.setDate(newDate.getDate() + direction * 7)
        break
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction)
        break
      default:
        break
    }

    this.#selectedDate = newDate
    return this.#selectedDate
  }

  /**
   * Vai para hoje
   */
  goToToday() {
    this.#selectedDate = new Date()
    return this.#selectedDate
  }
}

export default CalendarModel
