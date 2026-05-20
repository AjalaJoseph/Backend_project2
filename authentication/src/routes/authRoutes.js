import express from 'express'
import { registerControl, loginControler, refreshController, logoutController } from '../controllers/authController.js'
import { limiter } from '../middlewares/rate.js'
import { validateRegisterInput, validate, validateLogin, validateLoginInput } from '../validators/authValidator.js'
export const router = express.Router()
router.post('/register', validateRegisterInput, validate,registerControl)
router.post('/login',limiter,validateLoginInput, validateLogin, loginControler)
router.post('/refresh', refreshController)
router.post('/logout', logoutController)