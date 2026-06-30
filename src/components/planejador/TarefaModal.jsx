import { useState, useEffect } from 'react'
import { Modal, ModalActions } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { dk } from '../../utils/dateUtils'

const WEEK_DAYS = [
  { label: 'Seg', value: 1 }, { label: 'Ter', value: 2 }, { label: 'Qua', value: 3 },
  { label: 'Qui', value: 4 }, { label: 'Sex', value: 5 }, { label: 'Sab', value: 6 }, { label: 'Dom', value: 0 },
]

export function TarefaModal({ isOpen, onClose, dateStr, projetos, weekDates, onSave }) {
  const { empresas, usuarios, tipos, selectedEmpresa } = useApp()
  const { user } = useAuth()

  const [empresaId, setEmpresaId] = useState('')
  const [tipoId, setTipoId] = useState('')
  const [obs, setObs] = useState('')
  const [projetoId, setProjetoId] = useState('')
  const [respId, setRespId] = useState('')
  const [data, setData] = useState('')
  const [recorrente, setRecorrente] = useState(false)
  const [selectedDays, setSelectedDays] = useState({})
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
      setRecorrente(false)
      setSelectedDays({})
      setError('')
    }
  }, [isOpen, dateStr, selectedEmpresa, user])

  function toggleDay(day) {
    setSelectedDays(prev => {
      const next = { ...prev }
      if (next[day]) delete next[day]
      else next[day] = true
      return next
    })
  }

  async function handleSave() {
    if (!empresaId) { setError('Selecione a empresa'); return }
    if (!obs.trim()) { setError('Preencha a descricao'); return }
    const dias = Object.keys(selectedDays).map(Number)
    if (recorrente && dias.length === 0) { setError('Selecione ao menos um dia'); return }

    const datas = recorrente
      ? weekDates.filter(d => selectedDays[d.getDay()]).map(d => dk(d))
      : [data]

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
        data_pontual: recorrente ? null : data,
        recorrente,
        dias_semana: recorrente ? dias : [],
        datas,
      })
      onClose()
    } catch (e) {
      setError(e.message || 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
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
          <select value={recorrente ? 'sim' : 'nao'} onChange={e => setRecorrente(e.target.value === 'sim')}>
            <option value="nao">Nao recorrente</option>
            <option value="sim">Recorrente</option>
          </select>
        </div>
      </div>

      {recorrente && (
        <div className="field">
          <label>Repetir nos dias</label>
          <div className="recorr-days">
            {WEEK_DAYS.map(d => (
              <button
                key={d.value}
                type="button"
                className={`day-opt${selectedDays[d.value] ? ' selected' : ''}`}
                onClick={() => toggleDay(d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
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
