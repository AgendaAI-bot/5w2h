import { sbFetch } from './supabase'

export async function getTipos(token) {
  const data = await sbFetch('/rest/v1/tipos_atividade?ativo=eq.true&order=nome.asc', {}, token)
  return Array.isArray(data) ? data : []
}

export async function createTipo({ grupo_id, nome, cor }, token) {
  const data = await sbFetch(
    '/rest/v1/tipos_atividade',
    { method: 'POST', body: JSON.stringify({ grupo_id, nome, cor, ativo: true }) },
    token
  )
  return Array.isArray(data) ? data[0] : data
}

export async function deleteTipo(id, token) {
  await sbFetch(
    `/rest/v1/tipos_atividade?id=eq.${id}`,
    { method: 'PATCH', body: JSON.stringify({ ativo: false }) },
    token
  )
}
