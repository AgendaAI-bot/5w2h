export function ProgressBar({ pct, color = 'var(--done)', height = 5, showLabel = false, count }) {
  return (
    <div className="prog-wrap">
      <div className="prog-bar" style={{ height }}>
        <div className="prog-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      {showLabel && (
        <div className="prog-labels">
          <span className="prog-pct">{pct}%</span>
          {count && <span className="prog-count">{count}</span>}
        </div>
      )}
    </div>
  )
}
