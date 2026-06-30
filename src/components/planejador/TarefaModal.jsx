import { useState, useEffect } from 'react'
import { Modal, ModalActions } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'

export function TarefaModal({ isOpen, onClose, dateStr, projetos, onSave }) {
  const { empresas, usuarios, tipos, selectedEmpresa } = useApp()
  const { user } = useAuth()

  const [empresaId, setEmpresaId] = useState('')
  const [tipoId, setTipoId] = useState('')
  const [obs, setObs] = useState('')
  const [projetoId, setProjetoId] = useState('')
  const [respId, setRespId] = useState('')
  const [data, setData] = useState('')
  const [recorrenciaTipo, setRecorrenciaTipo] = useState('nenhuma')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setEmpresaId(selectedEmpresa || '')
      setTipoId('')
      setObs('')
      setProjetoId('')
      setRespId(user?.id || '')
      setData(dateStr || '')
      setRecorrenciaTipo('nenhuma')
      setError('')
    }
  }, [isOpen, dateStr, selectedEmpresa, user])

  async function handleSave() {
    if (!empresaId) { setError('Selecione a empresa'); return }
    if (!obs.trim()) { setError('Preencha a descricao'); return }
    if (!data) { setError('Selecione a data'); return }

    setLoading(true)
    setError('')
    try {
      await onSave({
        empresa_id: empresaId,
        tipo_atividade_id: tipoId || null,
        titulo: obs.trim(),
        observacao: obs.trim(),
        projeto_id: projetoId || null,
        usuario_id: respId || user.id,
        data_pontual: data,
        recorrencia_tipo: recorrenciaTipo,
      })
      onClose()
    } catch (e) {
      setError(e.message || 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const recorrenciaPreview = () => {
    if (recorrenciaTipo === 'nenhuma' || !data) return null
    const d = new Date(data + 'T00:00:00')
    const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']
    if (recorrenciaTipo === 'semanal') {
      return `Vai se repetir toda ${diasSemana[d.getDay()]}-feira, a partir de ${data}`
    }
    if (recorrenciaTipo === 'mensal') {
      return `Vai se repetir todo dia ${d.getDate()} do mes, a partir de ${data}`
    }
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova tarefa">
      <div className="modal-2col">
        <div className="field">
          <label>Empresa</label>
          <select value={empresaId} onChange={e => setEmpresaId(e.target.value)}>
            <option value="">Selecione a empresa</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Tipo de atividade</label>
          <select value={tipoId} onChange={e => setTipoId(e.target.value)}>
            <option value="">Selecione o tipo</option>
            {tipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Descricao da tarefa</label>
        <textarea value={obs} onChange={e => setObs(e.target.value)} placeholder="Detalhe a tarefa..." />
      </div>

      <div className="field">
        <label>Projeto (opcional)</label>
        <select value={projetoId} onChange={e => setProjetoId(e.target.value)}>
          <option value="">Sem projeto</option>
          {projetos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      <div className="field">
        <label>Responsavel</label>
        <select value={respId} onChange={e => setRespId(e.target.value)}>
          <option value={user?.id}>Eu mesmo</option>
          {usuarios.filter(u => u.id !== user?.id).map(u => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </select>
      </div>

      <div className="modal-2col">
        <div className="field">
          <label>Data</label>
          <input type="date" value={data} onChange={e => setData(e.target.value)} />
        </div>
        <div className="field">
          <label>Recorrencia</label>
          <select value={recorrenciaTipo} onChange={e => setRecorrenciaTipo(e.target.value)}>
            <option value="nenhuma">Nao recorrente</option>
            <option value="semanal">Toda semana</option>
            <option value="mensal">Todo mes</option>
          </select>
        </div>
      </div>

      {recorrenciaPreview() && (
        <div style={{ fontSize: 12, color: 'var(--purple)', background: 'var(--purple-bg)', padding: '8px 12px', borderRadius: 'var(--r)', marginBottom: 14 }}>
          {recorrenciaPreview()}
        </div>
      )}

      {error && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>{error}</p>}

      <ModalActions>
        <Button variant="outline" size="md" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" size="md" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Criar tarefa'}
        </Button>
      </ModalActions>
    </Modal>
  )
}
