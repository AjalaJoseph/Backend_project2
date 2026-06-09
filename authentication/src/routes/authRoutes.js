import express from 'express'
import { registerControl, loginControler, refreshController, logoutController, getuserData } from '../controllers/authController.js'
import { limiter } from '../middlewares/rate.js'
import { protectUser } from '../middlewares/protecRoute.js'
import { idempotencyGuard } from '../middlewares/idempotencyMiddleware.js'
import { 
    validateRegisterInput, 
    validate, 
    validateLogin, 
    validateLoginInput, 
    validatePasswordInput,
     validatePassword } from '../validators/authValidator.js'
export const router = express.Router()
router.post('/register',idempotencyGuard, validateRegisterInput, validate,registerControl)
router.post('/login',idempotencyGuard,limiter,validateLoginInput, validateLogin, loginControler)
router.post('/refresh', refreshController)
router.post('/logout', logoutController)
router.get('/profile', protectUser,getuserData)
router.patch('/change-password',idempotencyGuard, limiter,protectUser,validatePasswordInput, validatePassword,)