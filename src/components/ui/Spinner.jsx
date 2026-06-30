export function Spinner({ text = 'Carregando...' }) {
  return (
    <div className="loading">
      <div className="spinner" />
      {text}
    </div>
  )
}
