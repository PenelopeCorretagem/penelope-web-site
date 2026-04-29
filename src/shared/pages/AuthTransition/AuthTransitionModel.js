/**
 * AuthTransitionModel - Modelo de dados para transição de autenticação
 *
 * RESPONSABILIDADES:
 * - Manter estado da transição
 * - Gerenciar configurações (duração, mensagens)
 * - Notificar observadores
 * - Singleton pattern
 */
export class AuthTransitionModel {
  static instance = null

  constructor() {
    if (AuthTransitionModel.instance) {
      return AuthTransitionModel.instance
    }

    this.isTransitioning = false
    this.status = 'verifying' // 'login' | 'logout' | 'verifying'
    this.message = ''
    this.transitionDuration = 2000 // ms
    this.observers = []

    AuthTransitionModel.instance = this
  }

  static getInstance() {
    if (!AuthTransitionModel.instance) {
      AuthTransitionModel.instance = new AuthTransitionModel()
    }
    return AuthTransitionModel.instance
  }

  /**
   * Inicia transição
   */
  startTransition(status, message = '') {
    this.isTransitioning = true
    this.status = status
    this.message = message
    this.notifyObservers()
  }

  /**
   * Finaliza transição
   */
  endTransition() {
    this.isTransitioning = false
    this.message = ''
    this.notifyObservers()
  }

  /**
   * Define duração da transição
   */
  setDuration(ms) {
    this.transitionDuration = ms
  }

  /**
   * Subscrever a mudanças
   */
  subscribe(observer) {
    this.observers.push(observer)
    return () => {
      this.observers = this.observers.filter(o => o !== observer)
    }
  }

  /**
   * Notificar observadores
   */
  notifyObservers() {
    this.observers.forEach(observer => observer(this.getState()))
  }

  /**
   * Obter estado atual
   */
  getState() {
    return {
      isTransitioning: this.isTransitioning,
      status: this.status,
      message: this.message,
      transitionDuration: this.transitionDuration,
    }
  }

  /**
   * Reset
   */
  reset() {
    this.isTransitioning = false
    this.status = 'verifying'
    this.message = ''
    this.notifyObservers()
  }
}
