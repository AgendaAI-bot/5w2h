import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getEmpresas } from '../services/empresaService'
import { getUsuarios } from '../services/usuarioService'
import { getTipos } from '../services/tipoService'
import { getNotificacoes, marcarTodasLidas as marcarLidasService } from '../services/notificacaoService'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { token, user, profile } = useAuth()
  const [empresas, setEmpresas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [tipos, setTipos] = useState([])
  const [notificacoes, setNotificacoes] = useState([])
  const [selectedEmpresa, setSelectedEmpresa] = useState(null)
  const [filteredUsers, setFilteredUsers] = useState({})
  const [dataLoaded, setDataLoaded] = useState(false)

  const refreshEmpresas = useCallback(async () => {
    if (!token) return []
    const data = await getEmpresas(token)
    setEmpresas(data)
    return data
  }, [token])

  const refreshUsuarios = useCallback(async () => {
    if (!token) return []
    const data = await getUsuarios(token)
    setUsuarios(data)
    return data
  }, [token])

  const refreshTipos = useCallback(async () => {
    if (!token) return []
    const data = await getTipos(token)
    setTipos(data)
    return data
  }, [token])

  const refreshNotificacoes = useCallback(async () => {
    if (!user?.id || !token) return
    const data = await getNotificacoes(user.id, token)
    setNotificacoes(data)
    return data
  }, [token, user])

  // Auto-load shared data whenever we have an authenticated session
  // (covers both fresh login and page-reload auto-login flows)
  useEffect(() => {
    if (token && profile && !dataLoaded) {
      Promise.all([refreshEmpresas(), refreshUsuarios(), refreshTipos()])
        .then(() => setDataLoaded(true))
        .catch(() => {})
    }
    if (!token) setDataLoaded(false)
  }, [token, profile, dataLoaded, refreshEmpresas, refreshUsuarios, refreshTipos])

  const marcarTodasLidas = useCallback(async () => {
    if (!user?.id) return
    await marcarLidasService(user.id, token)
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }, [token, user])

  const toggleUserFilter = useCallback((userId) => {
    setFilteredUsers(prev => {
      const next = { ...prev }
      if (next[userId]) delete next[userId]
      else next[userId] = true
      return next
    })
  }, [])

  const clearUserFilter = useCallback(() => setFilteredUsers({}), [])

  return (
    <AppContext.Provider value={{
      empresas, setEmpresas, refreshEmpresas,
      usuarios, setUsuarios, refreshUsuarios,
      tipos, setTipos, refreshTipos,
      notificacoes, setNotificacoes, refreshNotificacoes, marcarTodasLidas,
      selectedEmpresa, setSelectedEmpresa,
      filteredUsers, toggleUserFilter, clearUserFilter,
      dataLoaded,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
