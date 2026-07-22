import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState, type FormEvent } from 'react'
import { getErrorMessage } from '../../lib/errors'

interface StripeDepositFormProps {
  clientSecret: string
  publishableKey: string
  amountEur: number
  onSuccess: () => void
  onCancel: () => void
}

function CheckoutForm({ amountEur, onSuccess, onCancel }: Omit<StripeDepositFormProps, 'publishableKey' | 'clientSecret'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setError('')
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/rezervacije?paid=1`,
        },
        redirect: 'if_required',
      })

      if (result.error) {
        setError(result.error.message ?? 'Plaćanje nije uspjelo.')
        return
      }

      if (result.paymentIntent?.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="payment-deposit-form" onSubmit={handleSubmit}>
      {error && (
        <div className="payment-panel__alert payment-panel__alert--error" role="alert">
          {error}
        </div>
      )}
      <PaymentElement />
      <div className="payment-deposit-form__actions">
        <button type="button" className="landing-btn landing-btn--outline" onClick={onCancel} disabled={submitting}>
          Odustani
        </button>
        <button type="submit" className="landing-btn landing-btn--primary" disabled={!stripe || submitting}>
          {submitting ? 'Obrada...' : `Plati akontaciju ${amountEur} €`}
        </button>
      </div>
    </form>
  )
}

export function StripeDepositForm({
  clientSecret,
  publishableKey,
  amountEur,
  onSuccess,
  onCancel,
}: StripeDepositFormProps) {
  const stripePromise = loadStripe(publishableKey)

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm amountEur={amountEur} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}
