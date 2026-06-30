export const SB_URL = import.meta.env.VITE_SUPABASE_URL
export const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export function getHeaders(token) {
  return {
    apikey: SB_KEY,
    Authorization: `Bearer ${token || SB_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  }
}

export async function sbFetch(path, options = {}, token = null) {
  const res = await fetch(`${SB_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(token), ...(options.headers || {}) },
  })
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}
