import { diasRestantes, todayStr } from './dateUtils'

export function calcPct(comos) {
  if (!comos.length) return 0
  return Math.round(comos.filter(c => c.status === 'concluido').length / comos.length * 100)
}

export function countAtrasadas(comos) {
  const today = todayStr()
  return comos.filter(c => c.data_prazo && c.data_prazo < today && c.status !== 'concluido').length
}

export function projetoCardStatus(comos, dataFim) {
  const atrasadas = countAtrasadas(comos)
  const dias = diasRestantes(dataFim)
  const diasClass = dias === null ? 'dok' : dias < 0 ? 'ddanger' : dias <= 7 ? 'dwarn' : 'dok'
  if (atrasadas > 0 || diasClass === 'ddanger') return diasClass === 'ddanger' ? 'pdanger' : 'pwarn'
  return 'pok'
}

export function formatMetaValue(tipo, valor) {
  if (tipo === 'moeda') return 'R$ ' + Number(valor).toLocaleString('pt-BR')
  if (tipo === 'tempo') return valor + 'h'
  if (tipo === 'percentual') return valor + '%'
  return String(valor)
}

export function canManage(role) {
  return ['superadmin', 'admin', 'gestor'].includes(role)
}

export function canAdmin(role) {
  return ['superadmin', 'admin'].includes(role)
}
