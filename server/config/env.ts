import 'dotenv/config'

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`Missing environment variable: ${name}`)
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: required('MONGO_URI'),
  /** Automatski pokreni seed ako je baza prazna (korisno uz MONGO_URI=memory). */
  autoSeed: process.env.AUTO_SEED === 'true',
  jwtSecret: required('JWT_SECRET', 'dev-secret-promijeni-u-produkciji'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  /** Eksplicitno uključivanje — ključevi sami po sebi ne aktiviraju plaćanje. */
  stripeEnabled: process.env.STRIPE_ENABLED === 'true',
  isDev: process.env.NODE_ENV !== 'production',
  appUrl: process.env.APP_URL ?? 'http://localhost:5173',
  emailFrom: process.env.EMAIL_FROM ?? 'Rodendaonica <noreply@rodendaonica.hr>',
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
} as const
