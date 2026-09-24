import { apiFetch } from './client.js'

// Optional ?type= scopes the request to a prosthesis type. Patients omit it
// (the server infers it from their account); the admin console passes it to
// browse/edit each type's guides.
function typeQuery(type) {
  return type ? `?type=${encodeURIComponent(type)}` : ''
}

// Light list for the hub grid.
export async function listCareGuides(type) {
  const { guides } = await apiFetch(`/care-guides${typeQuery(type)}`)
  return guides
}

export async function getCareGuide(slug, type) {
  const { guide } = await apiFetch(`/care-guides/${slug}${typeQuery(type)}`)
  return guide
}

// Super admin: update the editable fields of a guide.
export async function updateCareGuide(slug, data, type) {
  const { guide } = await apiFetch(`/care-guides/${slug}${typeQuery(type)}`, {
    method: 'PUT',
    body: data,
  })
  return guide
}
