import { Op } from 'sequelize'
import { Message, User } from '../models/index.js'

// Admin: every message, with sender/receiver names so the client can group
// them into conversations.
export async function listAll(req, res, next) {
  try {
    const messages = await Message.findAll({
      include: [
        { model: User, as: 'sender', attributes: ['id', 'full_name', 'role'] },
        { model: User, as: 'receiver', attributes: ['id', 'full_name', 'role'] },
      ],
      order: [['created_at', 'ASC']],
    })
    res.json({ messages })
  } catch (err) {
    next(err)
  }
}

// Returns the conversation between two users, oldest first.
export async function thread(req, res, next) {
  try {
    const a = Number(req.params.userId)
    const b = Number(req.params.doctorId)

    // Requester must be one of the two participants (admins may view any).
    if (req.user.role !== 'super_admin' && ![a, b].includes(req.user.id)) {
      return res.status(403).json({ error: 'You are not part of this conversation.' })
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: a, receiver_id: b },
          { sender_id: b, receiver_id: a },
        ],
      },
      order: [['created_at', 'ASC']],
    })
    res.json({ messages })
  } catch (err) {
    next(err)
  }
}

export async function send(req, res, next) {
  try {
    const { receiver_id, message_body } = req.body
    if (!receiver_id || !message_body || !message_body.trim()) {
      return res.status(400).json({ error: 'Receiver and message body are required.' })
    }

    // Sender is always the authenticated user.
    const message = await Message.create({
      sender_id: req.user.id,
      receiver_id,
      message_body: message_body.trim(),
    })
    res.status(201).json({ message })
  } catch (err) {
    next(err)
  }
}

// Admin: delete a single message.
export async function remove(req, res, next) {
  try {
    const deleted = await Message.destroy({ where: { id: req.params.id } })
    if (!deleted) return res.status(404).json({ error: 'Message not found.' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

// Admin: delete an entire conversation between two users.
export async function removeConversation(req, res, next) {
  try {
    const a = Number(req.params.userId)
    const b = Number(req.params.peerId)
    await Message.destroy({
      where: {
        [Op.or]: [
          { sender_id: a, receiver_id: b },
          { sender_id: b, receiver_id: a },
        ],
      },
    })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
