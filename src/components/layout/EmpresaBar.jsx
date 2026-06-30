import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { canAdmin } from '../../utils/calcUtils'
import styles from './EmpresaBar.module.css'

export function EmpresaBar({ onAddEmpresa }) {
  const { empresas, selectedEmpresa, setSelectedEmpresa } = useApp()
  const { profile } = useAuth()

  return (
    <div className={styles.bar}>
      <button
        className={`${styles.filter} ${styles.todas}${selectedEmpresa === null ? ' ' + styles.active : ''}`}
        onClick={() => setSelectedEmpresa(null)}
      >
        Todas
      </button>
      {empresas.map(emp => (
        <button
          key={emp.id}
          className={`${styles.filter}${selectedEmpresa === emp.id ? ' ' + styles.active : ''}`}
          onClick={() => setSelectedEmpresa(emp.id)}
        >
          <div className={styles.dot} style={{ background: emp.cor }} />
          {emp.nome}
        </button>
      ))}
      {canAdmin(profile?.role) && (
        <button className={styles.addBtn} onClick={onAddEmpresa}>
          + Nova empresa
        </button>
      )}
    </div>
  )
}
