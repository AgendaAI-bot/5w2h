export const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
export const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function dk(date) {
  return date.toISOString().slice(0, 10)
}

export function getMonday(offset = 0) {
  const d = new Date()
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff + offset * 7)
  d.setHours(0, 0, 0, 0)
  return d
}

export function weekDates(offset = 0) {
  const mon = getMonday(offset)
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    return d
  })
}

export function todayStr() {
  return dk(new Date())
}

export function weekLabel(offset = 0) {
  const dates = weekDates(offset)
  const mon = dates[0]
  const fri = dates[4]
  return `${mon.getDate()} ${MONTHS[mon.getMonth()]} - ${fri.getDate()} ${MONTHS[fri.getMonth()]} ${fri.getFullYear()}`
}

export function diasRestantes(dataFim) {
  if (!dataFim) return null
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const fim = new Date(dataFim)
  return Math.round((fim - hoje) / (1000 * 60 * 60 * 24))
}

export function formatDateBR(isoStr) {
  if (!isoStr) return ''
  return new Date(isoStr).toLocaleDateString('pt-BR')
}
