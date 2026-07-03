import { Router } from 'express'
import { listAll, listByPatient, create, review, remove } from '../controllers/consultationController.js'
import { authenticate, requireRole } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/', authenticate, requireRole('super_admin'), listAll)
router.get('/:patientId', authenticate, listByPatient)
router.post('/', authenticate, requireRole('patient'), upload.single('prostheticImage'), create)
router.patch('/:id', authenticate, requireRole('doctor', 'super_admin'), review)
router.delete('/:id', authenticate, requireRole('super_admin'), remove)

export default router
