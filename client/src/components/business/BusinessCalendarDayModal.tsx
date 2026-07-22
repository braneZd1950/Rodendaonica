import { useEffect } from 'react'
import {
  formatCurrencyEur,
  formatReservationStatus,
} from '../../lib/format'
import type { ParentUser, Reservation } from '../../types'

interface BusinessCalendarDayModalProps {
  dateKey: string
  reservations: Reservation[]
  parentById: Record<string, ParentUser | null>
  parentsLoading: boolean
  onClose: () => void
}

function formatDayTitle(dateKey: string) {
  const label = new Date(`${dateKey}T12:00:00`).toLocaleDateString('hr-HR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return label.charAt(0).toUpperCase() + label.slice(1)
}

function parentName(parent: ParentUser | null | undefined) {
  if (!parent) return 'Nepoznat klijent'
  return `${parent.firstName} ${parent.lastName}`.trim()
}

function BusinessCalendarDayModal({
  dateKey,
  reservations,
  parentById,
  parentsLoading,
  onClose,
}: BusinessCalendarDayModalProps) {
  const sorted = [...reservations].sort((a, b) => a.time.localeCompare(b.time))

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="biz-cal-modal" role="dialog" aria-modal="true" aria-labelledby="biz-cal-modal-title" onClick={onClose}>
      <div className="biz-cal-modal__card" onClick={event => event.stopPropagation()}>
        <header className="biz-cal-modal__head">
          <div>
            <p className="biz-cal-modal__eyebrow">Rezervacije za dan</p>
            <h2 id="biz-cal-modal-title">{formatDayTitle(dateKey)}</h2>
            <p className="biz-cal-modal__meta">
              {sorted.length === 0
                ? 'Nema rezervacija'
                : `${sorted.length} ${sorted.length === 1 ? 'termin' : 'termina'}`}
            </p>
          </div>
          <button type="button" className="biz-cal-modal__close" onClick={onClose} aria-label="Zatvori">
            <svg className="biz-cal-modal__close-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </header>

        {sorted.length === 0 ? (
          <div className="biz-cal-modal__empty">
            <p>Za ovaj datum nema aktivnih rezervacija.</p>
          </div>
        ) : (
          <ul className="biz-cal-modal__list">
            {sorted.map(reservation => {
              const parent = parentById[reservation.parentId]

              return (
                <li key={reservation.id} className="biz-cal-modal__item">
                  <header className="biz-cal-modal__item-head">
                    <div>
                      <time className="biz-cal-modal__time" dateTime={`${reservation.date}T${reservation.time}`}>
                        {reservation.time}
                      </time>
                      <p className="biz-cal-modal__package">{reservation.packageName}</p>
                    </div>
                    <span className={`biz-cal-modal__status biz-cal-modal__status--${reservation.status}`}>
                      {formatReservationStatus(reservation.status)}
                    </span>
                  </header>

                  <dl className="biz-cal-modal__details">
                    <div className="biz-cal-modal__row">
                      <dt>Klijent</dt>
                      <dd>{parentsLoading && !parent ? 'Učitavanje…' : parentName(parent)}</dd>
                    </div>

                    <div className="biz-cal-modal__row">
                      <dt>Slavljenik</dt>
                      <dd>{reservation.childName}</dd>
                    </div>

                    <div className="biz-cal-modal__row">
                      <dt>Telefon</dt>
                      <dd>
                        {parent?.phone ? (
                          <a href={`tel:${parent.phone.replace(/\s/g, '')}`}>{parent.phone}</a>
                        ) : (
                          '—'
                        )}
                      </dd>
                    </div>

                    <div className="biz-cal-modal__row">
                      <dt>E-mail</dt>
                      <dd>
                        {parent?.email ? (
                          <a href={`mailto:${parent.email}`}>{parent.email}</a>
                        ) : (
                          '—'
                        )}
                      </dd>
                    </div>

                    <div className="biz-cal-modal__row">
                      <dt>Broj djece</dt>
                      <dd>{reservation.guestCount}</dd>
                    </div>
                  </dl>

                  {reservation.addons.length > 0 && (
                    <div className="biz-cal-modal__addons">
                      <p className="biz-cal-modal__addons-label">Dodaci</p>
                      <ul className="biz-cal-modal__addon-list">
                        {reservation.addons.map(addon => (
                          <li key={addon.id} className="biz-cal-modal__addon">
                            {addon.name}
                            <span>{formatCurrencyEur(addon.priceEur)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(reservation.notes || reservation.totalPriceEur > 0) && (
                    <footer className="biz-cal-modal__footer">
                      {reservation.notes && (
                        <p className="biz-cal-modal__notes">
                          <strong>Napomena:</strong> {reservation.notes}
                        </p>
                      )}
                      <p className="biz-cal-modal__price">
                        Ukupno {formatCurrencyEur(reservation.totalPriceEur)}
                        {reservation.depositEur > 0 && (
                          <span> · Kapara {formatCurrencyEur(reservation.depositEur)}</span>
                        )}
                      </p>
                    </footer>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default BusinessCalendarDayModal
