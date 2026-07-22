import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { PageLoader } from '../../components/common/AsyncState'
import { ROUTES } from '../../constants/routes'
import {
  formatCurrencyEur,
  formatDateHr,
  formatPlanTier,
  formatReservationStatus,
} from '../../lib/format'
import type { BusinessKpiSnapshot, BusinessUser, Reservation } from '../../types'

interface SlotItem {
  date: string
  hour: string
  status: 'slobodno' | 'zauzeto'
  reservation?: Reservation
}

const QUICK_ACTIONS = [
  { to: ROUTES.business.calendar, label: 'Kalendar', icon: '📅' },
  { to: ROUTES.business.reservations, label: 'Rezervacije', icon: '📋' },
  { to: ROUTES.business.messages, label: 'Poruke', icon: '💬' },
  { to: ROUTES.business.reviews, label: 'Recenzije', icon: '⭐' },
  { to: ROUTES.business.catalog, label: 'Katalog', icon: '📦' },
  { to: ROUTES.business.settings, label: 'Postavke', icon: '⚙️' },
] as const

function buildSlots(reservations: Reservation[]): SlotItem[] {
  const today = new Date()
  const days = [0, 1, 2]
  const hours = ['10:00', '12:00', '14:00', '16:00', '18:00']
  const slots: SlotItem[] = []

  for (const dayOffset of days) {
    const date = new Date(today)
    date.setDate(today.getDate() + dayOffset)
    const dateKey = date.toISOString().slice(0, 10)

    for (const hour of hours) {
      const reservation = reservations.find(
        item =>
          item.date === dateKey &&
          item.time === hour &&
          item.status !== 'cancelled' &&
          item.status !== 'draft',
      )

      slots.push({
        date: dateKey,
        hour,
        status: reservation ? 'zauzeto' : 'slobodno',
        reservation,
      })
    }
  }

  return slots
}

function companyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

function dayHeading(dateKey: string) {
  const date = new Date(`${dateKey}T12:00:00`)
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Danas'
  if (date.toDateString() === tomorrow.toDateString()) return 'Sutra'

  return date.toLocaleDateString('hr-HR', { weekday: 'long' })
}

function groupSlotsByDay(slots: SlotItem[]) {
  const grouped = new Map<string, SlotItem[]>()

  for (const slot of slots) {
    const daySlots = grouped.get(slot.date) ?? []
    daySlots.push(slot)
    grouped.set(slot.date, daySlots)
  }

  return Array.from(grouped.entries())
}

function BusinessDashboard() {
  const [business, setBusiness] = useState<BusinessUser | null>(null)
  const [kpi, setKpi] = useState<BusinessKpiSnapshot | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const currentBusiness = await api.businesses.getCurrent()
      if (!currentBusiness) {
        setLoading(false)
        return
      }

      const [overview, businessReservations] = await Promise.all([
        api.businesses.getOverview(currentBusiness.id),
        api.reservations.listByBusiness(currentBusiness.id),
      ])

      setBusiness(overview.business)
      setKpi(overview.kpi)
      setReservations(
        businessReservations.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)),
      )
      setLoading(false)
    })()
  }, [])

  const slots = useMemo(() => buildSlots(reservations), [reservations])
  const slotsByDay = useMemo(() => groupSlotsByDay(slots), [slots])
  const freeSlots = slots.filter(slot => slot.status === 'slobodno').length
  const occupiedSlots = slots.length - freeSlots

  const upcomingReservations = useMemo(
    () => reservations.filter(reservation => reservation.status !== 'cancelled' && reservation.status !== 'draft'),
    [reservations],
  )

  const pendingPaymentCount = useMemo(
    () => upcomingReservations.filter(reservation => reservation.status === 'pending_payment').length,
    [upcomingReservations],
  )

  const recentReservations = useMemo(() => {
    return [...upcomingReservations]
      .sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`))
      .slice(0, 5)
  }, [upcomingReservations])

  if (loading) {
    return (
      <div className="landing-page biz-dash-page">
        <section className="biz-dash">
          <div className="landing-container">
            <PageLoader message="Učitavanje upravljačke ploče..." />
          </div>
        </section>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="landing-page biz-dash-page">
        <section className="biz-dash">
          <div className="landing-container">
            <div className="biz-dash__empty">
              <p>Nismo pronašli podatke za vašu igraonicu.</p>
              <Link to={ROUTES.logout} className="landing-btn landing-btn--outline">
                Odjava
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="landing-page biz-dash-page">
      <section className="biz-dash">
        <div className="landing-container">
          <header className="biz-dash__hero">
            <div className="biz-dash__avatar" aria-hidden>
              {companyInitials(business.companyName)}
            </div>

            <div className="biz-dash__intro">
              <p className="biz-dash__eyebrow">Upravljačka ploča</p>
              <h1>{business.companyName}</h1>
              <div className="biz-dash__meta">
                <span>{business.contactName}</span>
                <span>{business.city}</span>
              </div>
            </div>

            <div className="biz-dash__hero-side">
              <span className="biz-dash__plan">{formatPlanTier(business.plan)}</span>
              {pendingPaymentCount > 0 && (
                <Link to={ROUTES.business.reservations} className="biz-dash__alert">
                  {pendingPaymentCount} {pendingPaymentCount === 1 ? 'rezervacija' : 'rezervacije'} čeka uplatu
                </Link>
              )}
            </div>
          </header>

          <div className="biz-dash__kpis">
            <article className="biz-dash__kpi">
              <span className="biz-dash__kpi-icon" aria-hidden>
                📋
              </span>
              <div>
                <p className="biz-dash__kpi-label">Rezervacije (mjesec)</p>
                <strong className="biz-dash__kpi-value">{kpi?.reservations ?? 0}</strong>
              </div>
            </article>

            <article className="biz-dash__kpi">
              <span className="biz-dash__kpi-icon" aria-hidden>
                💶
              </span>
              <div>
                <p className="biz-dash__kpi-label">Prihod (mjesec)</p>
                <strong className="biz-dash__kpi-value">{formatCurrencyEur(kpi?.revenueEur ?? 0)}</strong>
              </div>
            </article>

            <article className="biz-dash__kpi">
              <span className="biz-dash__kpi-icon" aria-hidden>
                📊
              </span>
              <div>
                <p className="biz-dash__kpi-label">Popunjenost</p>
                <strong className="biz-dash__kpi-value">{kpi?.occupancyPct ?? 0}%</strong>
              </div>
            </article>

            <article className="biz-dash__kpi">
              <span className="biz-dash__kpi-icon" aria-hidden>
                ⭐
              </span>
              <div>
                <p className="biz-dash__kpi-label">Prosječna ocjena</p>
                <strong className="biz-dash__kpi-value">{kpi?.avgRating.toFixed(1) ?? '0.0'}</strong>
              </div>
            </article>
          </div>

          <div className="biz-dash__toolbar">
            <div className="biz-dash__stats">
              <div className="biz-dash__stat">
                <span className="biz-dash__stat-label">Sljedeća 3 dana</span>
                <span className="biz-dash__stat-value">
                  <strong className="biz-dash__stat-free">{freeSlots}</strong> slobodno ·{' '}
                  <strong className="biz-dash__stat-busy">{occupiedSlots}</strong> zauzeto
                </span>
              </div>
              <div className="biz-dash__stat">
                <span className="biz-dash__stat-label">Aktivne rezervacije</span>
                <span className="biz-dash__stat-value">
                  <strong>{upcomingReservations.length}</strong>
                </span>
              </div>
            </div>

            <nav className="biz-dash__actions" aria-label="Brze akcije">
              {QUICK_ACTIONS.map(action => (
                <Link key={action.to} to={action.to} className="biz-dash__action">
                  <span aria-hidden>{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="biz-dash__grid">
            <article className="biz-dash__panel">
              <header className="biz-dash__panel-head">
                <div>
                  <h2>Raspored termina</h2>
                  <p>Pregled sljedeća 3 dana · 5 termina dnevno</p>
                </div>
                <Link to={ROUTES.business.calendar} className="biz-dash__panel-link">
                  Otvori kalendar
                </Link>
              </header>

              <div className="biz-dash__schedule">
                {slotsByDay.map(([dateKey, daySlots]) => (
                  <section key={dateKey} className="biz-dash__day">
                    <header className="biz-dash__day-head">
                      <strong>{dayHeading(dateKey)}</strong>
                      <span>{formatDateHr(dateKey)}</span>
                    </header>

                    <div className="biz-dash__day-slots">
                      {daySlots.map(slot => (
                        <div
                          key={`${slot.date}-${slot.hour}`}
                          className={`biz-dash__slot biz-dash__slot--${slot.status}`}
                          title={
                            slot.reservation
                              ? `${slot.reservation.childName} · ${formatReservationStatus(slot.reservation.status)}`
                              : undefined
                          }
                        >
                          <time dateTime={`${slot.date}T${slot.hour}`}>{slot.hour}</time>
                          <span>{slot.status === 'slobodno' ? 'Slobodno' : slot.reservation?.childName ?? 'Zauzeto'}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>

            <article className="biz-dash__panel">
              <header className="biz-dash__panel-head">
                <div>
                  <h2>Nadolazeće rezervacije</h2>
                  <p>Zadnji upiti i potvrđeni termini</p>
                </div>
                <Link to={ROUTES.business.reservations} className="biz-dash__panel-link">
                  Sve rezervacije
                </Link>
              </header>

              {recentReservations.length === 0 ? (
                <div className="biz-dash__panel-empty">
                  <p>Trenutno nema aktivnih rezervacija.</p>
                  <Link to={ROUTES.business.calendar} className="landing-btn landing-btn--outline">
                    Pregledaj kalendar
                  </Link>
                </div>
              ) : (
                <ul className="biz-dash__reservations">
                  {recentReservations.map(reservation => (
                    <li key={reservation.id} className="biz-dash__reservation">
                      <div className="biz-dash__reservation-main">
                        <strong>{reservation.childName}</strong>
                        <span>
                          {formatDateHr(reservation.date)} · {reservation.time} · {reservation.packageName}
                        </span>
                      </div>
                      <span
                        className={`biz-dash__status biz-dash__status--${reservation.status}`}
                      >
                        {formatReservationStatus(reservation.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BusinessDashboard
