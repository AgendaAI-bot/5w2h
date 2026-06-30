import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useModal } from '../hooks/useModal'
import { useToast } from '../hooks/useToast'
import { TiposModal } from '../components/config/TiposModal'
import { EmpresasGerenciarModal } from '../components/config/EmpresasGerenciarModal'
import { Toast } from '../components/ui/Toast'
import { createTipo, deleteTipo } from '../services/tipoService'
import { updateEmpresa, deactivateEmpresa } from '../services/empresaService'
import { canAdmin } from '../utils/calcUtils'

export function ConfigPage() {
  const { tipos, refreshTipos, empresas, refreshEmpresas } = useApp()
  const { token, profile } = useAuth()
  const tiposModal = useModal()
  const empresasModal = useModal()
  const { toast, showToast } = useToast()

  const isAdmin = canAdmin(profile?.role)

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

  async function handleUpdateEmpresa(id, body) {
    await updateEmpresa(id, body, token)
    await refreshEmpresas()
    showToast('Empresa atualizada!', true)
  }

  async function handleDeactivateEmpresa(id) {
    await deactivateEmpresa(id, token)
    await refreshEmpresas()
    showToast('Empresa removida', true)
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

        <div className="config-card" onClick={empresasModal.open}>
          <div className="config-card-title">Empresas</div>
          <div className="config-card-sub">
            {isAdmin ? 'Edite ou remova empresas do grupo' : 'Visualize as empresas do grupo'}
            {empresas.length > 0 && ` — ${empresas.length} cadastrada${empresas.length > 1 ? 's' : ''}`}
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

      <EmpresasGerenciarModal
        isOpen={empresasModal.isOpen}
        onClose={empresasModal.close}
        empresas={empresas}
        onUpdate={handleUpdateEmpresa}
        onDeactivate={handleDeactivateEmpresa}
        isAdmin={isAdmin}
      />

      <Toast {...toast} />
    </main>
  )
}
