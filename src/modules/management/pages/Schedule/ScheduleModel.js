export class AppointmentModel {
  constructor({ id, date, time, title, client }) {
    this.id = id
    // date expected to be ISO string or Date
    this.date = typeof date === 'string' ? new Date(date) : date
    this.time = time
    this.title = title
    this.client = client
  }

  getDateString() {
    return this.date.toISOString().split('T')[0]
  }
}

export class ScheduleModel {
  constructor(appointments = []) {
    // garante instâncias de AppointmentModel
    this.appointments = appointments.map(a => new AppointmentModel(a))
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
    return this.appointments.filter(a => a.getDateString() === key)
  }

  add(appointment) {
    const appt = new AppointmentModel(appointment)
    this.appointments.push(appt)
  }

  setAppointments(appointments = []) {
    this.appointments = appointments.map(a => new AppointmentModel(a))
  }
}

export default ScheduleModel
