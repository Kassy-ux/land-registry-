import { Router } from 'express'
import { requireAdmin } from '../middleware/requireAdmin'
import {
  getStats, getAllUsers, updateUserRole, deleteUser, createOfficer,
  getAllParcels, getAllTransactions, getBlockchainRecords, exportParcels
} from '../controllers/adminController'

const router = Router()
router.get('/stats', requireAdmin, getStats)
router.get('/users', requireAdmin, getAllUsers)
router.patch('/users/:id/role', requireAdmin, updateUserRole)
router.delete('/users/:id', requireAdmin, deleteUser)
router.post('/officers', requireAdmin, createOfficer)
router.get('/parcels', requireAdmin, getAllParcels)
router.get('/transactions', requireAdmin, getAllTransactions)
router.get('/blockchain', requireAdmin, getBlockchainRecords)
router.get('/export/parcels', requireAdmin, exportParcels)
export default router
