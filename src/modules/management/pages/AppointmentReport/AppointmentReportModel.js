/**
 * AppointmentReportModel.js
 * Modelo de estado para o relatório de agendamentos.
 */
export class AppointmentReportModel {
  #activeSection = 'dashboard'
  #isAnnotating = false

  get activeSection() {
    return this.#activeSection
  }

  get isAnnotating() {
    return this.#isAnnotating
  }

  setActiveSection(section) {
    const nextSection = ['dashboard', 'records'].includes(section) ? section : 'dashboard'
    if (this.#activeSection === nextSection) return false
    this.#activeSection = nextSection
    return true
  }

  setAnnotating(value) {
    if (this.#isAnnotating === value) return false
    this.#isAnnotating = value
    return true
  }
}
