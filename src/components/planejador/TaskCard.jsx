import { EmpresaBadge } from '../ui/Badge'
import styles from './TaskCard.module.css'

export function TaskCard({ execucao, usuarios, currentUserId, canSeeAll, onOpen }) {
  const tmpl = execucao.tarefas_template || {}
  const empresa = tmpl.empresas || null
  const proj = tmpl.projetos || null
  const tipo = tmpl.tipos_atividade || null
  const isDone = execucao.status === 'concluido'
  const isLate = execucao.isLate
  const isRecorrente = tmpl.recorrencia_tipo && tmpl.recorrencia_tipo !== 'nenhuma'

  const respUser = canSeeAll && execucao.usuario_id !== currentUserId
    ? usuarios.find(u => u.id === execucao.usuario_id)
    : null

  const chkClass = isDone ? styles.on : isLate ? styles.late : ''

  return (
    <div
      className={`${styles.task}${isDone ? ' ' + styles.done : ''}${isLate ? ' ' + styles.late : ''}`}
      onClick={onOpen}
    >
      <div className={`${styles.chk} ${chkClass}`} />
      <div className={styles.body}>
        <div className={`${styles.txt}${isDone ? ' ' + styles.doneTxt : ''}`}>
          {tmpl.titulo || 'Tarefa'}
          {isRecorrente && <span className={styles.recIcon} title="Tarefa recorrente"> &#8635;</span>}
        </div>
        <div className={styles.meta}>
          {empresa && <EmpresaBadge nome={empresa.nome} cor={empresa.cor} />}
          {proj && (
            <span className="badge" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}>
              {proj.nome}
            </span>
          )}
          {tipo && (
            <span className="badge" style={{ background: 'var(--purple-bg)', color: 'var(--purple-txt)' }}>
              {tipo.nome}
            </span>
          )}
          {isLate && <span className="badge badge-late">atrasada</span>}
          {respUser && (
            <span className="badge" style={{ background: 'var(--surface-2)', color: 'var(--text-2)' }}>
              {respUser.nome.split(' ')[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
