// Thin fetch wrapper around the Express API. In dev, Vite proxies /api and
// /uploads to http://localhost:4000 (see vite.config.js).

const TOKEN_KEY = 'pronose_token'

// The token lives in sessionStorage so each browser tab keeps its own login
// (e.g. a doctor and a patient side by side). localStorage only seeds brand-new
// tabs with the most recent login; once adopted, the tab is pinned to it.
export function getToken() {
  const own = sessionStorage.getItem(TOKEN_KEY)
  if (own) return own
  const inherited = localStorage.getItem(TOKEN_KEY)
  if (inherited) sessionStorage.setItem(TOKEN_KEY, inherited)
  return inherited
}

export function setToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_KEY)
  }
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
