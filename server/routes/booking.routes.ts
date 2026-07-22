import { Router } from 'express'
import * as bookingController from '../controllers/booking.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { requireRole } from '../middlewares/role.middleware.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.get('/:id', requireAuth, asyncHandler(bookingController.getById))
router.post('/', requireAuth, requireRole('parent'), asyncHandler(bookingController.create))

export default router
