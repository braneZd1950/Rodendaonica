import { Router } from 'express'
import * as businessController from '../controllers/business.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { requireRole } from '../middlewares/role.middleware.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.get('/me', requireAuth, requireRole('parent'), asyncHandler(businessController.getCurrentParent))
router.get('/:parentId', requireAuth, asyncHandler(businessController.getParentById))
router.get(
  '/:parentId/reservations',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { listByParent } = await import('../services/booking.service.js')
    if (req.auth!.role === 'parent' && req.auth!.accountId !== req.params.parentId) {
      res.status(403).json({ message: 'Nemate ovlasti.' })
      return
    }
    res.json(await listByParent(req.params.parentId))
  }),
)
router.get(
  '/:parentId/conversations',
  requireAuth,
  asyncHandler(businessController.listParentConversations),
)

export default router
