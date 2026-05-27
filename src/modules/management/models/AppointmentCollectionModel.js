export class AppointmentCollectionModel {
  constructor(appointments = []) {
    this.appointments = Array.isArray(appointments) ? appointments : []
  }

  getAll() {
    return this.appointments
  }

  getTotal() {
    return this.appointments.length
  }

  getByDate(date) {
    const target = date instanceof Date ? date : new Date(date)
    const key = target.toISOString().split('T')[0]
    return this.appointments.filter(appointment => {
      const appointmentDate = appointment.startDateTime?.toISOString().split('T')[0]
      return appointmentDate === key
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
}
