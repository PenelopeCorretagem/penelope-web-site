/**
 * AppointmentReportModel.js
 * Modelo de estado para o relatório de agendamentos.
 */
export class AppointmentReportModel {
  #activeSection = 'dashboard'

  get activeSection() {
    return this.#activeSection
  }

  setActiveSection(section) {
    const nextSection = ['dashboard', 'records'].includes(section) ? section : 'dashboard'
    if (this.#activeSection === nextSection) {
      return false
    }

    this.#activeSection = nextSection
    return true
  }
}
