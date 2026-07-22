import type { IBooking } from '../models/Booking.js'
import type { IBusiness } from '../models/Business.js'
import type { IConversation } from '../models/Conversation.js'
import type { IParent } from '../models/Parent.js'
import type { IReview } from '../models/Review.js'
import type { IUser } from '../models/User.js'
import type { IVenue, IVenueAddon, IVenuePackage } from '../models/Venue.js'

function mapVenuePackage(pkg: IVenuePackage) {
  return {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    durationHours: pkg.durationHours,
    basePriceEur: pkg.basePriceEur,
    ...(pkg.maxGuests != null ? { maxGuests: pkg.maxGuests } : {}),
    includedItems: pkg.includedItems,
    active: pkg.active,
    sortOrder: pkg.sortOrder,
  }
}

function mapVenueAddon(addon: IVenueAddon) {
  return {
    id: addon.id,
    name: addon.name,
    description: addon.description,
    category: addon.category,
    priceEur: addon.priceEur,
    active: addon.active,
    sortOrder: addon.sortOrder,
  }
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}

/** Sažetak za listu igraonica. */
export function mapVenue(venue: IVenue) {
  return {
    id: venue._id,
    slug: venue.slug,
    name: venue.name,
    city: venue.city,
    district: venue.district,
    rating: venue.rating,
    reviewCount: venue.reviewCount,
    priceFrom: venue.priceFrom,
    capacity: venue.capacity,
    ageFrom: venue.ageFrom,
    ageTo: venue.ageTo,
    tags: venue.tags,
    featured: venue.featured,
    privateParty: venue.privateParty,
  }
}

/** Javni detalj s aktivnim katalogom. */
export function mapVenueDetail(venue: IVenue) {
  return {
    ...mapVenue(venue),
    description: venue.description,
    images: venue.images,
    packages: sortByOrder(venue.packages.filter(pkg => pkg.active)).map(mapVenuePackage),
    addons: sortByOrder(venue.addons.filter(addon => addon.active)).map(mapVenueAddon),
  }
}

/** Puni katalog za business uređivanje. */
export function mapVenueCatalog(venue: IVenue) {
  return {
    venueSlug: venue.slug,
    description: venue.description,
    images: venue.images,
    packages: sortByOrder(venue.packages).map(mapVenuePackage),
    addons: sortByOrder(venue.addons).map(mapVenueAddon),
  }
}

export function mapParent(parent: IParent, email: string) {
  return {
    id: parent._id,
    role: 'parent' as const,
    firstName: parent.firstName,
    lastName: parent.lastName,
    email,
    phone: parent.phone,
    city: parent.city,
    createdAt: parent.createdAt.toISOString(),
    children: parent.children.map(child => ({
      id: child.id,
      name: child.name,
      birthYear: child.birthYear,
      interests: child.interests,
      ...(child.allergies?.length ? { allergies: child.allergies } : {}),
    })),
    favoriteVenueSlugs: parent.favoriteVenueSlugs,
  }
}

export function mapBusiness(business: IBusiness, email: string) {
  return {
    id: business._id,
    role: 'business' as const,
    companyName: business.companyName,
    contactName: business.contactName,
    oib: business.oib,
    email,
    phone: business.phone,
    city: business.city,
    venueSlugs: business.venueSlugs,
    plan: business.plan,
    createdAt: business.createdAt.toISOString(),
  }
}

export function mapBooking(booking: IBooking) {
  return {
    id: booking._id,
    parentId: booking.parentId,
    venueSlug: booking.venueSlug,
    businessId: booking.businessId,
    childName: booking.childName,
    date: booking.date,
    time: booking.time,
    packageName: booking.packageName,
    guestCount: booking.guestCount,
    totalPriceEur: booking.totalPriceEur,
    depositEur: booking.depositEur,
    status: booking.status,
    addons: booking.addons,
    ...(booking.notes ? { notes: booking.notes } : {}),
    createdAt: booking.createdAt.toISOString(),
  }
}

export function mapConversation(conversation: IConversation) {
  return {
    id: conversation._id,
    parentId: conversation.parentId,
    businessId: conversation.businessId,
    venueSlug: conversation.venueSlug,
    venueName: conversation.venueName,
    updatedAt: conversation.updatedAt.toISOString(),
    unreadByParent: conversation.unreadByParent,
    messages: [...conversation.messages]
      .sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime())
      .map(msg => ({
        id: msg.id,
        sender: msg.sender,
        text: msg.text,
        sentAt: msg.sentAt.toISOString(),
        ...(msg.status ? { status: msg.status } : {}),
      })),
  }
}

export function mapReview(review: IReview) {
  return {
    id: review._id,
    businessId: review.businessId,
    venueSlug: review.venueSlug,
    parentId: review.parentId,
    parentName: review.parentName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
    ...(review.ownerReplyText && review.ownerReplyAt
      ? {
          ownerReply: {
            text: review.ownerReplyText,
            repliedAt: review.ownerReplyAt.toISOString(),
          },
        }
      : {}),
  }
}

export function buildAuthResult(
  user: IUser,
  rememberMe: boolean,
  accessToken: string,
) {
  return {
    account: {
      id: user._id,
      role: user.role,
      email: user.email,
      displayName: user.displayName,
    },
    session: {
      accountId: user._id,
      role: user.role,
      email: user.email,
      rememberMe,
      loginAt: new Date().toISOString(),
      accessToken,
    },
  }
}
