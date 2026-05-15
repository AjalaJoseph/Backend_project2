import express from 'express'
export const app = express()
import { router } from './src/routes/authRoutes.js'
import cookieParser from 'cookie-parser';
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', router)