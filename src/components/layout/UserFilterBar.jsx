import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { canManage } from '../../utils/calcUtils'
import { initials, colorForIndex } from '../../utils/stringUtils'
import styles from './UserFilterBar.module.css'

export function UserFilterBar() {
  const { usuarios, filteredUsers, toggleUserFilter, clearUserFilter } = useApp()
  const { profile } = useAuth()

  if (!canManage(profile?.role) || !usuarios.length) return null

  const hasFilter = Object.keys(filteredUsers).length > 0

  return (
    <div className={styles.bar}>
      <span className={styles.label}>Ver:</span>
      <button className={`${styles.filter}${!hasFilter ? ' ' + styles.active : ''}`} onClick={clearUserFilter}>
        Todos
      </button>
      {usuarios.map((u, idx) => (
        <button
          key={u.id}
          className={`${styles.filter}${filteredUsers[u.id] ? ' ' + styles.active : ''}`}
          onClick={() => toggleUserFilter(u.id)}
        >
          <div className={styles.avatar} style={{ background: colorForIndex(idx) }}>
            {initials(u.nome)}
          </div>
          {u.nome.split(' ')[0]}
        </button>
      ))}
    </div>
  )
}
