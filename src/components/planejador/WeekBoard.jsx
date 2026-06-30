import { dk, todayStr } from '../../utils/dateUtils'
import { DayColumn } from './DayColumn'
import styles from './WeekBoard.module.css'

export function WeekBoard({ dates, execucoes, usuarios, currentUserId, canSeeAll, canAdd, selectedEmpresa, filteredUsers, onOpenTask, onAdd }) {
  const today = todayStr()
  const hasUserFilter = Object.keys(filteredUsers).length > 0

  return (
    <div className={styles.board}>
      {dates.map((d, i) => {
        const dateStr = dk(d)
        const isPast = dateStr < today
        const isToday = dateStr === today

        const dayExecs = execucoes
          .filter(e => {
            if (e.data !== dateStr) return false
            if (!canSeeAll && e.usuario_id !== currentUserId) return false
            if (selectedEmpresa) {
              const empId = e.empresa_id || e.tarefas_template?.empresa_id
              if (empId !== selectedEmpresa) return false
            }
            if (hasUserFilter && !filteredUsers[e.usuario_id]) return false
            return true
          })
          .map(e => ({ ...e, isLate: isPast && e.status === 'pendente' }))

        return (
          <DayColumn
            key={dateStr}
            date={d}
            index={i}
            isToday={isToday}
            execucoes={dayExecs}
            usuarios={usuarios}
            currentUserId={currentUserId}
            canSeeAll={canSeeAll}
            canAdd={canAdd}
            onOpenTask={onOpenTask}
            onAdd={() => onAdd(dateStr)}
          />
        )
      })}
    </div>
  )
}
