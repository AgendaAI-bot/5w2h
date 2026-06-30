import { SB_URL, SB_KEY, sbFetch } from './supabase'

export async function login(email, password) {
  const res = await fetch(`${SB_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SB_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (data.error || !data.access_token) {
    throw new Error(data.error_description || 'Email ou senha incorretos.')
  }
  return data
}

export async function logout(token) {
  await fetch(`${SB_URL}/auth/v1/logout`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` },
  })
}

export async function getAuthUser(token) {
  const res = await fetch(`${SB_URL}/auth/v1/user`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function getProfile(userId, token) {
  const data = await sbFetch(
    `/rest/v1/usuarios?id=eq.${userId}&select=*,grupos(nome)`,
    {},
    token
  )
  return Array.isArray(data) ? data[0] : null
}
