import { useState } from 'react'
import { Modal, ModalActions } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ColorPicker } from '../ui/ColorPicker'
import { COLORS } from '../../utils/stringUtils'

export function ProjetoModal({ isOpen, onClose, empresas, onSave }) {
  const [nome, setNome] = useState('')
  const [desc, setDesc] = useState('')
  const [empresaId, setEmpresaId] = useState('')
  const [status, setStatus] = useState('ativo')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [cor, setCor] = useState(COLORS[0])
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addMeta() {
    setMetas(prev => [...prev, { id: Date.now(), nome: '', tipo: 'moeda', valor: '' }])
  }

  function updateMeta(id, field, value) {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  function removeMeta(id) {
    setMetas(prev => prev.filter(m => m.id !== id))
  }

  async function handleSave() {
    if (!nome.trim() || !empresaId) { setError('Preencha nome e empresa'); return }
    setLoading(true)
    setError('')
    try {
      const metasValidas = metas.filter(m => m.nome.trim() && parseFloat(m.valor) > 0)
        .map(m => ({ nome: m.nome.trim(), tipo: m.tipo, valor_meta: parseFloat(m.valor) }))
      await onSave({ nome: nome.trim(), descricao: desc || null, empresa_id: empresaId, status, data_inicio: inicio || null, data_fim: fim || null, cor, metas: metasValidas })
      onClose()
      setNome(''); setDesc(''); setEmpresaId(''); setStatus('ativo')
      setInicio(''); setFim(''); setCor(COLORS[0]); setMetas([])
    } catch (e) {
      setError(e.message || 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo projeto">
      <div className="field">
        <label>Nome do projeto</label>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Lancamento produto X" />
      </div>
      <div className="field">
        <label>Descricao</label>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Objetivo do projeto..." />
      </div>
      <div className="modal-2col">
        <div className="field">
          <label>Empresa</label>
          <select value={empresaId} onChange={e => setEmpresaId(e.target.value)}>
            <option value="">Selecione a empresa</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="ativo">Ativo</option>
            <option value="pausado">Pausado</option>
          </select>
        </div>
      </div>
      <div className="modal-2col">
        <div className="field">
          <label>Data inicio</label>
          <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} />
        </div>
        <div className="field">
          <label>Data fim</label>
          <input type="date" value={fim} onChange={e => setFim(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Cor</label>
        <ColorPicker value={cor} onChange={setCor} />
      </div>

      <div className="modal-divider" />
      <div className="mini-section">Metas do projeto</div>

      {metas.map(m => (
        <div key={m.id} className="meta-row">
          <input
            type="text" placeholder="Nome da meta" style={{ flex: 2 }}
            value={m.nome} onChange={e => updateMeta(m.id, 'nome', e.target.value)}
          />
          <select style={{ flex: 1 }} value={m.tipo} onChange={e => updateMeta(m.id, 'tipo', e.target.value)}>
            <option value="moeda">Moeda (R$)</option>
            <option value="numero">Numero</option>
            <option value="tempo">Tempo (h)</option>
            <option value="percentual">Percentual (%)</option>
          </select>
          <input
            type="number" placeholder="Meta" style={{ flex: 1 }}
            value={m.valor} onChange={e => updateMeta(m.id, 'valor', e.target.value)}
          />
          <button className="remove-btn" onClick={() => removeMeta(m.id)}>&times;</button>
        </div>
      ))}
      <button className="add-meta-btn" onClick={addMeta}>+ Adicionar meta</button>

      {error && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 8 }}>{error}</p>}

      <ModalActions>
        <Button variant="outline" size="md" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" size="md" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Criar projeto'}
        </Button>
      </ModalActions>
    </Modal>
  )
}
