import styles from './Modal.module.css'

export function Modal({ isOpen, onClose, title, children, maxWidth = 480 }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ maxWidth }}>
        <div className={styles.title}>{title}</div>
        {children}
      </div>
    </div>
  )
}

export function ModalActions({ children }) {
  return <div className={styles.actions}>{children}</div>
}
