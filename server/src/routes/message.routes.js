import { Router } from 'express'
import {
  listAll,
  thread,
  send,
  remove,
  removeConversation,
} from '../controllers/messageController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, requireRole('super_admin'), listAll)
// "/conversation/..." must precede "/:id" so it isn't captured as an id.
router.delete('/conversation/:userId/:peerId', authenticate, requireRole('super_admin'), removeConversation)
router.get('/:userId/:doctorId', authenticate, thread)
router.post('/', authenticate, send)
router.delete('/:id', authenticate, requireRole('super_admin'), remove)

export default router
