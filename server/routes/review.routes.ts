import { Router } from 'express'
import * as reviewController from '../controllers/review.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { requireRole } from '../middlewares/role.middleware.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.post(
  '/:reviewId/reply',
  requireAuth,
  requireRole('business'),
  asyncHandler(reviewController.reply),
)

export default router
