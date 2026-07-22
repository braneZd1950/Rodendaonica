import { Router } from 'express'
import * as authController from '../controllers/auth.controller.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.post('/login', asyncHandler(authController.login))
router.post('/register', asyncHandler(authController.register))
router.post('/forgot-password', asyncHandler(authController.forgotPassword))
router.post('/reset-password', asyncHandler(authController.resetPassword))

export default router
