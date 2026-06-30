import { DAYS } from '../../utils/dateUtils'
import { TaskCard } from './TaskCard'
import styles from './DayColumn.module.css'

export function DayColumn({ date, index, isToday, execucoes, usuarios, currentUserId, canSeeAll, canAdd, onToggle, onAdd }) {
  return (
    <div className={styles.col}>
      <div className={`${styles.hdr}${isToday ? ' ' + styles.today : ' ' + styles.normal}`}>
        <div className={styles.dayName}>{DAYS[index]}</div>
        <div className={styles.dayDate}>{date.getDate()}</div>
      </div>

      {execucoes.map(ex => (
        <TaskCard
          key={ex.id}
          execucao={ex}
          usuarios={usuarios}
          currentUserId={currentUserId}
          canSeeAll={canSeeAll}
          onToggle={() => onToggle(ex.id, ex.status)}
        />
      ))}

      {canAdd && (
        <button className={styles.addTrigger} onClick={onAdd}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> adicionar tarefa
        </button>
      )}
    </div>
  )
}
