import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { useModal } from '../hooks/useModal'
import { useToast } from '../hooks/useToast'
import { PqBlock } from '../components/projeto-detalhe/PqBlock'
import { ComoPanel } from '../components/projeto-detalhe/ComoPanel'
import { Toast } from '../components/ui/Toast'
import { Spinner } from '../components/ui/Spinner'
import { ProgressBar } from '../components/ui/ProgressBar'
import { MetaItem } from '../components/projetos/MetaItem'
import { EmpresaBadge } from '../components/ui/Badge'
import {
  getProjetos, getPqs, getOqs, getComos, getMetas,
  createPq, createOq, createComo, updateComo, deleteComo as deleteComoService,
} from '../services/projetoService'
import { syncComoToCalendar } from '../services/tarefaService'
import { calcPct, countAtrasadas, canManage } from '../utils/calcUtils'
import { todayStr } from '../utils/dateUtils'

export function ProjetoDetalhePage({ projetoId, onBack }) {
  const { token, user, profile } = useAuth()
  const { usuarios } = useApp()
  const { toast, showToast } = useToast()
  const panelModal = useModal()

  const [projeto, setProjeto] = useState(null)
  const [pqs, setPqs] = useState([])
  const [oqs, setOqs] = useState([])
  const [comos, setComos] = useState([])
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedComo, setSelectedComo] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [projetosData, pqsData, metasData] = await Promise.all([
        getProjetos(token),
        getPqs(projetoId, token),
        getMetas(projetoId, token),
      ])
      const proj = projetosData.find(p => p.id === projetoId)
      setProjeto(proj)
      setPqs(pqsData)
      setMetas(metasData)

      if (pqsData.length) {
        const oqsData = await getOqs(pqsData.map(p => p.id), token)
        setOqs(oqsData)
      }
      const comosData = await getComos(projetoId, token)
      setComos(comosData)
    } catch (e) {
      showToast('Erro ao carregar projeto')
    } finally {
      setLoading(false)
    }
  }, [projetoId, token])

  useEffect(() => { load() }, [load])

  function handleOpenComo(id) {
    const c = comos.find(c => c.id === id)
    setSelectedComo(c)
    panelModal.open()
  }

  async function handleSaveComo(updates) {
    try {
      await updateComo(selectedComo.id, updates, token)
      if (updates.responsavel_id && updates.data_prazo && updates.tipo_prazo === 'data') {
        await syncComoToCalendar({
          grupo_id: profile.grupo_id,
          empresa_id: projeto?.empresa_id,
          projeto_id: projetoId,
          criado_por: user.id,
          responsavel_id: updates.responsavel_id,
          texto: updates.texto,
          data_prazo: updates.data_prazo,
        }, token)
      }
      showToast('Salvo!', true)
      panelModal.close()
      setSelectedComo(null)
      await load()
    } catch (e) {
      showToast('Erro ao salvar')
    }
  }

  async function handleDeleteComo() {
    try {
      await deleteComoService(selectedComo.id, token)
      showToast('Removido', true)
      panelModal.close()
      setSelectedComo(null)
      await load()
    } catch (e) {
      showToast('Erro ao remover')
    }
  }

  async function handleAddPq(texto) {
    await createPq({ projeto_id: projetoId, grupo_id: profile.grupo_id, texto }, token)
    await load()
  }

  async function handleAddOq(pqId, texto) {
    await createOq({ pq_id: pqId, projeto_id: projetoId, grupo_id: profile.grupo_id, texto }, token)
    await load()
  }

  async function handleAddComo(oqId, pqId, texto) {
    await createComo({ oq_id: oqId, projeto_id: projetoId, grupo_id: profile.grupo_id, texto, status: 'pendente' }, token)
    await load()
  }

  if (loading) return <main><Spinner /></main>
  if (!projeto) return <main><div className="empty">Projeto nao encontrado.</div></main>

  const emp = projeto.empresas || null
  const totalPct = calcPct(comos)
  const atrasadas = countAtrasadas(comos)
  const today = todayStr()
  const canEdit = canManage(profile?.role)

  return (
    <main>
      <button className="back-btn" onClick={onBack}>&#8592; Projetos</button>

      <div className="dh-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: projeto.cor || 'var(--purple)' }} />
          <div className="dh-title">{projeto.nome}</div>
        </div>

        <div className="dh-meta">
          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'var(--green-bg)', color: 'var(--green-txt)' }}>
            {projeto.status || 'ativo'}
          </span>
          {emp && <EmpresaBadge nome={emp.nome} cor={emp.cor} />}
          {projeto.data_fim && <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Prazo: {projeto.data_fim}</span>}
          {atrasadas > 0
            ? <span style={{ fontSize: 11, color: 'var(--red)', background: 'var(--red-bg)', padding: '2px 8px', borderRadius: 999 }}>⚠ {atrasadas} de {comos.length} atrasadas</span>
            : <span style={{ fontSize: 11, color: 'var(--done)' }}>✓ Sem atrasos</span>
          }
        </div>

        <div className="dh-prog">
          <div className="dh-prog-bar">
            <div className="dh-prog-fill" style={{ width: `${totalPct}%` }} />
          </div>
          <span className="dh-prog-lbl">{totalPct}%</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {comos.filter(c => c.status === 'concluido').length} de {comos.length} concluidos
          </span>
        </div>

        {metas.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {metas.map(m => <MetaItem key={m.id} meta={m} />)}
          </div>
        )}
      </div>

      {pqs.map(pq => (
        <PqBlock
          key={pq.id}
          pq={pq}
          oqs={oqs}
          comos={comos}
          canEdit={canEdit}
          onOpenComo={handleOpenComo}
          onAddComo={handleAddComo}
          onAddOq={handleAddOq}
        />
      ))}

      {canEdit && (
        <AddPqRow onAdd={handleAddPq} />
      )}

      <ComoPanel
        isOpen={panelModal.isOpen}
        onClose={panelModal.close}
        como={selectedComo}
        usuarios={usuarios}
        allComos={comos}
        onSave={handleSaveComo}
        onDelete={handleDeleteComo}
      />

      <Toast {...toast} />
    </main>
  )
}

function AddPqRow({ onAdd }) {
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')

  async function handleAdd() {
    if (!text.trim()) return
    await onAdd(text.trim())
    setText('')
    setAdding(false)
  }

  if (adding) {
    return (
      <div className="pq-block" style={{ marginTop: 8 }}>
        <div className="add-inline">
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--purple)', flexShrink: 0 }}>POR QUE</span>
          <input
            className="add-inline-inp"
            placeholder="Qual o objetivo estrategico?"
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
          />
          <button className="add-inline-btn" onClick={() => setAdding(false)}>Cancelar</button>
          <button className="add-inline-btn ok-inline" onClick={handleAdd}>Adicionar</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 8 }}>
      <div
        className="add-trigger-row"
        style={{ border: '1px dashed var(--border)', borderRadius: 'var(--r)' }}
        onClick={() => setAdding(true)}
      >
        + adicionar por que
      </div>
    </div>
  )
}
