export const authSessionUtil = {
  save({ token, userId, email, isAdmin }) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userId', String(userId))
    sessionStorage.setItem('userEmail', email)
    sessionStorage.setItem('userRole', isAdmin ? 'ADMINISTRADOR' : 'CLIENTE')
    sessionStorage.setItem('hadToken', 'true')
    // Sessão expira em 1 hora e 30 minutos a partir do momento do login
    const expiresAt = Date.now() + (1.5 * 60 * 60 * 1000)
    sessionStorage.setItem('sessionExpiresAt', String(expiresAt))
  },

  clear() {
    const keys = ['token', 'userId', 'userEmail',
      'userRole', 'hadToken', 'sessionExpiresAt']
    keys.forEach(k => sessionStorage.removeItem(k))
  },

  get() {
    return {
      token:  sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      email:  sessionStorage.getItem('userEmail'),
      role:   sessionStorage.getItem('userRole'),
      hadToken: sessionStorage.getItem('hadToken') === 'true',
      sessionExpiresAt: sessionStorage.getItem('sessionExpiresAt') ? Number(sessionStorage.getItem('sessionExpiresAt')) : null
    }
  }
}
