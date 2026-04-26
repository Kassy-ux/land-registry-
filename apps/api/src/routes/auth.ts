import { Router } from 'express'
import { login, registerWallet, getWalletUser } from '../controllers/authController'

const router = Router()
router.post('/login', login)
router.post('/register-wallet', registerWallet)
router.get('/wallet/:address', getWalletUser)
export default router
