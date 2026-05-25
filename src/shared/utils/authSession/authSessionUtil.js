import { ACCESS_LEVEL, isAdminAccessLevel } from '@constant/accessLevels'

export const authSessionUtil = {
  save({ token, userId, email, isAdmin, accessLevel }) {
    const role = isAdmin !== undefined
      ? (isAdmin ? ACCESS_LEVEL.ADMINISTRADOR : ACCESS_LEVEL.CLIENTE)
      : (isAdminAccessLevel(accessLevel) ? ACCESS_LEVEL.ADMINISTRADOR : ACCESS_LEVEL.CLIENTE)

    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userId', String(userId))
    sessionStorage.setItem('userEmail', email)
    sessionStorage.setItem('userRole', role)
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
  },

  savePostLoginRedirect(location) {
    try {
      sessionStorage.setItem('postLoginRedirect', JSON.stringify(location))
    } catch {
    // falha silenciosa — não é crítico
    }
  },

  getPostLoginRedirect() {
    try {
      const raw = sessionStorage.getItem('postLoginRedirect')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  clearPostLoginRedirect() {
    sessionStorage.removeItem('postLoginRedirect')
  },

}
