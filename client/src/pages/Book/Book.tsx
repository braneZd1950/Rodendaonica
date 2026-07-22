import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { PageHero } from '../../components/landing/LandingUi'
import { api } from '../../api'
import { ROUTES } from '../../constants/routes'
import { authService } from '../../services/auth/authService'
import { clearPendingBooking, readPendingBooking, savePendingBooking } from '../../lib/bookingDraft'
import { getErrorMessage } from '../../lib/errors'
import type { CreateReservationInput, PaymentConfig, Venue, VenueAddon, VenuePackage } from '../../types'

type WizardStep = 1 | 2 | 3

const TIME_SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00']

const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
  onlinePaymentsEnabled: false,
  provider: null,
  publishableKey: null,
}

function activePackages(venue: Venue | null): VenuePackage[] {
  return (venue?.packages ?? []).filter(pkg => pkg.active).sort((a, b) => a.sortOrder - b.sortOrder)
}

function activeAddons(venue: Venue | null): VenueAddon[] {
  return (venue?.addons ?? []).filter(addon => addon.active).sort((a, b) => a.sortOrder - b.sortOrder)
}

function Book() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedSlug = searchParams.get('igraonica') ?? ''
  const resumeError = searchParams.get('error')

  const [step, setStep] = useState<WizardStep>(1)
  const [venueSlug, setVenueSlug] = useState(preselectedSlug)
  const [venueDetail, setVenueDetail] = useState<Venue | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState('15')
  const [childName, setChildName] = useState('')
  const [packageId, setPackageId] = useState('')
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [venues, setVenues] = useState<Venue[]>([])
  const [busySlots, setBusySlots] = useState<string[]>([])
  const [isVenueOpen, setIsVenueOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(DEFAULT_PAYMENT_CONFIG)
  const venueMenuRef = useRef<HTMLDivElement | null>(null)

  const session = authService.getSession()
  const isParentLoggedIn = session?.role === 'parent'

  const packages = useMemo(() => activePackages(venueDetail), [venueDetail])
  const addons = useMemo(() => activeAddons(venueDetail), [venueDetail])

  const selectedPackage = useMemo(
    () => packages.find(pkg => pkg.id === packageId) ?? packages[0] ?? null,
    [packages, packageId],
  )

  const selectedAddons = useMemo(
    () => addons.filter(addon => selectedAddonIds.includes(addon.id)),
    [addons, selectedAddonIds],
  )

  const pricing = useMemo(() => {
    const packagePrice = selectedPackage?.basePriceEur ?? venueDetail?.priceFrom ?? 0
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.priceEur, 0)
    const total = packagePrice + addonTotal
    return {
      packagePrice,
      addonTotal,
      total,
      deposit: Math.round(total * 0.3),
    }
  }, [selectedPackage, selectedAddons, venueDetail?.priceFrom])

  useEffect(() => {
    api.venues.list().then(setVenues)
    api.payments.getConfig().then(setPaymentConfig).catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!venueSlug) {
      setVenueDetail(null)
      return
    }
    api.venues.getBySlug(venueSlug).then(detail => {
      setVenueDetail(detail)
      if (detail?.packages?.length) {
        const first = activePackages(detail)[0]
        if (first) setPackageId(first.id)
      }
      setSelectedAddonIds([])
    })
  }, [venueSlug])

  useEffect(() => {
    const draft = readPendingBooking()
    if (!draft) return
    setVenueSlug(draft.venueSlug)
    setDate(draft.date)
    setTime(draft.time)
    setGuests(String(draft.guestCount))
    setChildName(draft.childName)
    setNotes(draft.notes ?? '')
    if (draft.addons?.length) {
      setSelectedAddonIds(draft.addons.map(addon => addon.id))
    }
    setStep(3)
  }, [])

  useEffect(() => {
    if (!packages.length || !venueDetail) return
    const draft = readPendingBooking()
    if (draft?.packageName) {
      const matched = packages.find(pkg => pkg.name === draft.packageName)
      if (matched) setPackageId(matched.id)
      return
    }
    if (!packages.some(pkg => pkg.id === packageId)) {
      setPackageId(packages[0].id)
    }
  }, [packages, venueDetail, packageId])

  useEffect(() => {
    if (!venueSlug || !date) {
      setBusySlots([])
      return
    }
    api.reservations.getBusySlots(venueSlug, date).then(setBusySlots)
  }, [venueSlug, date])

  const selectedVenue = useMemo(
    () => venueDetail ?? venues.find(v => v.slug === venueSlug) ?? null,
    [venueDetail, venues, venueSlug],
  )

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!venueMenuRef.current?.contains(event.target as Node)) {
        setIsVenueOpen(false)
      }
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function toggleAddon(addonId: string) {
    setSelectedAddonIds(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId],
    )
  }

  function buildInput(): CreateReservationInput {
    return {
      venueSlug,
      date,
      time,
      guestCount: Number(guests),
      packageName: selectedPackage?.name ?? packageId,
      childName: childName.trim() || 'Dijete',
      notes: notes.trim() || undefined,
      addons: selectedAddons.map(addon => ({
        id: addon.id,
        name: addon.name,
        priceEur: addon.priceEur,
      })),
    }
  }

  function validateStep2() {
    if (!date || !time) return 'Odaberite datum i vrijeme.'
    if (busySlots.includes(time)) return 'Odabrani termin je zauzet.'
    if (!childName.trim()) return 'Unesite ime djeteta.'
    if (!selectedPackage) return 'Odaberite paket.'
    return ''
  }

  async function handleSubmit() {
    const validation = validateStep2()
    if (validation) {
      setSubmitError(validation)
      return
    }

    const input = buildInput()

    if (!isParentLoggedIn) {
      savePendingBooking(input)
      navigate(ROUTES.login, { state: { from: ROUTES.book } })
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      await api.reservations.create(input)
      clearPendingBooking()
      setSubmitSuccess(true)
      setTimeout(() => navigate(`${ROUTES.parent.reservations}?booked=1`), 1200)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  function nextStep() {
    if (step === 2) {
      const validation = validateStep2()
      if (validation) {
        setSubmitError(validation)
        return
      }
      setSubmitError('')
    }
    setStep(prev => (prev < 3 ? ((prev + 1) as WizardStep) : prev))
  }

  function prevStep() {
    setStep(prev => (prev > 1 ? ((prev - 1) as WizardStep) : prev))
  }

  function stepClass(n: WizardStep) {
    if (step > n) return 'book-wizard__step--done'
    if (step === n) return 'book-wizard__step--active'
    return ''
  }

  return (
    <div className="landing-page">
      <PageHero
        eyebrow="Rezervacija"
        title="Rezervirajte termin"
        subtitle="Odaberite igraonicu, termin i paket. Prijavljeni roditelji mogu odmah poslati upit."
        primaryAction={isParentLoggedIn ? undefined : { label: 'Prijava', to: ROUTES.login }}
        secondaryAction={isParentLoggedIn ? undefined : { label: 'Registracija', to: ROUTES.register }}
        compact
      />

      <div className="landing-container book-wizard">
        {(resumeError || submitError) && (
          <div className="book-wizard__alert book-wizard__alert--error" role="alert">
            {resumeError ? decodeURIComponent(resumeError) : submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="book-wizard__alert book-wizard__alert--success" role="status">
            Upit je poslan! Preusmjeravamo vas na rezervacije...
          </div>
        )}

        <div className="book-wizard__steps" role="list" aria-label="Koraci rezervacije">
          <span className={stepClass(1)} role="listitem">
            Igraonica
          </span>
          <span className={stepClass(2)} role="listitem">
            Termin
          </span>
          <span className={stepClass(3)} role="listitem">
            Potvrda
          </span>
        </div>

        <div className="book-wizard__card">
          {step === 1 && (
            <>
              <h2 className="book-wizard__title">Odaberite igraonicu</h2>
              <div className="book-wizard__field">
                <label>Igraonica</label>
                <div className="book-wizard-select" ref={venueMenuRef}>
                  <button
                    type="button"
                    className={`book-wizard-select__trigger ${isVenueOpen ? 'book-wizard-select__trigger--open' : ''}`}
                    onClick={() => setIsVenueOpen(prev => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isVenueOpen}
                    aria-controls="venue-options"
                  >
                    <span className={selectedVenue ? '' : 'book-wizard-select__placeholder'}>
                      {selectedVenue
                        ? `${selectedVenue.name} (${selectedVenue.city}) — od ${selectedVenue.priceFrom} €`
                        : '— Odaberite —'}
                    </span>
                    <span className="book-wizard-select__chevron" aria-hidden />
                  </button>
                  <ul
                    id="venue-options"
                    className={`book-wizard-select__menu ${isVenueOpen ? 'book-wizard-select__menu--open' : ''}`}
                    role="listbox"
                    aria-label="Odaberite igraonicu"
                  >
                    {venues.map(v => {
                      const selected = v.slug === venueSlug
                      return (
                        <li key={v.id} role="option" aria-selected={selected}>
                          <button
                            type="button"
                            className={`book-wizard-select__option ${selected ? 'book-wizard-select__option--active' : ''}`}
                            onClick={() => {
                              setVenueSlug(v.slug)
                              setIsVenueOpen(false)
                            }}
                          >
                            <strong>{v.name}</strong>
                            <small>
                              {v.city} · od {v.priceFrom} €
                            </small>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
              {selectedVenue && (
                <p className="book-wizard__hint">
                  Kapacitet do {selectedVenue.capacity} djece · Dob {selectedVenue.ageFrom}–{selectedVenue.ageTo}{' '}
                  god.
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="book-wizard__title">Detalji termina</h2>
              <div className="book-wizard__field">
                <label htmlFor="date">Datum</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={e => {
                    setDate(e.target.value)
                    setTime('')
                  }}
                />
              </div>
              <div className="book-wizard__field">
                <label htmlFor="time">Vrijeme</label>
                <select id="time" value={time} onChange={e => setTime(e.target.value)}>
                  <option value="">— Odaberite —</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot} disabled={busySlots.includes(slot)}>
                      {slot}
                      {busySlots.includes(slot) ? ' (zauzeto)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="book-wizard__field">
                <label htmlFor="childName">Ime djeteta</label>
                <input
                  id="childName"
                  type="text"
                  value={childName}
                  onChange={e => setChildName(e.target.value)}
                  placeholder="npr. Luka"
                />
              </div>
              <div className="book-wizard__field">
                <label htmlFor="guests">Broj djece</label>
                <input
                  id="guests"
                  type="number"
                  min={5}
                  max={selectedVenue?.capacity ?? 30}
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                />
              </div>
              <div className="book-wizard__field">
                <label htmlFor="package">Paket</label>
                {packages.length ? (
                  <select id="package" value={packageId} onChange={e => setPackageId(e.target.value)}>
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — {pkg.basePriceEur} €
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="book-wizard__hint">Za ovu igraonicu još nema aktivnih paketa.</p>
                )}
              </div>
              {addons.length > 0 && (
                <fieldset className="book-wizard__field book-wizard__addons">
                  <legend>Dodaci (opcionalno)</legend>
                  <ul className="book-wizard__addon-list">
                    {addons.map(addon => (
                      <li key={addon.id}>
                        <label className="book-wizard__addon-item">
                          <input
                            type="checkbox"
                            checked={selectedAddonIds.includes(addon.id)}
                            onChange={() => toggleAddon(addon.id)}
                          />
                          <span>
                            <strong>{addon.name}</strong>
                            <small>
                              {addon.description} · +{addon.priceEur} €
                            </small>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              )}
              <div className="book-wizard__field">
                <label htmlFor="notes">Napomena igraonici</label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Alergije, tema rođendana..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="book-wizard__title">Sažetak rezervacije</h2>
              <ul className="book-wizard__summary">
                <li>
                  <strong>Igraonica</strong>
                  <span>{selectedVenue?.name ?? '—'}</span>
                </li>
                <li>
                  <strong>Datum i vrijeme</strong>
                  <span>
                    {date || '—'} {time ? `u ${time}` : ''}
                  </span>
                </li>
                <li>
                  <strong>Dijete</strong>
                  <span>{childName || '—'}</span>
                </li>
                <li>
                  <strong>Gosti</strong>
                  <span>{guests} djece</span>
                </li>
                <li>
                  <strong>Paket</strong>
                  <span>
                    {selectedPackage?.name ?? '—'} ({pricing.packagePrice} €)
                  </span>
                </li>
                {selectedAddons.length > 0 && (
                  <li>
                    <strong>Dodaci</strong>
                    <span>
                      {selectedAddons.map(addon => `${addon.name} (+${addon.priceEur} €)`).join(', ')}
                    </span>
                  </li>
                )}
                <li>
                  <strong>Ukupno</strong>
                  <span>{pricing.total} €</span>
                </li>
                <li>
                  <strong>Akontacija (30%)</strong>
                  <span>{pricing.deposit} €</span>
                </li>
                {notes && (
                  <li>
                    <strong>Napomena</strong>
                    <span>{notes}</span>
                  </li>
                )}
              </ul>
              <p className="book-wizard__note">
                {isParentLoggedIn
                  ? paymentConfig.onlinePaymentsEnabled
                    ? 'Klikom na „Pošalji upit” rezervacija se šalje igraonici. Akontaciju možete platiti karticom odmah nakon toga.'
                    : 'Klikom na „Pošalji upit” šaljete rezervaciju bez online plaćanja. Igraonica potvrđuje termin i dogovara akontaciju izravno s vama.'
                  : 'Nakon prijave automatski ćemo poslati upit s ovim podacima.'}
              </p>
              <div className="book-wizard__actions-row">
                <button
                  type="button"
                  className="landing-btn landing-btn--primary"
                  onClick={handleSubmit}
                  disabled={submitting || submitSuccess}
                >
                  {submitting ? 'Slanje...' : isParentLoggedIn ? 'Pošalji upit' : 'Prijavi se i pošalji'}
                </button>
                {!isParentLoggedIn && (
                  <Link to={ROUTES.register} className="landing-btn landing-btn--outline">
                    Registracija
                  </Link>
                )}
              </div>
            </>
          )}

          <div className="book-wizard__actions">
            {step > 1 ? (
              <button type="button" className="landing-btn landing-btn--outline" onClick={prevStep}>
                Natrag
              </button>
            ) : (
              <Link to={ROUTES.venues} className="landing-btn landing-btn--outline">
                Pregled igraonica
              </Link>
            )}
            {step < 3 && (
              <button
                type="button"
                className="landing-btn landing-btn--primary"
                onClick={nextStep}
                disabled={step === 1 && !venueSlug}
              >
                Dalje
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Book
