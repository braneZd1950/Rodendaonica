import { Router } from 'express'
import * as paymentsController from '../controllers/payments.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.get('/config', asyncHandler(paymentsController.getConfig))
router.post('/deposit', requireAuth, asyncHandler(paymentsController.createDeposit))
router.post('/interest', requireAuth, asyncHandler(paymentsController.recordInterest))

export default router
