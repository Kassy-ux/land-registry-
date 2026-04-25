import { Router } from 'express'
import { verifyParcel } from '../controllers/verifyController'

const router = Router()
router.get('/:parcelId', verifyParcel)
export default router
