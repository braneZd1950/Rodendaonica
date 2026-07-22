export interface ReviewOwnerReply {
  text: string
  repliedAt: string
}

export interface Review {
  id: string
  businessId: string
  venueSlug: string
  parentId: string
  parentName: string
  rating: number
  comment: string
  createdAt: string
  ownerReply?: ReviewOwnerReply
}
