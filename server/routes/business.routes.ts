import { Router } from 'express'
import * as businessController from '../controllers/business.controller.js'
import * as reviewController from '../controllers/review.controller.js'
import * as venueCatalogController from '../controllers/venueCatalog.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { requireRole } from '../middlewares/role.middleware.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.get('/me', requireAuth, requireRole('business'), asyncHandler(businessController.getMe))
router.get(
  '/me/venues',
  requireAuth,
  requireRole('business'),
  asyncHandler(venueCatalogController.listMyVenues),
)
router.get(
  '/me/venues/:slug/catalog',
  requireAuth,
  requireRole('business'),
  asyncHandler(venueCatalogController.getMyVenueCatalog),
)
router.put(
  '/me/venues/:slug/catalog',
  requireAuth,
  requireRole('business'),
  asyncHandler(venueCatalogController.updateMyVenueCatalog),
)
router.get(
  '/:businessId/overview',
  requireAuth,
  requireRole('business'),
  asyncHandler(businessController.getOverview),
)
router.get(
  '/:businessId/reservations',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { listByBusiness } = await import('../services/booking.service.js')
    if (req.auth!.role === 'business' && req.auth!.accountId !== req.params.businessId) {
      res.status(403).json({ message: 'Nemate ovlasti.' })
      return
    }
    res.json(await listByBusiness(req.params.businessId))
  }),
)
router.get(
  '/:businessId/conversations',
  requireAuth,
  requireRole('business'),
  asyncHandler(businessController.listBusinessConversations),
)
router.get(
  '/:businessId/reviews',
  requireAuth,
  requireRole('business'),
  asyncHandler(reviewController.listByBusiness),
)

export default router
