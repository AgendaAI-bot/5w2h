import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'
import { useToast } from '../hooks/useToast'
import { ProjetoCard } from '../components/projetos/ProjetoCard'
import { ProjetoModal } from '../components/projetos/ProjetoModal'
import { Toast } from '../components/ui/Toast'
import { Spinner } from '../components/ui/Spinner'
import { Button } from '../components/ui/Button'
import { getProjetos, createProjeto, createMeta, getComosByProjeto, getMetas } from '../services/projetoService'
import { canManage } from '../utils/calcUtils'

export function ProjetosPage({ onOpenProjeto }) {
  const { token, profile } = useAuth()
  const { empresas } = useApp()
  const projetoModal = useModal()
  const { toast, showToast } = useToast()
  const [projetos, setProjetos] = useState([])
  const [projetoData, setProjetoData] = useState({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProjetos(token)
      setProjetos(data)
      const enriched = {}
      await Promise.all(data.map(async p => {
        const [comos, metas] = await Promise.all([
          getComosByProjeto(p.id, token),
          getMetas(p.id, token),
        ])
        enriched[p.id] = { comos, metas }
      }))
      setProjetoData(enriched)
    } catch (e) {
      showToast('Erro ao carregar projetos')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  async function handleSave({ nome, descricao, empresa_id, status, data_inicio, data_fim, cor, metas }) {
    const proj = await createProjeto({
      grupo_id: profile.grupo_id, empresa_id, nome, descricao, cor, status, data_inicio, data_fim,
      criado_por: profile.id,
    }, token)
    for (const m of metas) {
      await createMeta({ projeto_id: proj.id, grupo_id: profile.grupo_id, ...m, valor_atual: 0 }, token)
    }
    showToast('Projeto criado!', true)
    await load()
  }

  if (loading) return <main><Spinner /></main>

  return (
    <main>
      <div className="section-hdr">
        <span className="section-title">Projetos</span>
        {canManage(profile?.role) && (
          <Button variant="outline" size="md" onClick={projetoModal.open}>+ Novo projeto</Button>
        )}
      </div>

      {projetos.length === 0
        ? <div className="empty">Nenhum projeto ainda.</div>
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {projetos.map(p => (
              <ProjetoCard
                key={p.id}
                projeto={p}
                comos={projetoData[p.id]?.comos || []}
                metas={projetoData[p.id]?.metas || []}
                onClick={() => onOpenProjeto(p.id)}
              />
            ))}
          </div>
        )
      }

      <ProjetoModal
        isOpen={projetoModal.isOpen}
        onClose={projetoModal.close}
        empresas={empresas}
        onSave={handleSave}
      />

      <Toast {...toast} />
    </main>
  )
}
