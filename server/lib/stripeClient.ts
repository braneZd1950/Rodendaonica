import Stripe from 'stripe'
import { stripeConfig } from '../config/stripe.js'

let client: Stripe | null = null

export function getStripeClient(): Stripe | null {
  if (!stripeConfig.enabled || !stripeConfig.secretKey) return null
  if (!client) {
    client = new Stripe(stripeConfig.secretKey)
  }
  return client
}
