import { Router } from 'express'
import { initiateTransfer, confirmTransfer } from '../controllers/transferController'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()
router.post('/initiate', requireAuth, initiateTransfer)
router.post('/confirm', requireAuth, confirmTransfer)
export default router
