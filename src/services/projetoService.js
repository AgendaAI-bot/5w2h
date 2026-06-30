import { sbFetch } from './supabase'

export async function getProjetos(token) {
  const data = await sbFetch('/rest/v1/projetos?order=created_at.desc&select=*,empresas(nome,cor)', {}, token)
  return Array.isArray(data) ? data : []
}

export async function createProjeto(body, token) {
  const data = await sbFetch('/rest/v1/projetos', { method: 'POST', body: JSON.stringify(body) }, token)
  return Array.isArray(data) ? data[0] : data
}

export async function createMeta(body, token) {
  await sbFetch('/rest/v1/metas', { method: 'POST', body: JSON.stringify(body) }, token)
}

export async function getMetas(projetoId, token) {
  const data = await sbFetch(`/rest/v1/metas?projeto_id=eq.${projetoId}&order=created_at.asc`, {}, token)
  return Array.isArray(data) ? data : []
}

export async function getComosByProjeto(projetoId, token) {
  const data = await sbFetch(
    `/rest/v1/como?projeto_id=eq.${projetoId}&select=status,data_prazo`,
    {},
    token
  )
  return Array.isArray(data) ? data : []
}

export async function getPqs(projetoId, token) {
  const data = await sbFetch(
    `/rest/v1/pq?projeto_id=eq.${projetoId}&order=ordem.asc,created_at.asc`,
    {},
    token
  )
  return Array.isArray(data) ? data : []
}

export async function getOqs(pqIds, token) {
  if (!pqIds.length) return []
  const data = await sbFetch(
    `/rest/v1/oq?pq_id=in.(${pqIds.join(',')})&order=ordem.asc,created_at.asc`,
    {},
    token
  )
  return Array.isArray(data) ? data : []
}

export async function getComos(projetoId, token) {
  const data = await sbFetch(
    `/rest/v1/como?projeto_id=eq.${projetoId}&order=ordem.asc,created_at.asc&select=*,usuarios(nome)`,
    {},
    token
  )
  return Array.isArray(data) ? data : []
}

export async function createPq({ projeto_id, grupo_id, texto }, token) {
  const data = await sbFetch('/rest/v1/pq', { method: 'POST', body: JSON.stringify({ projeto_id, grupo_id, texto }) }, token)
  return Array.isArray(data) ? data[0] : data
}

export async function createOq({ pq_id, projeto_id, grupo_id, texto }, token) {
  const data = await sbFetch('/rest/v1/oq', { method: 'POST', body: JSON.stringify({ pq_id, projeto_id, grupo_id, texto }) }, token)
  return Array.isArray(data) ? data[0] : data
}

export async function createComo(body, token) {
  const data = await sbFetch('/rest/v1/como', { method: 'POST', body: JSON.stringify(body) }, token)
  return Array.isArray(data) ? data[0] : data
}

export async function updateComo(id, body, token) {
  await sbFetch(`/rest/v1/como?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify(body) }, token)
}

export async function deleteComo(id, token) {
  await sbFetch(`/rest/v1/como?id=eq.${id}`, { method: 'DELETE' }, token)
}
