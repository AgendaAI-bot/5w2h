import { useState } from 'react'
import { calcPct } from '../../utils/calcUtils'
import { OqBlock } from './OqBlock'

export function PqBlock({ pq, oqs, comos, canEdit, onOpenComo, onAddComo, onAddOq }) {
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')

  const pqOqs = oqs.filter(o => o.pq_id === pq.id)
  const pqComos = comos.filter(c => pqOqs.some(o => o.id === c.oq_id))
  const pct = calcPct(pqComos)

  async function handleAdd() {
    if (!text.trim()) return
    await onAddOq(pq.id, text.trim())
    setText('')
    setAdding(false)
  }

  return (
    <div className="pq-block" id={`pq-${pq.id}`}>
      <div className="pq-header" onClick={() => setOpen(v => !v)}>
        <span className="pq-lbl">POR QUE</span>
        <span className="pq-txt">{pq.texto}</span>
        <div className="lvl-prog">
          <div className="lvl-bar">
            <div className="lvl-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="lvl-pct">{pct}%</span>
        </div>
        <span className="pq-chev">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="pq-body open" id={`pq-body-${pq.id}`}>
          {pqOqs.map(oq => (
            <OqBlock
              key={oq.id}
              oq={oq}
              comos={comos}
              canEdit={canEdit}
              onOpenComo={onOpenComo}
              onAddComo={onAddComo}
              pqId={pq.id}
            />
          ))}

          {canEdit && (
            adding ? (
              <div className="add-inline" style={{ marginLeft: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--amber)', flexShrink: 0 }}>O QUE</span>
                <input
                  className="add-inline-inp"
                  placeholder="Descrever o o que..."
                  autoFocus
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
                />
                <button className="add-inline-btn" onClick={() => setAdding(false)}>Cancelar</button>
                <button className="add-inline-btn ok-inline" onClick={handleAdd}>Adicionar</button>
              </div>
            ) : (
              <div className="add-trigger-row" onClick={() => setAdding(true)}>
                + adicionar o que
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
