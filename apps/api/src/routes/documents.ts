import { Router } from 'express'
import { uploadDocument } from '../controllers/documentController'
import { requireAuth } from '../middleware/requireAuth'
import multer from 'multer'

const upload = multer({ storage: multer.memoryStorage() })
const router = Router()
router.post('/upload', requireAuth, upload.single('file'), uploadDocument)
export default router
