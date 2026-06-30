import { useState } from 'react'
import { Modal, ModalActions } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ColorPicker } from '../ui/ColorPicker'
import { COLORS } from '../../utils/stringUtils'

export function TiposModal({ isOpen, onClose, tipos, onAdd, onDelete }) {
  const [nome, setNome] = useState('')
  const [cor, setCor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    if (!nome.trim()) return
    setLoading(true)
    try {
      await onAdd({ nome: nome.trim(), cor })
      setNome('')
      setCor(COLORS[0])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tipos de atividade" maxWidth={380}>
      <div style={{ marginBottom: 16 }}>
        {tipos.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Nenhum tipo cadastrado.</p>
        )}
        {tipos.map(t => (
          <div key={t.id} className="tipo-row">
            <div className="tipo-cor" style={{ background: t.cor }} />
            <span className="tipo-nome">{t.nome}</span>
            <button className="tipo-del" onClick={() => onDelete(t.id)}>&#10005;</button>
          </div>
        ))}
      </div>

      <div className="field">
        <label>Novo tipo</label>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Ex: Visita, Treinamento..."
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
      </div>
      <div className="field">
        <label>Cor</label>
        <ColorPicker value={cor} onChange={setCor} />
      </div>

      <ModalActions>
        <Button variant="outline" size="md" onClick={onClose}>Fechar</Button>
        <Button variant="primary" size="md" onClick={handleAdd} disabled={loading}>
          {loading ? 'Salvando...' : 'Adicionar'}
        </Button>
      </ModalActions>
    </Modal>
  )
}
