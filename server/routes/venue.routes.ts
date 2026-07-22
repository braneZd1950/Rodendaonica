import { Router } from 'express'
import * as businessController from '../controllers/business.controller.js'
import * as bookingController from '../controllers/booking.controller.js'
import { asyncHandler } from '../middlewares/error.middleware.js'

const router = Router()

router.get('/', asyncHandler(businessController.listVenues))
router.get('/:slug/busy-slots', asyncHandler(bookingController.getBusySlots))
router.get('/:slug', asyncHandler(businessController.getVenue))

export default router
