import { Router } from 'express'
import * as businessController from '../controllers/business.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.post(
  '/:conversationId/messages',
  requireAuth,
  asyncHandler(businessController.sendMessage),
)

router.post(
  '/:conversationId/read',
  requireAuth,
  asyncHandler(businessController.markConversationRead),
)

export default router
