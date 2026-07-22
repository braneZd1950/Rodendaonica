import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import BusinessCalendarDayModal from '../../components/business/BusinessCalendarDayModal'
import type { ParentUser, Reservation } from '../../types'

interface CalendarDay {
  dateKey: string
  dayNumber: number
  inCurrentMonth: boolean
  reservations: Reservation[]
}

function monthLabel(date: Date) {
  const label = date.toLocaleDateString('hr-HR', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function dateToKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function buildCalendar(monthDate: Date, reservations: Reservation[]) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const start = new Date(first)
  const day = (first.getDay() + 6) % 7
  start.setDate(first.getDate() - day)

  const days: CalendarDay[] = []
  for (let i = 0; i < 42; i += 1) {
    const current = new Date(start)
    current.setDate(start.getDate() + i)
    const key = dateToKey(current)
    days.push({
      dateKey: key,
      dayNumber: current.getDate(),
      inCurrentMonth: current.getMonth() === monthDate.getMonth(),
      reservations: reservations.filter(
        reservation => reservation.date === key && reservation.status !== 'cancelled' && reservation.status !== 'draft',
      ),
    })
  }

  return days
}

function BusinessCalendar() {
  const [month, setMonth] = useState(() => new Date())
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [parentById, setParentById] = useState<Record<string, ParentUser | null>>({})
  const [parentsLoading, setParentsLoading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const business = await api.businesses.getCurrent()
      if (!business) {
        setLoading(false)
        return
      }
      const data = await api.reservations.listByBusiness(business.id)
      setReservations(data)
      setLoading(false)
    })()
  }, [])

  const days = useMemo(() => buildCalendar(month, reservations), [month, reservations])
  const selectedReservations = useMemo(
    () =>
      reservations.filter(
        item =>
          item.date === selectedDate && item.status !== 'cancelled' && item.status !== 'draft',
      ),
    [reservations, selectedDate],
  )

  useEffect(() => {
    if (!selectedDate) {
      setParentById({})
      setParentsLoading(false)
      return
    }

    if (selectedReservations.length === 0) {
      setParentById({})
      setParentsLoading(false)
      return
    }

    let cancelled = false
    setParentsLoading(true)

    ;(async () => {
      const entries = await Promise.all(
        selectedReservations.map(async reservation => {
          const parent = await api.parents.getById(reservation.parentId)
          return [reservation.parentId, parent] as const
        }),
      )

      if (!cancelled) {
        setParentById(Object.fromEntries(entries))
        setParentsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [selectedDate, selectedReservations])

  return (
    <div className="landing-page">
      <section className="business-dashboard">
        <div className="landing-container">
          <div className="business-page-head business-page-head--calendar">
            <div>
              <h1>Custom kalendar termina</h1>
              <p>Pregled svih slobodnih i zauzetih termina po datumima.</p>
            </div>
            <div className="business-calendar__controls">
              <button
                type="button"
                onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              >
                ←
              </button>
              <span>{monthLabel(month)}</span>
              <button
                type="button"
                onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              >
                →
              </button>
            </div>
          </div>

          {loading ? (
            <p className="parent-panel__loading">Učitavanje kalendara...</p>
          ) : (
            <>
              <div className="business-calendar__legend">
                <span>
                  <i className="business-calendar__dot business-calendar__dot--free" />
                  Slobodno
                </span>
                <span>
                  <i className="business-calendar__dot business-calendar__dot--busy" />
                  Zauzeto
                </span>
              </div>

              <div className="business-calendar">
                {['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'].map(day => (
                  <div key={day} className="business-calendar__weekday">
                    {day}
                  </div>
                ))}

                {days.map(day => (
                  <button
                    key={day.dateKey}
                    type="button"
                    onClick={() => setSelectedDate(day.dateKey)}
                    className={`business-calendar__cell ${!day.inCurrentMonth ? 'business-calendar__cell--muted' : ''}`}
                  >
                    <span>{day.dayNumber}</span>
                    <small>{day.reservations.length > 0 ? `${day.reservations.length} rezerv.` : 'slobodno'}</small>
                    <i
                      className={`business-calendar__dot ${day.reservations.length > 0 ? 'business-calendar__dot--busy' : 'business-calendar__dot--free'}`}
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {selectedDate && (
        <BusinessCalendarDayModal
          dateKey={selectedDate}
          reservations={selectedReservations}
          parentById={parentById}
          parentsLoading={parentsLoading}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  )
}

export default BusinessCalendar
