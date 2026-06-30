import { sbFetch } from './supabase'

export async function getEmpresas(token) {
  const data = await sbFetch('/rest/v1/empresas?ativo=eq.true&order=created_at.asc', {}, token)
  return Array.isArray(data) ? data : []
}

export async function createEmpresa({ grupo_id, nome, cor }, token) {
  const data = await sbFetch(
    '/rest/v1/empresas',
    { method: 'POST', body: JSON.stringify({ grupo_id, nome, cor, ativo: true }) },
    token
  )
  return Array.isArray(data) ? data[0] : data
}
