// Thin fetch wrapper around the Express API. In dev, Vite proxies /api and
// /uploads to http://localhost:4000 (see vite.config.js).

const TOKEN_KEY = 'pronose_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch(path, { method = 'GET', body, auth = true, isFormData = false } = {}) {
  const headers = {}
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let payload = body
  if (body && !isFormData) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const res = await fetch(`/api${path}`, { method, headers, body: payload })

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { error: text }
    }
  }

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }

  return data
}
