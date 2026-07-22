import type { BusinessUser } from '../../types'
import { SEED_BUSINESSES } from '../data/businesses.seed'

const dynamicBusinesses = new Map<string, BusinessUser>()

export const mockBusinessStore = {
  getById(id: string): BusinessUser | null {
    return dynamicBusinesses.get(id) ?? null
  },

  getAll(): BusinessUser[] {
    return [...dynamicBusinesses.values()]
  },

  isOibTaken(oib: string): boolean {
    const normalized = oib.trim()
    if (SEED_BUSINESSES.some(item => item.oib === normalized)) return true
    return Array.from(dynamicBusinesses.values()).some(item => item.oib === normalized)
  },

  add(business: BusinessUser) {
    dynamicBusinesses.set(business.id, business)
  },
}
