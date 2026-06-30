import { COLORS } from '../../utils/stringUtils'

export function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      {COLORS.map(c => (
        <div
          key={c}
          className={`color-opt${value === c ? ' selected' : ''}`}
          style={{ background: c }}
          onClick={() => onChange(c)}
        />
      ))}
    </div>
  )
}
