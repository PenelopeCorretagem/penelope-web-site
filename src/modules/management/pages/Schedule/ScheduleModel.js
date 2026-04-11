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

  setAppointments(appointments = []) {
    this.appointments = Array.isArray(appointments) ? appointments : []
  }
}

export default ScheduleModel
