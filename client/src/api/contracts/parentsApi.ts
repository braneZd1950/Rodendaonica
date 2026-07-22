import type { ParentUser } from '../../types'

export interface ParentsApi {
  getCurrent(): Promise<ParentUser | null>
  getById(parentId: string): Promise<ParentUser | null>
}
