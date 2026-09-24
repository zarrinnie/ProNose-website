import { Op } from 'sequelize'
import { sequelize, User, Consultation, Message } from '../models/index.js'
import { deleteUploadIfLocal } from '../middleware/upload.js'

// Admin: list all users (optional ?role= filter).
// Doctor: list only patients assigned to them.
export async function list(req, res, next) {
  try {
    const where = {}
    if (req.user.role === 'doctor') {
      where.assigned_doctor_id = req.user.id
      // Defensive scoping: a doctor only sees patients of their prosthesis type.
      if (req.user.prosthesis_type) where.prosthesis_type = req.user.prosthesis_type
    } else if (req.query.role) {
      where.role = req.query.role
    }

    const users = await User.findAll({
      where,
      include: [{ model: User, as: 'assignedDoctor' }],
      order: [['full_name', 'ASC']],
    })

    res.json({
      users: users.map((u) => {
        const safe = u.toSafeJSON()
        if (safe.assignedDoctor) delete safe.assignedDoctor.password_hash
        return safe
      }),
    })
  } catch (err) {
    next(err)
  }
}

// Update own profile, or (admin) any user's role / doctor assignment.
export async function update(req, res, next) {
  try {
    const targetId = Number(req.params.id)
    const isSelf = targetId === req.user.id
    const isAdmin = req.user.role === 'super_admin'

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ error: 'You can only edit your own profile.' })
    }

    const user = await User.findByPk(targetId)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    // Anyone may edit their own contact details.
    const { full_name, mobile_number, email } = req.body
    if (full_name !== undefined) user.full_name = full_name
    if (mobile_number !== undefined) user.mobile_number = mobile_number
    if (email !== undefined) user.email = email

    // Only admins may change roles, doctor assignments and prosthesis type.
    if (isAdmin) {
      if (req.body.role !== undefined) user.role = req.body.role
      if (req.body.assigned_doctor_id !== undefined) {
        user.assigned_doctor_id = req.body.assigned_doctor_id || null
      }
      if (req.body.prosthesis_type !== undefined) {
        user.prosthesis_type = req.body.prosthesis_type || null
      }
    }

    // A newly uploaded profile picture replaces the old one; clean up the file
    // it superseded (best-effort, only touches local /uploads).
    if (req.file) {
      const previous = user.avatar_url
      user.avatar_url = `/uploads/${req.file.filename}`
      await deleteUploadIfLocal(previous)
    }

    await user.save()

    // Reload with the assigned doctor so the response matches the shape
    // returned by login / me (the client merges this into currentUser).
    const fresh = await User.findByPk(user.id, {
      include: [{ model: User, as: 'assignedDoctor' }],
    })
    const safe = fresh.toSafeJSON()
    if (safe.assignedDoctor) delete safe.assignedDoctor.password_hash
    res.json({ user: safe })
  } catch (err) {
    next(err)
  }
}

// Admin: permanently delete a user and their dependent data.
export async function remove(req, res, next) {
  try {
    const targetId = Number(req.params.id)
    if (targetId === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' })
    }

    const user = await User.findByPk(targetId)
    if (!user) return res.status(404).json({ error: 'User not found.' })

    // Collect the user's consultation images before removing the rows.
    const consultations = await Consultation.findAll({ where: { patient_id: targetId } })

    await sequelize.transaction(async (t) => {
      // If a doctor is removed, unassign their patients first (avoids FK breakage).
      if (user.role === 'doctor') {
        await User.update(
          { assigned_doctor_id: null },
          { where: { assigned_doctor_id: targetId }, transaction: t },
        )
      }
      await Consultation.destroy({ where: { patient_id: targetId }, transaction: t })
      await Message.destroy({
        where: { [Op.or]: [{ sender_id: targetId }, { receiver_id: targetId }] },
        transaction: t,
      })
      await user.destroy({ transaction: t })
    })

    // Best-effort image cleanup after the rows are gone.
    await Promise.all(consultations.map((c) => deleteUploadIfLocal(c.prosthetic_image_url)))

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
