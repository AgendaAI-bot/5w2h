import { useState } from 'react'
import { Modal, ModalActions } from '../ui/Modal'
import { Button } from '../ui/Button'

export function UsuarioModal({ isOpen, onClose, empresas, onSave }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState('colaborador')
  const [empIds, setEmpIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleEmp(id) {
    setEmpIds(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  async function handleSave() {
    if (!nome.trim() || !email.trim() || !senha) { setError('Preencha todos os campos'); return }
    if (senha.length < 6) { setError('Senha deve ter pelo menos 6 caracteres'); return }
    setLoading(true)
    setError('')
    try {
      await onSave({ nome: nome.trim(), email: email.trim(), senha, role, empresa_ids: empIds })
      onClose()
      setNome(''); setEmail(''); setSenha(''); setRole('colaborador'); setEmpIds([])
    } catch (e) {
      setError(e.message || 'Erro ao criar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo usuario">
      <div className="modal-2col">
        <div className="field">
          <label>Nome completo</label>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Maria Silva" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="maria@empresa.com" />
        </div>
      </div>
      <div className="modal-2col">
        <div className="field">
          <label>Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="field">
          <label>Funcao</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="colaborador">Colaborador</option>
            <option value="gestor">Gestor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Empresas</label>
        <select
          multiple
          style={{ minHeight: 80 }}
          value={empIds}
          onChange={e => setEmpIds(Array.from(e.target.selectedOptions, o => o.value))}
        >
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select>
      </div>

      {error && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>{error}</p>}

      <ModalActions>
        <Button variant="outline" size="md" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" size="md" onClick={handleSave} disabled={loading}>
          {loading ? 'Criando...' : 'Criar usuario'}
        </Button>
      </ModalActions>
    </Modal>
  )
}
