import { sbFetch } from './supabase'

export async function getNotificacoes(userId, token) {
  const data = await sbFetch(
    `/rest/v1/notificacoes?usuario_id=eq.${userId}&order=created_at.desc&limit=20`,
    {},
    token
  )
  return Array.isArray(data) ? data : []
}

export async function marcarTodasLidas(userId, token) {
  await sbFetch(
    `/rest/v1/notificacoes?usuario_id=eq.${userId}&lida=eq.false`,
    { method: 'PATCH', body: JSON.stringify({ lida: true }) },
    token
  )
}
