import { Router } from 'express'
import { list, update, remove } from '../controllers/userController.js'
import { authenticate, requireRole } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/', authenticate, requireRole('doctor', 'super_admin'), list)
router.patch('/:id', authenticate, upload.single('avatar'), update)
router.delete('/:id', authenticate, requireRole('super_admin'), remove)

export default router
