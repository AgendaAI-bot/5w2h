import { formatMetaValue } from '../../utils/calcUtils'
import { ProgressBar } from '../ui/ProgressBar'

export function MetaItem({ meta }) {
  const pct = meta.valor_meta > 0
    ? Math.min(100, Math.round((meta.valor_atual / meta.valor_meta) * 100))
    : 0
  const cur = formatMetaValue(meta.tipo, meta.valor_atual)
  const tgt = formatMetaValue(meta.tipo, meta.valor_meta)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{meta.nome}</span>
        <span style={{ fontSize: 11, fontWeight: 500 }}>{cur} / {tgt}</span>
      </div>
      <ProgressBar pct={pct} color="var(--purple)" height={3} />
    </div>
  )
}
