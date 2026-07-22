import { env } from './env.js'

/** Stripe — aktivno samo uz STRIPE_ENABLED=true i valjane ključeve. */
export const stripeConfig = {
  enabled:
    env.stripeEnabled && Boolean(env.stripeSecretKey) && Boolean(env.stripePublishableKey),
  secretKey: env.stripeSecretKey,
  publishableKey: env.stripePublishableKey,
  webhookSecret: env.stripeWebhookSecret,
} as const
