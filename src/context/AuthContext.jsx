import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as loginService, logout as logoutService, getAuthUser, getProfile } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sb_token'))
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (t, u) => {
    const p = await getProfile(u.id, t)
    setProfile(p)
    return p
  }, [])

  useEffect(() => {
    if (!token) { setLoading(false); return }
    getAuthUser(token)
      .then(async u => {
        if (!u?.id) throw new Error('invalid')
        setUser(u)
        await loadProfile(token, u)
      })
      .catch(() => {
        localStorage.removeItem('sb_token')
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  const login = async (email, password) => {
    const data = await loginService(email, password)
    localStorage.setItem('sb_token', data.access_token)
    setToken(data.access_token)
    setUser(data.user)
    const p = await loadProfile(data.access_token, data.user)
    return p
  }

  const logout = async () => {
    await logoutService(token)
    localStorage.removeItem('sb_token')
    setToken(null)
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
