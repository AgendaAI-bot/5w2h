import { useState } from 'react'
import { calcPct } from '../../utils/calcUtils'
import { ComoRow } from './ComoRow'

export function OqBlock({ oq, comos, canEdit, onOpenComo, onAddComo, pqId }) {
  const [open, setOpen] = useState(true)
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')

  const oqComos = comos.filter(c => c.oq_id === oq.id)
  const pct = calcPct(oqComos)

  async function handleAdd() {
    if (!text.trim()) return
    await onAddComo(oq.id, pqId, text.trim())
    setText('')
    setAdding(false)
  }

  return (
    <div className="oq-block" id={`oq-${oq.id}`}>
      <div className="oq-header" onClick={() => setOpen(v => !v)}>
        <span className="oq-lbl">O QUE</span>
        <span className="oq-txt">{oq.texto}</span>
        <div className="lvl-prog">
          <div className="lvl-bar">
            <div className="lvl-fill" style={{ width: `${pct}%`, background: 'var(--amber)' }} />
          </div>
          <span className="lvl-pct">{pct}%</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 4 }}>▼</span>
      </div>

      {open && (
        <div id={`oq-body-${oq.id}`}>
          <div className="oq-body">
            {oqComos.map(c => (
              <ComoRow key={c.id} como={c} onOpen={onOpenComo} />
            ))}

            {canEdit && (
              adding ? (
                <div className="add-inline">
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', flexShrink: 0 }}>COMO</span>
                  <input
                    className="add-inline-inp"
                    placeholder="Descrever o como..."
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
                  + adicionar como
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}
