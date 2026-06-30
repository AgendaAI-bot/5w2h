import { sbFetch, SB_URL, SB_KEY } from './supabase'

export async function getUsuarios(token) {
  const data = await sbFetch('/rest/v1/usuarios?order=nome.asc', {}, token)
  return Array.isArray(data) ? data : []
}

export async function createUsuario({ nome, email, senha, role, grupo_id, empresa_ids }, token) {
  const res = await fetch(`${SB_URL}/functions/v1/criar-usuario`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nome, email, senha, role, grupo_id, empresa_ids }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}
