export function Badge({ children, style }) {
  return (
    <span className="badge" style={style}>
      {children}
    </span>
  )
}

export function EmpresaBadge({ nome, cor }) {
  return (
    <Badge style={{ background: cor + '22', color: cor }}>
      {nome}
    </Badge>
  )
}

export function RoleBadge({ role }) {
  return <span className={`role-badge role-${role}`}>{role}</span>
}

export function StatusBadge({ status }) {
  return <span className={`status-badge as-${status}`}>{status.replace('_', ' ')}</span>
}
