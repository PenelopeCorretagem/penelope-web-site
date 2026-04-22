export const authSessionUtil = {
  save({ token, userId, email, isAdmin, name }) {
    sessionStorage.setItem('jwtToken', token)
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('userId', String(userId))
    sessionStorage.setItem('userEmail', email)
    sessionStorage.setItem('userName', name || email)
    sessionStorage.setItem('userRole', isAdmin ? 'ADMINISTRADOR' : 'CLIENTE')
    sessionStorage.setItem('_hadToken', 'true')
  },

  clear() {
    const keys = ['jwtToken', 'token', 'userId', 'userEmail', 'userName',
                  'userRole', '_hadToken']
    keys.forEach(k => sessionStorage.removeItem(k))
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('userRole')
  },

  get() {
    return {
      token:  sessionStorage.getItem('jwtToken'),
      userId: sessionStorage.getItem('userId'),
      email:  sessionStorage.getItem('userEmail'),
      role:   sessionStorage.getItem('userRole'),
      name:   sessionStorage.getItem('userName'),
    }
  }
}