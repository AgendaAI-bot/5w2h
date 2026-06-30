import { todayStr } from '../../utils/dateUtils'

export function ComoRow({ como, onOpen }) {
  const today = todayStr()
  const isLate = como.data_prazo && como.data_prazo < today && como.status !== 'concluido'
  const isDone = como.status === 'concluido'
  const isProgress = como.status === 'em_andamento'
  const chkClass = isDone ? 'on' : isLate ? 'clate' : isProgress ? 'prog' : ''
  const statusLabel = isLate ? 'atrasado' : como.status
  const resp = como.usuarios?.nome || ''

  return (
    <div className="como-row" onClick={() => onOpen(como.id)}>
      <div className={`como-chk ${chkClass}`} />
      <span className={`como-txt${isDone ? ' done' : ''}`}>{como.texto}</span>
      {resp && <span className="como-resp">{resp}</span>}
      {como.data_prazo && !isDone && <span className="como-prazo">{como.data_prazo}</span>}
      {como.depende_de && <span className="como-dep">aguarda</span>}
      <span className={`como-status cs-${isLate ? 'atrasado' : como.status}`}>
        {statusLabel.replace('_', ' ')}
      </span>
    </div>
  )
}
