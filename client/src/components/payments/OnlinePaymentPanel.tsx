import { useState } from 'react'
import { api } from '../../api'
import { formatCurrencyEur } from '../../lib/format'
import { getErrorMessage } from '../../lib/errors'
import type { OnlinePaymentInterestLevel, PaymentConfig, Reservation } from '../../types'
import { StripeDepositForm } from './StripeDepositForm'

interface OnlinePaymentPanelProps {
  reservation: Reservation
  paymentConfig: PaymentConfig
  onInterestRecorded?: (level: OnlinePaymentInterestLevel) => void
  onPaymentSuccess?: () => void
}

const INTEREST_LABELS: Record<OnlinePaymentInterestLevel, string> = {
  yes: 'Da, platit ću karticom',
  maybe: 'Možda',
  no: 'Ne, radije dogovor s igraonicom',
}

export function OnlinePaymentPanel({
  reservation,
  paymentConfig,
  onInterestRecorded,
  onPaymentSuccess,
}: OnlinePaymentPanelProps) {
  const [interest, setInterest] = useState<OnlinePaymentInterestLevel | null>(null)
  const [interestSaving, setInterestSaving] = useState(false)
  const [interestDone, setInterestDone] = useState(false)
  const [interestError, setInterestError] = useState('')
  const [depositLoading, setDepositLoading] = useState(false)
  const [depositError, setDepositError] = useState('')
  const [checkout, setCheckout] = useState<{
    clientSecret: string
    publishableKey: string
    amountEur: number
  } | null>(null)

  async function submitInterest(level: OnlinePaymentInterestLevel) {
    setInterest(level)
    setInterestSaving(true)
    setInterestError('')
    try {
      await api.payments.recordInterest({
        reservationId: reservation.id,
        interest: level,
      })
      setInterestDone(true)
      onInterestRecorded?.(level)
    } catch (err) {
      setInterestError(getErrorMessage(err))
    } finally {
      setInterestSaving(false)
    }
  }

  async function startDeposit() {
    setDepositLoading(true)
    setDepositError('')
    try {
      const result = await api.payments.createDeposit(reservation.id)
      if (!result.enabled) {
        setDepositError(result.message ?? 'Online plaćanje trenutno nije dostupno.')
        return
      }
      if (!result.clientSecret || !paymentConfig.publishableKey || result.amountEur == null) {
        setDepositError('Plaćanje nije ispravno konfigurirano.')
        return
      }
      setCheckout({
        clientSecret: result.clientSecret,
        publishableKey: paymentConfig.publishableKey,
        amountEur: result.amountEur,
      })
    } catch (err) {
      setDepositError(getErrorMessage(err))
    } finally {
      setDepositLoading(false)
    }
  }

  if (checkout) {
    return (
      <div className="payment-panel">
        <h4>Plaćanje akontacije</h4>
        <StripeDepositForm
          clientSecret={checkout.clientSecret}
          publishableKey={checkout.publishableKey}
          amountEur={checkout.amountEur}
          onSuccess={() => {
            setCheckout(null)
            onPaymentSuccess?.()
          }}
          onCancel={() => setCheckout(null)}
        />
      </div>
    )
  }

  if (!paymentConfig.onlinePaymentsEnabled) {
    return (
      <div className="payment-panel payment-panel--preview">
        <div className="payment-panel__badge">Uskoro</div>
        <h4>Online plaćanje akontacije</h4>
        <p>
          Trenutno šaljete <strong>upit bez kartice</strong>. Igraonica potvrđuje termin i dogovara uplatu
          izravno s vama. Pripremamo sigurno online plaćanje — vaš odgovor nam pomaže odlučiti kada ga
          uključiti.
        </p>
        <p className="payment-panel__deposit">
          Predviđena akontacija: <strong>{formatCurrencyEur(reservation.depositEur)}</strong>
        </p>

        {interestDone ? (
          <p className="payment-panel__thanks" role="status">
            Hvala na povratnoj informaciji!
          </p>
        ) : (
          <>
            <p className="payment-panel__question">Želite li platiti akontaciju karticom kad bude dostupno?</p>
            <div className="payment-panel__choices">
              {(['yes', 'maybe', 'no'] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  className={`payment-panel__choice ${interest === level ? 'payment-panel__choice--active' : ''}`}
                  onClick={() => submitInterest(level)}
                  disabled={interestSaving}
                >
                  {INTEREST_LABELS[level]}
                </button>
              ))}
            </div>
          </>
        )}

        {interestError && (
          <div className="payment-panel__alert payment-panel__alert--error" role="alert">
            {interestError}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="payment-panel payment-panel--active">
      <h4>Akontacija</h4>
      <p>
        Potvrdite rezervaciju uplatom akontacije od{' '}
        <strong>{formatCurrencyEur(reservation.depositEur)}</strong>.
      </p>
      {depositError && (
        <div className="payment-panel__alert payment-panel__alert--error" role="alert">
          {depositError}
        </div>
      )}
      <button
        type="button"
        className="landing-btn landing-btn--primary"
        onClick={startDeposit}
        disabled={depositLoading}
      >
        {depositLoading ? 'Priprema...' : `Plati ${formatCurrencyEur(reservation.depositEur)}`}
      </button>
    </div>
  )
}
