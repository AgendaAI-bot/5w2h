import styles from './Button.module.css'

export function Button({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', style }) {
  return (
    <button
      type={type}
      className={[styles.btn, styles[variant], styles[size]].join(' ')}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  )
}
