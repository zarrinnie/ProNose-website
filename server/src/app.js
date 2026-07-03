import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { UPLOADS_DIR } from './middleware/upload.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.routes.js'
import consultationRoutes from './routes/consultation.routes.js'
import messageRoutes from './routes/message.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Serve uploaded prosthetic photos statically.
app.use('/uploads', express.static(UPLOADS_DIR))

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/consultations', consultationRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

app.use(errorHandler)

export default app
