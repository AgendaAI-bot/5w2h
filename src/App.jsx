import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { LoginPage } from './pages/LoginPage'
import { PlanejadorPage } from './pages/PlanejadorPage'
import { ProjetosPage } from './pages/ProjetosPage'
import { ProjetoDetalhePage } from './pages/ProjetoDetalhePage'
import { EquipePage } from './pages/EquipePage'
import { ConfigPage } from './pages/ConfigPage'
import { Header } from './components/layout/Header'
import { EmpresaBar } from './components/layout/EmpresaBar'
import { UserFilterBar } from './components/layout/UserFilterBar'
import { NavTabs } from './components/layout/NavTabs'
import { EmpresaModal } from './components/config/EmpresaModal'
import { Toast } from './components/ui/Toast'
import { useModal } from './hooks/useModal'
import { useToast } from './hooks/useToast'
import { useWeek } from './hooks/useWeek'
import { createEmpresa } from './services/empresaService'
import { useApp } from './context/AppContext'

// Inner shell — rendered only when authenticated
function AppShell() {
  const { profile, token } = useAuth()
  const { refreshEmpresas } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { dates, label, prev, next } = useWeek()
  const empresaModal = useModal()
  const { toast, showToast } = useToast()
  const [projetoDetalheId, setProjetoDetalheId] = useState(null)
  const [weekStats, setWeekStats] = useState({ total: 0, pct: 0 })

  const activeTab = location.pathname.replace('/', '') || 'planejador'

  function handleTabChange(tab) {
    setProjetoDetalheId(null)
    navigate('/' + tab)
  }

  async function handleSaveEmpresa({ nome, cor }) {
    await createEmpresa({ grupo_id: profile.grupo_id, nome, cor }, token)
    await refreshEmpresas()
    showToast('Empresa criada!', true)
  }

  return (
    <>
      <Header
        weekLabel={label}
        onPrev={prev}
        onNext={next}
        totalTasks={weekStats.total}
        donePct={weekStats.pct}
      />
      <EmpresaBar onAddEmpresa={empresaModal.open} />
      {activeTab === 'planejador' && <UserFilterBar />}
      <NavTabs active={activeTab} onChange={handleTabChange} />

      <Routes>
        <Route
          path="/planejador"
          element={
            <PlanejadorPage
              dates={dates}
              onStatsChange={setWeekStats}
            />
          }
        />
        <Route
          path="/projetos"
          element={
            projetoDetalheId
              ? <ProjetoDetalhePage projetoId={projetoDetalheId} onBack={() => setProjetoDetalheId(null)} />
              : <ProjetosPage onOpenProjeto={setProjetoDetalheId} />
          }
        />
        <Route path="/equipe" element={<EquipePage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="*" element={<Navigate to="/planejador" replace />} />
      </Routes>

      <EmpresaModal
        isOpen={empresaModal.isOpen}
        onClose={empresaModal.close}
        onSave={handleSaveEmpresa}
      />
      <Toast {...toast} />
    </>
  )
}

// Root app — handles auth routing
export function App() {
  const { token, profile, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  const isAuthenticated = !!(token && profile)

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/planejador" replace />
            : (
              <AppProvider>
                <LoginPage />
              </AppProvider>
            )
        }
      />
      <Route
        path="/*"
        element={
          !isAuthenticated
            ? <Navigate to="/login" replace />
            : (
              <AppProvider>
                <AppShell />
              </AppProvider>
            )
        }
      />
    </Routes>
  )
}
