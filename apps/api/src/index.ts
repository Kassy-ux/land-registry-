import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

const app = express()

// Configure CORS to allow multiple origins
const allowedOrigins = [
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:3000',
  'https://lands-registry.vercel.app'
]

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

import authRoutes from './routes/auth'
import parcelRoutes from './routes/parcels'
import transferRoutes from './routes/transfers'
import documentRoutes from './routes/documents'
import verifyRoutes from './routes/verify'

app.use('/api/auth', authRoutes)
app.use('/api/parcels', parcelRoutes)
app.use('/api/transfers', transferRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/verify', verifyRoutes)

app.get('/health', (_, res) => res.json({ status: 'ok' }))

const webDistPath = path.resolve(__dirname, '../../web/dist')
if (fs.existsSync(webDistPath)) {
  app.use(express.static(webDistPath))
  app.get(/^\/(?!api\/|health$).*/, (_req, res) => {
    res.sendFile(path.join(webDistPath, 'index.html'))
  })
}

const PORT = Number(process.env.PORT) || 3001
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => console.log(`API running on ${HOST}:${PORT}`))
