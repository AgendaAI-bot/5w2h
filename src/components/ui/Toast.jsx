import styles from './Toast.module.css'

export function Toast({ message, visible, ok }) {
  return (
    <div
      className={[styles.toast, visible ? styles.show : ''].join(' ')}
      style={{ background: ok ? 'var(--done)' : 'var(--text)' }}
    >
      {message}
    </div>
  )
}
