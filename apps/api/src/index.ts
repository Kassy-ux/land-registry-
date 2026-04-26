import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

import authRoutes from './routes/auth'
import parcelRoutes from './routes/parcels'
import transferRoutes from './routes/transfers'
import documentRoutes from './routes/documents'
import verifyRoutes from './routes/verify'
import adminRoutes from './routes/admin'

app.use('/api/auth', authRoutes)
app.use('/api/parcels', parcelRoutes)
app.use('/api/transfers', transferRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/verify', verifyRoutes)
app.use('/api/admin', adminRoutes)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API running on port ${PORT}`))
