import type { BusinessKpiSnapshot, BusinessUser } from '../../types'

export const SEED_BUSINESSES: BusinessUser[] = [
  {
    id: 'business-001',
    role: 'business',
    companyName: 'Sunce Events d.o.o.',
    contactName: 'Ivana Babić',
    oib: '86432129386',
    email: 'partner@igraonicasunce.hr',
    phone: '+385911234567',
    city: 'Zagreb',
    venueSlugs: ['igraonica-sunce'],
    plan: 'prosirena',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'business-002',
    role: 'business',
    companyName: 'Zvjezdica Party j.d.o.o.',
    contactName: 'Tomislav Marić',
    oib: '50791122315',
    email: 'hello@zvjezdica-party.hr',
    phone: '+385981112224',
    city: 'Zagreb',
    venueSlugs: ['party-room-zvjezdica'],
    plan: 'premium',
    createdAt: '2026-02-06T08:00:00.000Z',
  },
  {
    id: 'business-003',
    role: 'business',
    companyName: 'Radost Split d.o.o.',
    contactName: 'Petra Grgić',
    oib: '38192248115',
    email: 'info@radost-split.hr',
    phone: '+385951234987',
    city: 'Split',
    venueSlugs: ['rodendaonica-radost'],
    plan: 'osnovna',
    createdAt: '2026-02-18T08:00:00.000Z',
  },
]

export const SEED_BUSINESS_KPI: Record<string, BusinessKpiSnapshot> = {
  'business-001': { month: '2026-05', reservations: 26, revenueEur: 4860, occupancyPct: 82, avgRating: 4.9 },
  'business-002': { month: '2026-05', reservations: 31, revenueEur: 6820, occupancyPct: 88, avgRating: 4.7 },
  'business-003': { month: '2026-05', reservations: 19, revenueEur: 3800, occupancyPct: 73, avgRating: 4.8 },
}
