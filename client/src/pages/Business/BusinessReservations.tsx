import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { EmptyState, PageError, PageLoader } from '../../components/common/AsyncState'
import { ROUTES } from '../../constants/routes'
import { useAsyncData } from '../../hooks/useAsyncData'
import { formatCurrencyEur, formatDateHr, formatReservationStatus } from '../../lib/format'
import type { ParentUser, ReservationStatus } from '../../types'

type StatusFilter = 'all' | ReservationStatus

function BusinessReservations() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [parents, setParents] = useState<Record<string, ParentUser | null>>({})

  const { data: business, loading: businessLoading, error: businessError, reload } = useAsyncData(
    () => api.businesses.getCurrent(),
    [],
  )

  const {
    data: reservations,
    loading: reservationsLoading,
    error: reservationsError,
    reload: reloadReservations,
  } = useAsyncData(async () => {
    if (!business) return []
    const items = await api.reservations.listByBusiness(business.id)
    const parentEntries = await Promise.all(
      [...new Set(items.map(item => item.parentId))].map(async parentId => {
        const parent = await api.parents.getById(parentId)
        return [parentId, parent] as const
      }),
    )
    setParents(Object.fromEntries(parentEntries))
    return items.sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))
  }, [business?.id])

  const filtered = useMemo(() => {
    if (!reservations) return []
    if (statusFilter === 'all') return reservations
    return reservations.filter(item => item.status === statusFilter)
  }, [reservations, statusFilter])

  const loading = businessLoading || (Boolean(business) && reservationsLoading)
  const error = businessError ?? reservationsError

  if (loading) {
    return (
      <div className="landing-page">
        <section className="business-dashboard">
          <div className="landing-container">
            <PageLoader message="Učitavanje rezervacija..." />
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="landing-page">
        <section className="business-dashboard">
          <div className="landing-container">
            <PageError message={error} onRetry={() => { reload(); reloadReservations() }} />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="landing-page">
      <section className="business-dashboard">
        <div className="landing-container">
          <div className="business-page-head business-page-head--toolbar">
            <div>
              <h1>Rezervacije</h1>
              <p>Pregled svih upita i potvrđenih termina vaše igraonice.</p>
            </div>
            <Link to={ROUTES.business.calendar} className="landing-btn landing-btn--outline">
              Otvori kalendar
            </Link>
          </div>

          <div className="business-filters">
            {(['all', 'pending_payment', 'confirmed', 'completed', 'cancelled'] as StatusFilter[]).map(
              value => (
                <button
                  key={value}
                  type="button"
                  className={`business-filters__chip ${statusFilter === value ? 'business-filters__chip--active' : ''}`}
                  onClick={() => setStatusFilter(value)}
                >
                  {value === 'all' ? 'Sve' : formatReservationStatus(value)}
                </button>
              ),
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon="📋"
              title={
                statusFilter === 'all'
                  ? 'Još nema rezervacija'
                  : 'Nema rezervacija za odabrani filter'
              }
              description={
                statusFilter === 'all'
                  ? 'Kad roditelji pošalju upit ili rezerviraju termin, pojavit će se ovdje.'
                  : 'Pokušajte odabrati drugi status ili prikažite sve rezervacije.'
              }
              action={{ label: 'Pregled kalendara', to: ROUTES.business.calendar }}
            >
              {statusFilter !== 'all' && (
                <button
                  type="button"
                  className="landing-btn landing-btn--outline"
                  onClick={() => setStatusFilter('all')}
                >
                  Prikaži sve
                </button>
              )}
            </EmptyState>
          ) : (
            <div className="business-table">
              {filtered.map(reservation => {
                const parent = parents[reservation.parentId]
                return (
                  <article key={reservation.id} className="business-table__row">
                    <div className="business-table__main">
                      <strong>
                        {parent ? `${parent.firstName} ${parent.lastName}` : 'Roditelj'}
                      </strong>
                      <span>
                        {formatDateHr(reservation.date)} · {reservation.time} · {reservation.guestCount} djece
                      </span>
                      <small>{reservation.packageName}</small>
                    </div>
                    <div className="business-table__meta">
                      <span className={`business-reservations__status business-reservations__status--${reservation.status}`}>
                        {formatReservationStatus(reservation.status)}
                      </span>
                      <strong>{formatCurrencyEur(reservation.totalPriceEur)}</strong>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BusinessReservations
