export const authSessionUtil = {
  save({ token, userId, email, isAdmin }) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userId', String(userId))
    sessionStorage.setItem('userEmail', email)
    sessionStorage.setItem('userRole', isAdmin ? 'ADMINISTRADOR' : 'CLIENTE')
    sessionStorage.setItem('hadToken', 'true')
  },

  clear() {
    const keys = ['token', 'userId', 'userEmail',
      'userRole', 'hadToken']
    keys.forEach(k => sessionStorage.removeItem(k))
  },

  get() {
    return {
      token:  sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      email:  sessionStorage.getItem('userEmail'),
      role:   sessionStorage.getItem('userRole'),
      hadToken: sessionStorage.getItem('hadToken') === 'true'
    }
  }
}