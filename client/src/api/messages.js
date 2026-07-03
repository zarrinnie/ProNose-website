import { apiFetch } from './client.js'
import { mapMessage } from './map.js'

export async function listMessages(userId, peerId) {
  const { messages } = await apiFetch(`/messages/${userId}/${peerId}`)
  return messages.map(mapMessage)
}

export async function sendMessage({ receiverId, body }) {
  const { message } = await apiFetch('/messages', {
    method: 'POST',
    body: { receiver_id: receiverId, message_body: body },
  })
  return mapMessage(message)
}

// Admin: every message in the system (includes sender/receiver names).
export async function listAllMessages() {
  const { messages } = await apiFetch('/messages')
  return messages.map(mapMessage)
}

// Admin: delete a single message.
export async function deleteMessage(id) {
  await apiFetch(`/messages/${id}`, { method: 'DELETE' })
}

// Admin: delete an entire conversation between two users.
export async function deleteConversation(userId, peerId) {
  await apiFetch(`/messages/conversation/${userId}/${peerId}`, { method: 'DELETE' })
}
