import type Stripe from 'stripe'
import { Booking } from '../models/Booking.js'
import { OnlinePaymentInterest } from '../models/OnlinePaymentInterest.js'
import { Payment } from '../models/Payment.js'
import { stripeConfig } from '../config/stripe.js'
import { getStripeClient } from '../lib/stripeClient.js'

const DISABLED_MESSAGE =
  'Online plaćanje trenutno nije aktivirano. Igraonica će potvrditi termin i dogovoriti uplatu akontacije izravno s vama.'

export function getPublicConfig() {
  return {
    onlinePaymentsEnabled: stripeConfig.enabled,
    provider: stripeConfig.enabled ? ('stripe' as const) : null,
    publishableKey: stripeConfig.enabled ? stripeConfig.publishableKey : null,
  }
}

export async function createDepositIntent(parentId: string, bookingId: string) {
  const booking = await Booking.findById(bookingId)
  if (!booking) {
    throw Object.assign(new Error('Rezervacija nije pronađena.'), { status: 404 })
  }
  if (booking.parentId !== parentId) {
    throw Object.assign(new Error('Nemate ovlasti.'), { status: 403 })
  }
  if (booking.status !== 'pending_payment') {
    throw Object.assign(new Error('Ova rezervacija ne čeka uplatu akontacije.'), { status: 400 })
  }

  if (!stripeConfig.enabled) {
    return {
      enabled: false as const,
      message: DISABLED_MESSAGE,
    }
  }

  const stripe = getStripeClient()
  if (!stripe) {
    throw Object.assign(new Error('Plaćanje nije konfigurirano.'), { status: 503 })
  }

  const existingPayment = await Payment.findOne({ bookingId })
  if (existingPayment?.status === 'captured') {
    throw Object.assign(new Error('Akontacija je već plaćena.'), { status: 409 })
  }

  let paymentIntent: Stripe.PaymentIntent

  if (existingPayment?.providerRef) {
    paymentIntent = await stripe.paymentIntents.retrieve(existingPayment.providerRef)
    if (paymentIntent.status === 'succeeded') {
      throw Object.assign(new Error('Akontacija je već plaćena.'), { status: 409 })
    }
  } else {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.depositEur * 100),
      currency: 'eur',
      metadata: {
        bookingId: booking._id,
        parentId,
      },
      automatic_payment_methods: { enabled: true },
    })
  }

  const payment = await Payment.findOneAndUpdate(
    { bookingId },
    {
      _id: existingPayment?._id ?? `pay-${Date.now()}`,
      bookingId,
      amountEur: booking.depositEur,
      currency: 'EUR',
      status: 'pending',
      provider: 'stripe',
      providerRef: paymentIntent.id,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  if (!paymentIntent.client_secret) {
    throw new Error('Stripe nije vratio client secret.')
  }

  return {
    enabled: true as const,
    paymentId: payment._id,
    clientSecret: paymentIntent.client_secret,
    amountEur: booking.depositEur,
  }
}

export async function recordPaymentInterest(
  parentId: string,
  input: {
    reservationId?: string
    interest: 'yes' | 'maybe' | 'no'
    comment?: string
  },
) {
  if (input.reservationId) {
    const booking = await Booking.findById(input.reservationId)
    if (!booking) {
      throw Object.assign(new Error('Rezervacija nije pronađena.'), { status: 404 })
    }
    if (booking.parentId !== parentId) {
      throw Object.assign(new Error('Nemate ovlasti.'), { status: 403 })
    }
  }

  const id = input.reservationId
    ? `interest-${parentId}-${input.reservationId}`
    : `interest-${parentId}-general`

  const record = await OnlinePaymentInterest.findOneAndUpdate(
    { _id: id },
    {
      _id: id,
      parentId,
      reservationId: input.reservationId,
      interest: input.interest,
      comment: input.comment?.trim() || undefined,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  return {
    ok: true as const,
    interest: record.interest,
  }
}

export async function handleStripeWebhook(rawBody: Buffer, signature: string | undefined) {
  if (!stripeConfig.enabled) {
    throw Object.assign(new Error('Webhook nije aktivan.'), { status: 503 })
  }
  if (!stripeConfig.webhookSecret) {
    throw Object.assign(new Error('Webhook secret nije konfiguriran.'), { status: 503 })
  }
  if (!signature) {
    throw Object.assign(new Error('Nedostaje Stripe-Signature header.'), { status: 400 })
  }

  const stripe = getStripeClient()
  if (!stripe) {
    throw Object.assign(new Error('Stripe nije konfiguriran.'), { status: 503 })
  }

  const event = stripe.webhooks.constructEvent(rawBody, signature, stripeConfig.webhookSecret)

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent
    const bookingId = intent.metadata.bookingId
    if (bookingId) {
      await Payment.updateOne(
        { bookingId },
        { status: 'captured', providerRef: intent.id },
      )
      await Booking.updateOne({ _id: bookingId }, { status: 'confirmed' })
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as Stripe.PaymentIntent
    const bookingId = intent.metadata.bookingId
    if (bookingId) {
      await Payment.updateOne({ bookingId }, { status: 'failed', providerRef: intent.id })
    }
  }

  return { received: true }
}
