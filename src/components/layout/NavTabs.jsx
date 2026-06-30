import { useAuth } from '../../context/AuthContext'
import { canManage, canAdmin } from '../../utils/calcUtils'
import styles from './NavTabs.module.css'

const TABS = [
  { id: 'planejador', label: 'Planejador', roles: ['all'] },
  { id: 'projetos', label: 'Projetos', roles: ['all'] },
  { id: 'equipe', label: 'Equipe', roles: ['superadmin', 'admin', 'gestor'] },
  { id: 'config', label: 'Configuracoes', roles: ['superadmin', 'admin', 'gestor'] },
]

export function NavTabs({ active, onChange }) {
  const { profile } = useAuth()
  const role = profile?.role

  const visible = TABS.filter(t =>
    t.roles.includes('all') || t.roles.includes(role)
  )

  return (
    <div className={styles.tabs}>
      {visible.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab}${active === tab.id ? ' ' + styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
