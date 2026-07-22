import { Booking } from '../models/Booking.js'
import { Business } from '../models/Business.js'
import { Review } from '../models/Review.js'
import { User } from '../models/User.js'
import { Conversation } from '../models/Conversation.js'
import { Parent } from '../models/Parent.js'
import { Venue } from '../models/Venue.js'
import {
  mapBusiness,
  mapConversation,
  mapParent,
  mapReview,
  mapVenue,
  mapVenueDetail,
} from '../utils/mappers.js'

export async function listVenues() {
  const rows = await Venue.find().sort({ name: 1 })
  return rows.map(mapVenue)
}

export async function getVenueBySlug(slug: string) {
  const row = await Venue.findOne({ slug })
  return row ? mapVenueDetail(row) : null
}

export async function listVenuesForBusiness(accountId: string) {
  const rows = await Venue.find({ businessId: accountId }).sort({ name: 1 })
  return rows.map(mapVenue)
}

export async function getCurrentBusiness(accountId: string) {
  const business = await Business.findById(accountId)
  if (!business) return null
  const user = await User.findById(accountId)
  if (!user) return null
  return mapBusiness(business, user.email)
}

export async function getOverview(businessId: string) {
  const business = await Business.findById(businessId)
  if (!business) return { business: null, kpi: null }

  const user = await User.findById(businessId)
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const reservations = await Booking.find({
    businessId,
    date: { $regex: `^${month}` },
    status: { $nin: ['cancelled', 'draft'] },
  })

  const revenueEur = reservations.reduce((sum, row) => sum + row.totalPriceEur, 0)
  const reviews = await Review.find({ businessId })
  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, row) => sum + row.rating, 0) / reviews.length) * 10) / 10
      : 0

  const venueCount = business.venueSlugs.length || 1
  const occupancyPct = Math.min(100, Math.round((reservations.length / (venueCount * 30 * 5)) * 100))

  return {
    business: mapBusiness(business, user?.email ?? ''),
    kpi: {
      month,
      reservations: reservations.length,
      revenueEur,
      occupancyPct,
      avgRating: avgRating || 4.8,
    },
  }
}

export async function getCurrentParent(accountId: string) {
  const parent = await Parent.findById(accountId)
  if (!parent) return null
  const user = await User.findById(accountId)
  return mapParent(parent, user?.email ?? '')
}

export async function getParentById(parentId: string) {
  const parent = await Parent.findById(parentId)
  if (!parent) return null
  const user = await User.findById(parentId)
  return mapParent(parent, user?.email ?? '')
}

export async function listConversationsByParent(parentId: string) {
  const rows = await Conversation.find({ parentId }).sort({ updatedAt: -1 })
  return rows.map(mapConversation)
}

export async function listConversationsByBusiness(businessId: string) {
  const rows = await Conversation.find({ businessId }).sort({ updatedAt: -1 })
  return rows.map(mapConversation)
}

export async function sendMessage(
  conversationId: string,
  accountId: string,
  sender: 'parent' | 'business',
  text: string,
  status?: string,
) {
  const conversation = await Conversation.findById(conversationId)
  if (!conversation) {
    throw Object.assign(new Error('Razgovor nije pronađen.'), { status: 404 })
  }

  const allowed =
    (sender === 'parent' && conversation.parentId === accountId) ||
    (sender === 'business' && conversation.businessId === accountId)
  if (!allowed) {
    throw Object.assign(new Error('Nemate ovlasti.'), { status: 403 })
  }

  const message = {
    id: `msg-${Date.now()}`,
    sender,
    text,
    sentAt: new Date(),
    status: (status ?? 'isporucena') as 'primljena' | 'isporucena' | 'pogledana',
  }

  conversation.messages.push(message)
  conversation.updatedAt = new Date()
  if (sender === 'business') {
    conversation.unreadByParent += 1
  } else {
    conversation.unreadByParent = 0
  }
  await conversation.save()

  return {
    id: message.id,
    sender: message.sender,
    text: message.text,
    sentAt: message.sentAt.toISOString(),
    status: message.status,
  }
}

export async function markConversationRead(
  conversationId: string,
  accountId: string,
  role: 'parent' | 'business',
) {
  const conversation = await Conversation.findById(conversationId)
  if (!conversation) {
    throw Object.assign(new Error('Razgovor nije pronađen.'), { status: 404 })
  }

  const allowed =
    (role === 'parent' && conversation.parentId === accountId) ||
    (role === 'business' && conversation.businessId === accountId)
  if (!allowed) {
    throw Object.assign(new Error('Nemate ovlasti.'), { status: 403 })
  }

  const senderToMark = role === 'parent' ? 'business' : 'parent'

  for (const message of conversation.messages) {
    if (message.sender === senderToMark) {
      message.status = 'pogledana'
    }
  }

  if (role === 'parent') {
    conversation.unreadByParent = 0
  }

  await conversation.save()
  return mapConversation(conversation)
}
