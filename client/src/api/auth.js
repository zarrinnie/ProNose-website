import { apiFetch, setToken } from './client.js'
import { mapUser, dobToISO } from './map.js'

export async function loginRequest({ email, password }) {
  const { token, user } = await apiFetch('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  })
  setToken(token)
  return mapUser(user)
}

export async function registerRequest(form) {
  const { token, user } = await apiFetch('/auth/register', {
    method: 'POST',
    auth: false,
    body: {
      full_name: form.fullName,
      email: form.email,
      mobile_number: form.mobile,
      password: form.password,
      date_of_birth: dobToISO(form.dob),
    },
  })
  setToken(token)
  return mapUser(user)
}

export async function fetchMe() {
  const { user } = await apiFetch('/auth/me')
  return mapUser(user)
}
