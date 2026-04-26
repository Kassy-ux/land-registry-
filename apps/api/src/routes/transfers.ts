import { Router } from 'express'
import { initiateTransfer, confirmTransfer, getPendingTransfers } from '../controllers/transferController'
import { requireAuth } from '../middleware/requireAuth'

const router = Router()
router.get('/pending', requireAuth, getPendingTransfers)
router.post('/initiate', requireAuth, initiateTransfer)
router.post('/confirm', requireAuth, confirmTransfer)
export default router
