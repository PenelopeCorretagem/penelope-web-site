import { useState, useEffect, useMemo } from 'react'
import { useRouter } from '@routes/useRouterViewModel'
import { authSessionUtil } from '@shared/utils/authSession/authSessionUtil'

export function useAuthSession() {
  const { navigateTo } = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(sessionStorage.getItem('token')))
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('userRole') === 'ADMINISTRADOR')
  const [authReady, setAuthReady] = useState(false)
  const [sessionExpiresAt, setSessionExpiresAt] = useState(() => {
    const stored = sessionStorage.getItem('sessionExpiresAt')
    return stored ? Number(stored) : null
  })
  const [nowTick, setNowTick] = useState(Date.now())

  const updateFromStorage = () => {
    const { token, userId, role, sessionExpiresAt } = authSessionUtil.get()
    setIsAuthenticated(!!token && !!userId)
    setIsAdmin(role === 'ADMINISTRADOR')
    setSessionExpiresAt(sessionExpiresAt)
  }

  useEffect(() => {
    updateFromStorage()
    setAuthReady(true)

    const onStorage = (e) => {
      if (['token', 'userRole', 'userId', 'sessionExpiresAt', 'hadToken'].includes(e.key)) updateFromStorage()
    }
    const onAuthChanged = () => updateFromStorage()

    window.addEventListener('storage', onStorage)
    window.addEventListener('authChanged', onAuthChanged)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('authChanged', onAuthChanged)
    }
  }, [])

  // contador em 1s
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remainingMs = useMemo(() => {
    if (!sessionExpiresAt) return null
    return Math.max(0, sessionExpiresAt - nowTick)
  }, [sessionExpiresAt, nowTick])

  const expired = remainingMs !== null && remainingMs <= 0 && isAuthenticated

  useEffect(() => {
    if (!sessionExpiresAt || remainingMs === null) return
    if (remainingMs > 0) return

    const timeout = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('authTransition', {
        detail: { type: 'logout', message: 'Encerrando sua sessão...' }
      }))

      authSessionUtil.clear()
      window.dispatchEvent(new CustomEvent('authChanged'))
      navigateTo('/login')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [remainingMs, sessionExpiresAt, navigateTo])

  const remainingFormatted = useMemo(() => {
    if (remainingMs === null) return null
    const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [remainingMs])

  return {
    isAuthenticated,
    isAdmin,
    authReady,
    remainingMs,
    remainingFormatted,
    expired,
  }
}
