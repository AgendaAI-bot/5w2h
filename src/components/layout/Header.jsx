import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { initials, firstWord } from '../../utils/stringUtils'
import { formatDateBR } from '../../utils/dateUtils'
import styles from './Header.module.css'

export function Header({ weekLabel, onPrev, onNext, totalTasks, donePct }) {
  const { profile, logout } = useAuth()
  const { notificacoes, refreshNotificacoes, marcarTodasLidas } = useApp()
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    refreshNotificacoes()
  }, []) // eslint-disable-line

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const naoLidas = notificacoes.filter(n => !n.lida).length

  return (
    <>
      <div className={styles.progBar}>
        <div className={styles.progFill} style={{ width: `${donePct}%` }} />
      </div>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <div className={styles.dots}>
              <div className={`${styles.dot} ${styles.d1}`} />
              <div className={`${styles.dot} ${styles.d2}`} />
            </div>
            <div>
              <div className={styles.name}>Planejador</div>
              <div className={styles.sub}>{profile?.grupos?.nome || ''}</div>
            </div>
          </div>

          <div className={styles.center}>
            <button className={styles.weekBtn} onClick={onPrev}>&#8249;</button>
            <span className={styles.weekLabel}>{weekLabel}</span>
            <button className={styles.weekBtn} onClick={onNext}>&#8250;</button>
          </div>

          <div className={styles.right}>
            <span className={`chip${donePct > 0 ? ' ok' : ''}`}>{totalTasks} tarefa{totalTasks !== 1 ? 's' : ''}</span>
            <span className={`chip${donePct > 0 ? ' ok' : ''}`}>{donePct}% concluido</span>

            <div className={styles.notifWrap} ref={notifRef}>
              <button className={styles.notifBtn} onClick={() => setNotifOpen(v => !v)}>
                &#128276;
                <div className={`${styles.notifDot}${naoLidas > 0 ? ' ' + styles.show : ''}`} />
              </button>
              {notifOpen && (
                <div className={styles.notifPanel}>
                  <div className={styles.notifHeader}>
                    <span>Notificacoes</span>
                    <button onClick={marcarTodasLidas} className={styles.notifMark}>Marcar lidas</button>
                  </div>
                  {notificacoes.length === 0 && <div className="empty">Sem notificacoes</div>}
                  {notificacoes.map(n => (
                    <div key={n.id} className="notif-item" style={{ opacity: n.lida ? 0.6 : 1 }}>
                      <span className="notif-titulo">{n.titulo}</span>
                      <span className="notif-msg">{n.mensagem}</span>
                      <span className="notif-time">{formatDateBR(n.created_at)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <span className={`role-badge role-${profile?.role}`}>{profile?.role}</span>
            <div className={styles.userBtn}>
              <div className={styles.avatar}>{initials(profile?.nome)}</div>
              <span className={styles.userName}>{firstWord(profile?.nome)}</span>
            </div>
            <button className={styles.logoutBtn} onClick={logout}>Sair</button>
          </div>
        </div>
      </header>
    </>
  )
}
