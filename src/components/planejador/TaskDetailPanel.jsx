import { useState, useEffect } from 'react'
import { Button } from '../ui/Button'
import styles from '../layout/SidePanel.module.css'

const RECORRENCIA_LABELS = {
  nenhuma: 'Nao recorrente',
  semanal: 'Toda semana',
  mensal: 'Todo mes',
}

export function TaskDetailPanel({ isOpen, onClose, execucao, onDeactivate, onDelete, onToggleStatus }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!execucao) return null

  const tmpl = execucao.tarefas_template || {}
  const isRecorrente = tmpl.recorrencia_tipo && tmpl.recorrencia_tipo !== 'nenhuma'
  const empresa = tmpl.empresas || null
  const proj = tmpl.projetos || null
  const tipo = tmpl.tipos_atividade || null

  async function handleDeactivate() {
    if (!confirm('Desativar a recorrencia? Esta tarefa para de se repetir, mas o historico fica salvo.')) return
    setLoading(true)
    await onDeactivate()
    setLoading(false)
  }

  async function handleDelete() {
    const msg = isRecorrente
      ? 'Excluir esta tarefa recorrente? Todo o historico de execucoes sera apagado.'
      : 'Excluir esta tarefa?'
    if (!confirm(msg)) return
    setLoading(true)
    await onDelete()
    setLoading(false)
  }

  return (
    <>
      <div className={`${styles.overlay}${isOpen ? ' ' + styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.panel}${isOpen ? ' ' + styles.open : ''}`}>
        <button className={styles.close} onClick={onClose}>&#10005;</button>
        <div className={styles.title}>{tmpl.titulo || 'Tarefa'}</div>

        <div className="panel-field">
          <label>Status</label>
          <Button
            variant={execucao.status === 'concluido' ? 'primary' : 'outline'}
            size="md"
            onClick={() => onToggleStatus(execucao.id, execucao.status)}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {execucao.status === 'concluido' ? '✓ Concluida' : 'Marcar como concluida'}
          </Button>
        </div>

        {empresa && (
          <div className="panel-field">
            <label>Empresa</label>
            <span className="badge" style={{ background: empresa.cor + '22', color: empresa.cor, fontSize: 12, padding: '4px 10px' }}>
              {empresa.nome}
            </span>
          </div>
        )}

        {tipo && (
          <div className="panel-field">
            <label>Tipo de atividade</label>
            <span style={{ fontSize: 13 }}>{tipo.nome}</span>
          </div>
        )}

        {proj && (
          <div className="panel-field">
            <label>Projeto vinculado</label>
            <span style={{ fontSize: 13 }}>{proj.nome}</span>
          </div>
        )}

        <div className="panel-field">
          <label>Recorrencia</label>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {RECORRENCIA_LABELS[tmpl.recorrencia_tipo || 'nenhuma']}
          </span>
          {isRecorrente && tmpl.data_pontual && (
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Desde {tmpl.data_pontual}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
          {isRecorrente && (
            <Button variant="outline" size="md" onClick={handleDeactivate} disabled={loading}>
              Desativar recorrencia
            </Button>
          )}
          <Button variant="danger" size="md" onClick={handleDelete} disabled={loading}>
            {isRecorrente ? 'Excluir tudo' : 'Excluir tarefa'}
          </Button>
        </div>
      </div>
    </>
  )
}
