import { useState } from 'react'
import { Modal, ModalActions } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ColorPicker } from '../ui/ColorPicker'
import { COLORS } from '../../utils/stringUtils'

export function EmpresaModal({ isOpen, onClose, onSave }) {
  const [nome, setNome] = useState('')
  const [cor, setCor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!nome.trim()) { setError('Coloca um nome'); return }
    setLoading(true)
    setError('')
    try {
      await onSave({ nome: nome.trim(), cor })
      onClose()
      setNome(''); setCor(COLORS[0])
    } catch (e) {
      setError(e.message || 'Erro ao criar empresa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova empresa" maxWidth={380}>
      <div className="field">
        <label>Nome</label>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: ScaleMed" />
      </div>
      <div className="field">
        <label>Cor</label>
        <ColorPicker value={cor} onChange={setCor} />
      </div>
      {error && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>{error}</p>}
      <ModalActions>
        <Button variant="outline" size="md" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" size="md" onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Criar empresa'}
        </Button>
      </ModalActions>
    </Modal>
  )
}
