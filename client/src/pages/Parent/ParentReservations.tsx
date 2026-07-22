import { Link, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { api } from '../../api'
import { EmptyState, PageError, PageLoader } from '../../components/common/AsyncState'
import { OnlinePaymentPanel } from '../../components/payments/OnlinePaymentPanel'
import { ROUTES } from '../../constants/routes'
import { useAsyncData } from '../../hooks/useAsyncData'
import { formatCurrencyEur, formatDateHr, formatReservationStatus } from '../../lib/format'
import type { PaymentConfig, Reservation } from '../../types'

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  onlinePaymentsEnabled: false,
  provider: null,
  publishableKey: null,
}

function ParentReservations() {
  const [searchParams, setSearchParams] = useSearchParams()
  const showBookedBanner = searchParams.get('booked') === '1'

  useEffect(() => {
    if (!showBookedBanner) return
    const timer = window.setTimeout(() => {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev)
          next.delete('booked')
          return next
        },
        { replace: true },
      )
    }, 6000)
    return () => window.clearTimeout(timer)
  }, [showBookedBanner, setSearchParams])

  const { data: paymentConfig } = useAsyncData(() => api.payments.getConfig(), [])
  const config = paymentConfig ?? DEFAULT_PAYMENT_CONFIG

  const { data, loading, error, reload } = useAsyncData(async () => {
    const currentParent = await api.parents.getCurrent()
    if (!currentParent) return [] as Reservation[]
    return api.reservations.listByParent(currentParent.id)
  }, [])

  const reservations = data ?? []

  return (
    <div className="landing-page">
      <section className="parent-panel">
        <div className="landing-container">
          <div className="parent-panel__header">
            <h1>Moje rezervacije</h1>
            <Link to={ROUTES.book} className="landing-btn landing-btn--outline">
              Nova rezervacija
            </Link>
          </div>

          {showBookedBanner && (
            <div className="parent-panel__banner parent-panel__banner--success" role="status">
              Upit za rezervaciju je uspješno poslan.
              {config.onlinePaymentsEnabled
                ? ' Možete platiti akontaciju karticom ispod.'
                : ' Igraonica će vam potvrditi termin putem poruka.'}
            </div>
          )}

          {loading ? (
            <PageLoader message="Učitavanje rezervacija..." />
          ) : error ? (
            <PageError message={error} onRetry={reload} />
          ) : reservations.length === 0 ? (
            <EmptyState
              icon="🎈"
              title="Trenutno nemate rezervacija"
              description="Pronađite igraonicu i rezervirajte termin za slavlje vašeg djeteta."
              action={{ label: 'Pronađi igraonicu', to: ROUTES.venues }}
            />
          ) : (
            <div className="parent-reservations">
              {reservations.map(reservation => (
                <article key={reservation.id} className="parent-reservations__card">
                  <div className="parent-reservations__top">
                    <h3>{reservation.packageName}</h3>
                    <span className={`parent-reservations__status parent-reservations__status--${reservation.status}`}>
                      {formatReservationStatus(reservation.status, {
                        onlinePaymentsEnabled: config.onlinePaymentsEnabled,
                      })}
                    </span>
                  </div>
                  <p>
                    {formatDateHr(reservation.date)} u {reservation.time}
                  </p>
                  <p>
                    {reservation.guestCount} djece · {formatCurrencyEur(reservation.totalPriceEur)}
                    {reservation.depositEur > 0 && (
                      <> · Akontacija {formatCurrencyEur(reservation.depositEur)}</>
                    )}
                  </p>

                  {reservation.status === 'pending_payment' && (
                    <OnlinePaymentPanel
                      reservation={reservation}
                      paymentConfig={config}
                      onPaymentSuccess={reload}
                    />
                  )}

                  <Link to={ROUTES.book} className="parent-card__inline-link">
                    Ponovno rezerviraj
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ParentReservations
