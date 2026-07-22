import { Business } from '../models/Business.js'
import { User } from '../models/User.js'
import { Venue } from '../models/Venue.js'
import { env } from '../config/env.js'
import * as templates from '../lib/email/templates.js'
import { sendEmail } from './email.service.js'

function logNotificationError(context: string, error: unknown) {
  console.error(`[notification] ${context}:`, error)
}

export async function sendPasswordResetNotification(email: string, resetUrl: string) {
  const content = templates.passwordResetEmail(resetUrl)
  await sendEmail({ to: email, ...content })
}

export async function notifyBookingCreated(booking: {
  id: string
  parentId: string
  businessId: string
  venueSlug: string
  childName: string
  date: string
  time: string
  packageName: string
  guestCount: number
  totalPriceEur: number
  depositEur: number
  notes?: string
}) {
  try {
    const [parentUser, businessUser, business, venue] = await Promise.all([
      User.findById(booking.parentId).select('email displayName'),
      User.findById(booking.businessId).select('email displayName'),
      Business.findById(booking.businessId).select('companyName'),
      Venue.findOne({ slug: booking.venueSlug }).select('name'),
    ])

    const venueName = venue?.name ?? booking.venueSlug
    const parentReservationsUrl = `${env.appUrl}/rezervacije`
    const businessReservationsUrl = `${env.appUrl}/poslovne-rezervacije`

    const tasks: Promise<void>[] = []

    if (parentUser?.email) {
      const content = templates.bookingReceivedParentEmail({
        parentName: parentUser.displayName,
        venueName,
        childName: booking.childName,
        date: booking.date,
        time: booking.time,
        packageName: booking.packageName,
        totalPriceEur: booking.totalPriceEur,
        depositEur: booking.depositEur,
        reservationsUrl: parentReservationsUrl,
      })
      tasks.push(sendEmail({ to: parentUser.email, ...content }))
    }

    const businessEmail = businessUser?.email
    if (businessEmail) {
      const content = templates.bookingReceivedBusinessEmail({
        companyName: business?.companyName ?? businessUser?.displayName ?? 'Igraonica',
        venueName,
        childName: booking.childName,
        date: booking.date,
        time: booking.time,
        packageName: booking.packageName,
        guestCount: booking.guestCount,
        totalPriceEur: booking.totalPriceEur,
        notes: booking.notes,
        reservationsUrl: businessReservationsUrl,
      })
      tasks.push(sendEmail({ to: businessEmail, ...content }))
    }

    await Promise.all(tasks)
  } catch (error) {
    logNotificationError(`booking ${booking.id}`, error)
  }
}
