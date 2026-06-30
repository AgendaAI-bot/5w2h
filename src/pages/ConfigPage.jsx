import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useModal } from '../hooks/useModal'
import { useToast } from '../hooks/useToast'
import { TiposModal } from '../components/config/TiposModal'
import { Toast } from '../components/ui/Toast'
import { createTipo, deleteTipo } from '../services/tipoService'

export function ConfigPage() {
  const { tipos, refreshTipos } = useApp()
  const { token, profile } = useAuth()
  const tiposModal = useModal()
  const { toast, showToast } = useToast()

  async function handleAddTipo({ nome, cor }) {
    await createTipo({ grupo_id: profile.grupo_id, nome, cor }, token)
    await refreshTipos()
    showToast('Tipo adicionado!', true)
  }

  async function handleDeleteTipo(id) {
    if (!confirm('Remover este tipo?')) return
    await deleteTipo(id, token)
    await refreshTipos()
    showToast('Removido', true)
  }

  return (
    <main>
      <div className="section-hdr">
        <span className="section-title">Configuracoes</span>
      </div>

      <div style={{ maxWidth: 400 }}>
        <div className="config-card" onClick={tiposModal.open}>
          <div className="config-card-title">Tipos de atividade</div>
          <div className="config-card-sub">
            Cadastre e gerencie os tipos (Reuniao, Atividade...)
            {tipos.length > 0 && ` — ${tipos.length} cadastrado${tipos.length > 1 ? 's' : ''}`}
          </div>
        </div>
      </div>

      <TiposModal
        isOpen={tiposModal.isOpen}
        onClose={tiposModal.close}
        tipos={tipos}
        onAdd={handleAddTipo}
        onDelete={handleDeleteTipo}
      />

      <Toast {...toast} />
    </main>
  )
}
