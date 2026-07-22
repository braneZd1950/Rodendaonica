import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { ROUTES } from '../../constants/routes'
import { clearPendingBooking, readPendingBooking } from '../../lib/bookingDraft'
import { getErrorMessage } from '../../lib/errors'
import { logger } from '../../lib/logger'

/**
 * Nakon prijave roditelja automatski dovršava rezervaciju spremljenu u wizardu.
 */
function PendingBookingHandler() {
  const navigate = useNavigate()
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return

    ;(async () => {
      const draft = readPendingBooking()
      if (!draft) return

      const parent = await api.parents.getCurrent()
      if (!parent) return

      processed.current = true

      try {
        await api.reservations.create({
          venueSlug: draft.venueSlug,
          date: draft.date,
          time: draft.time,
          guestCount: draft.guestCount,
          packageName: draft.packageName,
          childName: draft.childName,
          notes: draft.notes,
        })
        clearPendingBooking()
        navigate(`${ROUTES.parent.reservations}?booked=1`, { replace: true })
      } catch (error) {
        processed.current = false
        logger.warn('Nije moguće dovršiti spremljenu rezervaciju', error)
        navigate(`${ROUTES.book}?resume=1&error=${encodeURIComponent(getErrorMessage(error))}`, { replace: true })
      }
    })()
  }, [navigate])

  return null
}

export default PendingBookingHandler
