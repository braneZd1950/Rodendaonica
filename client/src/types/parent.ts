export interface ChildProfile {
  id: string
  name: string
  birthYear: number
  interests: string[]
  allergies?: string[]
}

export interface ParentUser {
  id: string
  role: 'parent'
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  createdAt: string
  children: ChildProfile[]
  favoriteVenueSlugs: string[]
}
