import { RoleBadge } from '../ui/Badge'
import { initials, colorForIndex } from '../../utils/stringUtils'

export function MembroRow({ membro, index }) {
  return (
    <div className="membro-row">
      <div className="membro-avatar" style={{ background: colorForIndex(index) }}>
        {initials(membro.nome)}
      </div>
      <div className="membro-info">
        <div className="membro-nome">{membro.nome}</div>
        <div className="membro-email">{membro.email}</div>
      </div>
      <RoleBadge role={membro.role} />
    </div>
  )
}
