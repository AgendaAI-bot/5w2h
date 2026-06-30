import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import styles from './SidePanel.module.css'

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente', cls: 'ap' },
  { value: 'em_andamento', label: 'Em andamento', cls: 'ae' },
  { value: 'concluido', label: 'Concluido', cls: 'ac' },
  { value: 'atrasado', label: 'Atrasado', cls: 'aa' },
]

export function SidePanel({ isOpen, onClose, como, usuarios, allComos, onSave, onDelete }) {
  const [texto, setTexto] = useState('')
  const [status, setStatus] = useState('pendente')
  const [respId, setRespId] = useState('')
  const [tipoPrazo, setTipoPrazo] = useState('data')
  const [data, setData] = useState('')
  const [dep, setDep] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (como) {
      setTexto(como.texto || '')
      setStatus(como.status || 'pendente')
      setRespId(como.responsavel_id || '')
      setTipoPrazo(como.tipo_prazo || 'data')
      setData(como.data_prazo || '')
      setDep(como.depende_de || '')
    }
  }, [como])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSave() {
    if (!texto.trim()) return
    setLoading(true)
    await onSave({
      texto: texto.trim(), status, responsavel_id: respId || null,
      tipo_prazo: tipoPrazo,
      data_prazo: tipoPrazo === 'data' ? data || null : null,
      depende_de: tipoPrazo === 'dependencia' ? dep || null : null,
    })
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Remover esta atividade?')) return
    setLoading(true)
    await onDelete()
    setLoading(false)
  }

  return (
    <>
      <div className={`${styles.overlay}${isOpen ? ' ' + styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.panel}${isOpen ? ' ' + styles.open : ''}`}>
        <button className={styles.close} onClick={onClose}>&#10005;</button>
        <div className={styles.title}>{como?.texto || 'Editar atividade'}</div>

        <div className="field">
          <label>O que fazer</label>
          <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Descrever..." />
        </div>

        <div className="field">
          <label>Status</label>
          <div className={styles.statusRow}>
            {STATUS_OPTIONS.map(s => (
              <button
                key={s.value}
                className={`${styles.statusOpt}${status === s.value ? ' ' + styles[s.cls] : ''}`}
                onClick={() => setStatus(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Responsavel</label>
          <select value={respId} onChange={e => setRespId(e.target.value)}>
            <option value="">Sem responsavel</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
        </div>

        <div className="field">
          <label>Tipo de prazo</label>
          <select value={tipoPrazo} onChange={e => setTipoPrazo(e.target.value)}>
            <option value="data">Data fixa</option>
            <option value="dependencia">Apos outra atividade</option>
          </select>
        </div>

        {tipoPrazo === 'data' && (
          <div className="field">
            <label>Data prazo</label>
            <input type="date" value={data} onChange={e => setData(e.target.value)} />
          </div>
        )}

        {tipoPrazo === 'dependencia' && (
          <div className="field">
            <label>Inicia apos</label>
            <select value={dep} onChange={e => setDep(e.target.value)}>
              <option value="">Selecione</option>
              {(allComos || []).filter(c => c.id !== como?.id).map(c => (
                <option key={c.id} value={c.id}>{c.texto}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.actions}>
          <Button variant="primary" size="md" onClick={handleSave} disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button variant="danger" size="md" onClick={handleDelete} disabled={loading}>
            Remover
          </Button>
        </div>
      </div>
    </>
  )
}
