import { Router } from 'express'
import { login, walletLogin } from '../controllers/authController'

const router = Router()
router.post('/login', login)
router.post('/wallet', walletLogin)
export default router
