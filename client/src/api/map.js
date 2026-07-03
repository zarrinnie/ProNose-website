// Converts between the backend's snake_case/flat shapes and the camelCase/
// nested shapes the existing React components already expect.

// Deterministic avatar so each user has a stable picture without storing one.
function avatarFor(user) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email || user.id)}`
}

function formatDob(dateonly) {
  if (!dateonly) return ''
  const [y, m, d] = dateonly.split('-')
  return `${d} / ${m} / ${y}`
}

export function mapUser(u) {
  if (!u) return null
  const doctor = u.assignedDoctor
    ? {
        id: u.assignedDoctor.id,
        name: u.assignedDoctor.full_name,
        specialty: 'Prosthetics Specialist',
        avatar: u.assignedDoctor.avatar_url || avatarFor(u.assignedDoctor),
        clinic: 'proNose Care Team',
      }
    : null

  return {
    id: u.id,
    role: u.role,
    name: u.full_name,
    email: u.email,
    mobile: u.mobile_number || '',
    dob: formatDob(u.date_of_birth),
    avatar: u.avatar_url || avatarFor(u),
    assignedDoctorId: u.assigned_doctor_id || null,
    doctor,
    // Not tracked in the schema; kept blank for display compatibility.
    prostheticInstallDate: '',
    // Keep the raw record around for screens that need exact fields.
    raw: u,
  }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function mapConsultation(c) {
  return {
    id: c.id,
    type: c.type, // 'regular' | 'emergency'
    date: formatDate(c.created_at || c.createdAt),
    status: c.status,
    photo: c.prosthetic_image_url || 'https://placehold.co/600x400/F0F8FF/33E4DB?text=Prosthetic+Photo',
    doctorNote: c.doctor_notes || '',
    patientId: c.patient_id,
    // Present on admin's global list (Consultation included its patient).
    patientName: c.patient?.full_name || '',
    patientAvatar: c.patient ? `https://i.pravatar.cc/150?u=${encodeURIComponent(c.patient.email || c.patient.id)}` : undefined,
    answers: {
      doingOkay: c.q_doing_okay || '',
      discomfort: c.q_discomfort || '',
      colorFading: c.q_color_fading ? 'yes' : 'no',
      colorFadingDetails: c.q_color_fading_details || '',
      deforming: c.q_deforming ? 'yes' : 'no',
      deformingDetails: c.q_deforming_details || '',
      dailyIssues: c.q_daily_issues || '',
      comments: c.additional_comments || '',
    },
  }
}

function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function mapMessage(m) {
  return {
    id: m.id,
    senderId: m.sender_id,
    receiverId: m.receiver_id,
    text: m.message_body,
    time: formatTime(m.created_at || m.createdAt),
    // Present on admin's global list (sender/receiver included).
    senderName: m.sender?.full_name,
    receiverName: m.receiver?.full_name,
  }
}

// "DD / MM / YYYY" -> "YYYY-MM-DD" for the date_of_birth column.
export function dobToISO(dob) {
  if (!dob) return null
  const parts = dob.split('/').map((p) => p.trim())
  if (parts.length !== 3) return null
  const [d, m, y] = parts
  if (!d || !m || !y) return null
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}
