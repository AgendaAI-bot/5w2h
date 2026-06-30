export const COLORS = [
  '#534AB7', '#0B6E4F', '#D94040', '#B07010',
  '#1D6FA8', '#8B3A8B', '#C4541A', '#2A7A5A',
  '#444441', '#1a6b8a',
]

export function initials(name) {
  return (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function firstWord(name) {
  return (name || '').split(' ')[0]
}

export function colorForIndex(index) {
  return COLORS[index % COLORS.length]
}
