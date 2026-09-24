import { Router } from 'express'
import { list, getBySlug, update } from '../controllers/careGuideController.js'
import { authenticate, requireRole } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, list)
router.get('/:slug', authenticate, getBySlug)
router.put('/:slug', authenticate, requireRole('super_admin'), update)

export default router
