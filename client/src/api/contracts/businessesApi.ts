import type { BusinessOverview, BusinessUser, UpdateVenueCatalogInput, Venue, VenueCatalog } from '../../types'

export interface BusinessesApi {
  getCurrent(): Promise<BusinessUser | null>
  getOverview(businessId: string): Promise<BusinessOverview>
  listMyVenues(): Promise<Venue[]>
  getVenueCatalog(venueSlug: string): Promise<VenueCatalog | null>
  updateVenueCatalog(venueSlug: string, input: UpdateVenueCatalogInput): Promise<VenueCatalog>
}
