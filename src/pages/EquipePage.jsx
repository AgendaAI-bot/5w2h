import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'
import { useToast } from '../hooks/useToast'
import { MembroRow } from '../components/equipe/MembroRow'
import { UsuarioModal } from '../components/equipe/UsuarioModal'
import { Toast } from '../components/ui/Toast'
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import { createUsuario } from '../services/usuarioService'
import { canManage } from '../utils/calcUtils'

export function EquipePage() {
  const { token, profile } = useAuth()
  const { usuarios, refreshUsuarios, empresas } = useApp()
  const usuarioModal = useModal()
  const { toast, showToast } = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    refreshUsuarios().finally(() => setLoading(false))
  }, [])

  async function handleSave(data) {
    await createUsuario({ ...data, grupo_id: profile.grupo_id }, token)
    await refreshUsuarios()
    showToast('Usuario criado!', true)
  }

  if (loading) return <main><Spinner /></main>

  return (
    <main>
      <div className="section-hdr">
        <span className="section-title">Equipe</span>
        {canManage(profile?.role) && (
          <Button variant="outline" size="md" onClick={usuarioModal.open}>+ Novo usuario</Button>
        )}
      </div>

      {usuarios.length === 0
        ? <div className="empty">Nenhum membro ainda.</div>
        : usuarios.map((m, idx) => <MembroRow key={m.id} membro={m} index={idx} />)
      }

      <UsuarioModal
        isOpen={usuarioModal.isOpen}
        onClose={usuarioModal.close}
        empresas={empresas}
        onSave={handleSave}
      />

      <Toast {...toast} />
    </main>
  )
}
