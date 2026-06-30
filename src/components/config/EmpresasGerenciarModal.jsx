import { useState } from 'react'
import { Modal, ModalActions } from '../ui/Modal'
import { Button } from '../ui/Button'
import { ColorPicker } from '../ui/ColorPicker'
import { COLORS } from '../../utils/stringUtils'

export function EmpresasGerenciarModal({ isOpen, onClose, empresas, onUpdate, onDeactivate, isAdmin }) {
  const [editingId, setEditingId] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [editCor, setEditCor] = useState(COLORS[0])
  const [loading, setLoading] = useState(false)

  function startEdit(emp) {
    setEditingId(emp.id)
    setEditNome(emp.nome)
    setEditCor(emp.cor)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit() {
    if (!editNome.trim()) return
    setLoading(true)
    try {
      await onUpdate(editingId, { nome: editNome.trim(), cor: editCor })
      setEditingId(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeactivate(id, nome) {
    if (!confirm(`Apagar a empresa "${nome}"? As tarefas e projetos ja criados continuam existindo, mas a empresa nao aparecera mais para novos cadastros.`)) return
    setLoading(true)
    try {
      await onDeactivate(id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar empresas" maxWidth={420}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {empresas.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Nenhuma empresa cadastrada.</p>
        )}
        {empresas.map(emp => (
          <div key={emp.id} className="tipo-row" style={{ flexDirection: editingId === emp.id ? 'column' : 'row', alignItems: editingId === emp.id ? 'stretch' : 'center' }}>
            {editingId === emp.id ? (
              <>
                <input
                  value={editNome}
                  onChange={e => setEditNome(e.target.value)}
                  style={{ marginBottom: 8, padding: '7px 10px', borderRadius: 'var(--r)', border: '1px solid var(--border-md)', fontSize: 12 }}
                />
                <ColorPicker value={editCor} onChange={setEditCor} />
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <Button variant="outline" size="sm" onClick={cancelEdit}>Cancelar</Button>
                  <Button variant="primary" size="sm" onClick={saveEdit} disabled={loading}>Salvar</Button>
                </div>
              </>
            ) : (
              <>
                <div className="tipo-cor" style={{ background: emp.cor }} />
                <span className="tipo-nome">{emp.nome}</span>
                {isAdmin && (
                  <>
                    <button className="tipo-del" onClick={() => startEdit(emp)} title="Editar" style={{ color: 'var(--text-2)' }}>
                      &#9998;
                    </button>
                    <button className="tipo-del" onClick={() => handleDeactivate(emp.id, emp.nome)} title="Apagar">
                      &#10005;
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <ModalActions>
        <Button variant="outline" size="md" onClick={onClose}>Fechar</Button>
      </ModalActions>
    </Modal>
  )
}
