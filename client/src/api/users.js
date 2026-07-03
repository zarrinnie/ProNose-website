import { apiFetch } from './client.js'
import { mapUser } from './map.js'

// Admin: all users (optionally filtered by role). Doctor: assigned patients.
export async function listUsers(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : ''
  const { users } = await apiFetch(`/users${query}`)
  return users.map(mapUser)
}

// Updates a user's fields. Pass an optional `avatarFile` (a File) to also change
// the profile picture — that switches the request to multipart/form-data.
export async function updateUser(id, updates, avatarFile) {
  let options
  if (avatarFile) {
    const fd = new FormData()
    Object.entries(updates || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v)
    })
    fd.append('avatar', avatarFile)
    options = { method: 'PATCH', body: fd, isFormData: true }
  } else {
    options = { method: 'PATCH', body: updates }
  }
  const { user } = await apiFetch(`/users/${id}`, options)
  return mapUser(user)
}

// Admin: permanently delete a user and their dependent data.
export async function deleteUser(id) {
  await apiFetch(`/users/${id}`, { method: 'DELETE' })
}
