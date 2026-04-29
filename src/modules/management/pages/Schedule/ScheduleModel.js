export const STATUS_COLORS = {
  PENDING: 'bg-distac-primary text-default-light',
  CONFIRMED: 'bg-distac-secondary text-default-light',
  CONCLUDED: 'bg-distac-secondary-light text-default-light',
  CANCELLED: 'bg-default-dark-light text-default-light',
}

export const STATUS_LABELS = {
  PENDING: 'Agendado',
  CONFIRMED: 'Confirmado',
  CONCLUDED: 'Concluido',
  CANCELLED: 'Cancelado',
}

export const WEEKDAY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

export const DEFAULT_FILTERS = {
  statusFilter: 'TODOS',
  estateFilter: 'TODOS',
  estateTypeFilter: 'TODOS',
}

export class ScheduleModel {
  constructor(appointments = []) {
    // Já recebe entidades AppointmentCal do cal-service, não precisa de transformação
    this.appointments = Array.isArray(appointments) ? appointments : []
  }

  getAll() {
    return [...this.appointments]
  }

  getTotal() {
    return this.appointments.length
  }

  getByDate(date) {
    const target = date instanceof Date ? date : new Date(date)
    const key = target.toISOString().split('T')[0]
    return this.appointments.filter(a => {
      const apptDate = a.startDateTime?.toISOString().split('T')[0]
      return apptDate === key
    })
  }

  add(appointment) {
    this.appointments.push(appointment)
  }

  replaceById(appointmentId, updatedAppointment) {
    this.appointments = this.appointments.map(appointment =>
      appointment.id === appointmentId ? updatedAppointment : appointment
    )
  }

  removeById(appointmentId) {
    this.appointments = this.appointments.filter(appointment => appointment.id !== appointmentId)
  }

  setAppointments(appointments = []) {
    this.appointments = Array.isArray(appointments) ? appointments : []
  }

  static startOfDay(date) {
    const nextDate = new Date(date)
    nextDate.setHours(0, 0, 0, 0)
    return nextDate
  }

  static isSameDay(firstDate, secondDate) {
    return ScheduleModel.startOfDay(firstDate).getTime() === ScheduleModel.startOfDay(secondDate).getTime()
  }

  static isPastDate(date) {
    const today = ScheduleModel.startOfDay(new Date())
    const checkDate = ScheduleModel.startOfDay(date)
    return checkDate < today
  }

  static buildCalendarDays(date) {
    const selectedDate = new Date(date)
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()
    const monthStartOffset = (firstDayOfMonth.getDay() + 6) % 7

    const blanks = Array.from({ length: monthStartOffset }, () => null)
    const days = Array.from({ length: daysInMonth }, (_, index) => index + 1)
    return [...blanks, ...days]
  }

  static getWeekDates(date) {
    const currentDate = new Date(date)
    const day = currentDate.getDay()
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(currentDate.setDate(diff))

    return Array.from({ length: 7 }, (_, index) => {
      const weekDate = new Date(monday)
      weekDate.setDate(monday.getDate() + index)
      return weekDate
    })
  }

  static getPeriodNavigationLabels(viewMode) {
    if (viewMode === 'week') {
      return { previous: 'Semana anterior', next: 'Proxima semana' }
    }

    if (viewMode === 'day') {
      return { previous: 'Dia anterior', next: 'Proximo dia' }
    }

    return { previous: 'Mes anterior', next: 'Proximo mes' }
  }

  static getStatusOptions() {
    return ['TODOS', ...Object.keys(STATUS_LABELS)]
  }

  static getEstateTypeOptions(estateTypes) {
    return [{ key: 'TODOS', friendlyName: 'Todos os tipos' }, ...Object.values(estateTypes)]
  }

  static getEstateOptions(appointments = [], availableEstateOptions = []) {
    const optionsMap = new Map()

    const addEstateOption = (estateTitle) => {
      const normalizedTitle = typeof estateTitle === 'string' ? estateTitle.trim() : ''
      if (!normalizedTitle || normalizedTitle === 'Imovel nao informado') {
        return
      }

      optionsMap.set(normalizedTitle, normalizedTitle)
    }

    appointments.forEach(appointment => {
      addEstateOption(appointment.estateTitle)
    })

    availableEstateOptions.forEach(estate => {
      addEstateOption(estate.value)
    })

    return ['TODOS', ...Array.from(optionsMap.keys()).sort((first, second) => first.localeCompare(second, 'pt-BR'))]
  }

  static getFilteredAppointments(appointments = [], filters = DEFAULT_FILTERS) {
    return appointments.filter(appointment => {
      const matchesStatus = filters.statusFilter === 'TODOS' || appointment.status === filters.statusFilter
      const matchesEstate = filters.estateFilter === 'TODOS' || (appointment.estateTitle || 'Imovel nao informado') === filters.estateFilter
      const matchesEstateType = filters.estateTypeFilter === 'TODOS' || appointment.estateTypeKey === filters.estateTypeFilter

      return matchesStatus && matchesEstate && matchesEstateType
    })
  }

  static getAppointmentsCountByDate(appointments = []) {
    return appointments.reduce((acc, appointment) => {
      const key = appointment.startDateTime.toISOString().split('T')[0]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }

  static getSelectedDateAppointments(appointments = [], selectedDate) {
    return appointments
      .filter(appointment => ScheduleModel.isSameDay(appointment.startDateTime, selectedDate))
      .sort((first, second) => first.startDateTime.getTime() - second.startDateTime.getTime())
  }

  static getAppointmentsByStatus(appointments = []) {
    const statusMap = new Map()

    appointments.forEach(appointment => {
      const key = appointment.status || 'DESCONHECIDO'
      statusMap.set(key, (statusMap.get(key) || 0) + 1)
    })

    return Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((first, second) => second.count - first.count || first.status.localeCompare(second.status, 'pt-BR'))
  }

  static getMonthlyAppointmentsByStatus(appointments = [], selectedDate, selectedStatusFilter = 'TODOS') {
    const statusMap = new Map()

    appointments.forEach(appointment => {
      if (
        appointment.startDateTime.getMonth() !== selectedDate.getMonth() ||
        appointment.startDateTime.getFullYear() !== selectedDate.getFullYear()
      ) {
        return
      }

      const key = appointment.status || 'DESCONHECIDO'
      statusMap.set(key, (statusMap.get(key) || 0) + 1)
    })

    if (selectedStatusFilter === 'TODOS') {
      return Object.keys(STATUS_LABELS).map(status => ({
        status,
        count: statusMap.get(status) || 0,
      }))
    }

    return Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((first, second) => second.count - first.count || first.status.localeCompare(second.status, 'pt-BR'))
  }

  static getAppointmentsByDay(weekDates = [], appointments = []) {
    return weekDates.reduce((acc, date) => {
      const key = date.toISOString().split('T')[0]
      acc[key] = appointments.filter(appointment => {
        const appointmentDateKey = appointment.startDateTime.toISOString().split('T')[0]
        return appointmentDateKey === key
      })
      return acc
    }, {})
  }
}

export default ScheduleModel
