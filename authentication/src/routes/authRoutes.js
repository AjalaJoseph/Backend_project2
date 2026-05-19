import express from 'express'
import { registerControl, loginControler, refreshController, logoutController } from '../controllers/authController.js'
import { limiter } from '../middlewares/rate.js'
export const router = express.Router()
router.post('/register',registerControl)
router.post('/login',limiter, loginControler)
router.post('/refresh', refreshController)
router.post('/logout', logoutController)