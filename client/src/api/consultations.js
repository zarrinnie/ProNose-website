import { apiFetch } from './client.js'
import { mapConsultation } from './map.js'

export async function listConsultations(patientId) {
  const { consultations } = await apiFetch(`/consultations/${patientId}`)
  return consultations.map(mapConsultation)
}

// Admin: every consultation in the system (includes patient info).
export async function listAllConsultations() {
  const { consultations } = await apiFetch('/consultations')
  return consultations.map(mapConsultation)
}

// Admin: permanently delete a consultation.
export async function deleteConsultation(id) {
  await apiFetch(`/consultations/${id}`, { method: 'DELETE' })
}

// Submits the questionnaire + photo as multipart/form-data.
export async function createConsultation({ answers, urgent, photoFile }) {
  const fd = new FormData()
  fd.append('type', urgent ? 'emergency' : 'regular')
  fd.append('q_doing_okay', answers.doingOkay || '')
  fd.append('q_discomfort', answers.discomfort || '')
  fd.append('q_color_fading', answers.colorFading === 'yes' ? 'true' : 'false')
  fd.append('q_color_fading_details', answers.colorFadingDetails || '')
  fd.append('q_deforming', answers.deforming === 'yes' ? 'true' : 'false')
  fd.append('q_deforming_details', answers.deformingDetails || '')
  fd.append('q_daily_issues', answers.dailyIssues || '')
  fd.append('additional_comments', answers.comments || '')
  if (photoFile) fd.append('prostheticImage', photoFile)

  const { consultation } = await apiFetch('/consultations', {
    method: 'POST',
    body: fd,
    isFormData: true,
  })
  return mapConsultation(consultation)
}

// Doctor / admin: save notes and/or mark reviewed.
export async function reviewConsultation(id, { doctor_notes, status }) {
  const { consultation } = await apiFetch(`/consultations/${id}`, {
    method: 'PATCH',
    body: { doctor_notes, status },
  })
  return mapConsultation(consultation)
}
