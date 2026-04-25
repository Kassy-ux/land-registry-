import { Router } from 'express'
import { getParcels, getParcel, submitParcel, approveParcel, rejectParcel } from '../controllers/parcelController'
import { requireAuth } from '../middleware/requireAuth'
import { requireOfficer } from '../middleware/requireOfficer'

const router = Router()
router.get('/', getParcels)
router.get('/:id', getParcel)
router.post('/', requireAuth, submitParcel)
router.patch('/:id/approve', requireOfficer, approveParcel)
router.patch('/:id/reject', requireOfficer, rejectParcel)
export default router
