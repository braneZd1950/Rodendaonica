export type BusinessPlanTier = 'osnovna' | 'prosirena' | 'premium'

export interface BusinessUser {
  id: string
  role: 'business'
  companyName: string
  contactName: string
  oib: string
  email: string
  phone: string
  city: string
  venueSlugs: string[]
  plan: BusinessPlanTier
  createdAt: string
}

export interface BusinessKpiSnapshot {
  month: string
  reservations: number
  revenueEur: number
  occupancyPct: number
  avgRating: number
}

export interface BusinessOverview {
  business: BusinessUser | null
  kpi: BusinessKpiSnapshot | null
}
