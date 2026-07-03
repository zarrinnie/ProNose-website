import { Consultation, User } from '../models/index.js'
import { deleteUploadIfLocal } from '../middleware/upload.js'

// 'true'/'yes'/true -> boolean; tolerant of multipart string values.
function toBool(v) {
  return v === true || v === 'true' || v === 'yes' || v === 'on' || v === '1'
}

// Whether the requester may view this patient's consultations.
async function canAccessPatient(requester, patientId) {
  if (requester.role === 'super_admin') return true
  if (requester.role === 'patient') return requester.id === Number(patientId)
  if (requester.role === 'doctor') {
    const patient = await User.findByPk(patientId)
    return patient && patient.assigned_doctor_id === requester.id
  }
  return false
}

export async function listByPatient(req, res, next) {
  try {
    const { patientId } = req.params
    if (!(await canAccessPatient(req.user, patientId))) {
      return res.status(403).json({ error: 'You do not have access to these consultations.' })
    }

    const rows = await Consultation.findAll({
      where: { patient_id: patientId },
      order: [['created_at', 'DESC']],
    })
    res.json({ consultations: rows })
  } catch (err) {
    next(err)
  }
}

// Admin: every consultation in the system, with its patient.
export async function listAll(req, res, next) {
  try {
    const rows = await Consultation.findAll({
      include: [{ model: User, as: 'patient', attributes: { exclude: ['password_hash'] } }],
      order: [['created_at', 'DESC']],
    })
    res.json({ consultations: rows })
  } catch (err) {
    next(err)
  }
}

export async function create(req, res, next) {
  try {
    // Patients submit for themselves; the patient_id always comes from the token.
    const patient_id = req.user.id
    const b = req.body

    const consultation = await Consultation.create({
      patient_id,
      type: b.type === 'emergency' ? 'emergency' : 'regular',
      status: 'pending',
      prosthetic_image_url: req.file ? `/uploads/${req.file.filename}` : null,
      q_doing_okay: b.q_doing_okay || null,
      q_discomfort: b.q_discomfort || null,
      q_color_fading: toBool(b.q_color_fading),
      q_color_fading_details: b.q_color_fading_details || null,
      q_deforming: toBool(b.q_deforming),
      q_deforming_details: b.q_deforming_details || null,
      q_daily_issues: b.q_daily_issues || null,
      additional_comments: b.additional_comments || null,
    })

    res.status(201).json({ consultation })
  } catch (err) {
    next(err)
  }
}

// Doctor / admin: add notes and mark reviewed.
export async function review(req, res, next) {
  try {
    const consultation = await Consultation.findByPk(req.params.id)
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found.' })
    }

    if (req.user.role === 'doctor') {
      const patient = await User.findByPk(consultation.patient_id)
      if (!patient || patient.assigned_doctor_id !== req.user.id) {
        return res.status(403).json({ error: 'This patient is not assigned to you.' })
      }
    }

    if (typeof req.body.doctor_notes === 'string') {
      consultation.doctor_notes = req.body.doctor_notes
    }
    if (req.body.status === 'reviewed' || req.body.status === 'pending') {
      consultation.status = req.body.status
    }
    await consultation.save()

    res.json({ consultation })
  } catch (err) {
    next(err)
  }
}

// Admin: permanently delete a consultation and its uploaded image.
export async function remove(req, res, next) {
  try {
    const consultation = await Consultation.findByPk(req.params.id)
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found.' })
    }
    await deleteUploadIfLocal(consultation.prosthetic_image_url)
    await consultation.destroy()
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
