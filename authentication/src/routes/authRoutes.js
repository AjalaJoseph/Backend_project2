import express from 'express'
import { registerControl, loginControler } from '../controllers/authController.js'
export const router = express.Router()
router.post('/register',registerControl)
router.post('/login', loginControler)