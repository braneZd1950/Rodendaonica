import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CONSENT_OPEN_EVENT,
  CONSENT_STORAGE_KEY,
  CONSENT_UPDATED_EVENT,
  readConsent,
  type ConsentState,
} from '../../lib/consent'

type ConsentChoice = 'selected' | 'all' | 'necessary-only'

function hydrateFromStored(stored: ConsentState) {
  return {
    termsChecked: stored.terms,
    privacyChecked: stored.privacy,
    analyticsChecked: stored.cookies.analytics,
    marketingChecked: stored.cookies.marketing,
  }
}

function ConsentBanner() {
  const dialogRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [cookiesOpen, setCookiesOpen] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [analyticsChecked, setAnalyticsChecked] = useState(false)
  const [marketingChecked, setMarketingChecked] = useState(false)

  const dismiss = useCallback(() => {
    if (!isEditing) return
    setVisible(false)
  }, [isEditing])

  useEffect(() => {
    const stored = readConsent()
    if (!stored) {
      setVisible(true)
      setIsEditing(false)
      return
    }

    const hydrated = hydrateFromStored(stored)
    setTermsChecked(hydrated.termsChecked)
    setPrivacyChecked(hydrated.privacyChecked)
    setAnalyticsChecked(hydrated.analyticsChecked)
    setMarketingChecked(hydrated.marketingChecked)
  }, [])

  useEffect(() => {
    const onOpen = () => {
      const stored = readConsent()
      if (stored) {
        const hydrated = hydrateFromStored(stored)
        setTermsChecked(hydrated.termsChecked)
        setPrivacyChecked(hydrated.privacyChecked)
        setAnalyticsChecked(hydrated.analyticsChecked)
        setMarketingChecked(hydrated.marketingChecked)
      }
      setIsEditing(Boolean(stored))
      setCookiesOpen(true)
      setVisible(true)
    }

    window.addEventListener(CONSENT_OPEN_EVENT, onOpen)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    if (!visible) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible, dismiss])

  useEffect(() => {
    if (!visible) return
    dialogRef.current?.focus()
  }, [visible])

  function saveConsent(choice: ConsentChoice) {
    if (!termsChecked || !privacyChecked) return

    const analytics = choice === 'all' ? true : choice === 'necessary-only' ? false : analyticsChecked
    const marketing = choice === 'all' ? true : choice === 'necessary-only' ? false : marketingChecked

    const consent: ConsentState = {
      acceptedAt: new Date().toISOString(),
      terms: true,
      privacy: true,
      cookies: {
        necessary: true,
        analytics,
        marketing,
      },
    }

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
    window.dispatchEvent(new CustomEvent(CONSENT_UPDATED_EVENT, { detail: consent }))
    setVisible(false)
    setIsEditing(false)
  }

  const canSave = termsChecked && privacyChecked

  if (!visible) return null

  return (
    <>
      <div
        className="consent-banner__backdrop"
        aria-hidden
        onClick={isEditing ? dismiss : undefined}
      />

      <aside
        ref={dialogRef}
        className="consent-banner"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-label={isEditing ? 'Uredi postavke privole' : 'Privola korisnika'}
        tabIndex={-1}
      >
        <div className="consent-banner__inner">
          {isEditing && (
            <button
              type="button"
              className="consent-banner__close"
              onClick={dismiss}
              aria-label="Zatvori bez spremanja"
            >
              ×
            </button>
          )}

          <header className="consent-banner__head">
            <span className="consent-banner__icon" aria-hidden>
              🍪
            </span>
            <div>
              <p className="consent-banner__title">
                {isEditing ? 'Uredi postavke privole' : 'Privola i kolačići'}
              </p>
              <p className="consent-banner__text">
                {isEditing ? (
                  <>
                    Ažurirajte potvrdu{' '}
                    <Link to="/uvjeti">Uvjeta</Link>, <Link to="/privatnost">Privatnosti</Link> i{' '}
                    <Link to="/kolacici">Kolačića</Link>.
                  </>
                ) : (
                  <>
                    Prije nastavka potvrdite{' '}
                    <Link to="/uvjeti">Uvjete</Link>, <Link to="/privatnost">Privatnost</Link> i{' '}
                    <Link to="/kolacici">Kolačiće</Link>.
                  </>
                )}
              </p>
            </div>
          </header>

          <div className="consent-banner__legal">
            <label className="consent-banner__check">
              <input
                type="checkbox"
                className="consent-banner__input"
                checked={termsChecked}
                onChange={event => setTermsChecked(event.target.checked)}
              />
              <span className="consent-banner__track" aria-hidden>
                <span className="consent-banner__thumb" />
              </span>
              <span>Uvjeti korištenja</span>
            </label>

            <label className="consent-banner__check">
              <input
                type="checkbox"
                className="consent-banner__input"
                checked={privacyChecked}
                onChange={event => setPrivacyChecked(event.target.checked)}
              />
              <span className="consent-banner__track" aria-hidden>
                <span className="consent-banner__thumb" />
              </span>
              <span>Politika privatnosti</span>
            </label>
          </div>

          <button
            type="button"
            className={`consent-banner__expand ${cookiesOpen ? 'consent-banner__expand--open' : ''}`}
            onClick={() => setCookiesOpen(prev => !prev)}
            aria-expanded={cookiesOpen}
          >
            Postavke kolačića
            <span className="consent-banner__expand-icon" aria-hidden />
          </button>

          {cookiesOpen && (
            <div className="consent-banner__cookies">
              <label className="consent-banner__cookie consent-banner__cookie--locked">
                <input type="checkbox" className="consent-banner__input" checked readOnly />
                <span className="consent-banner__track" aria-hidden>
                  <span className="consent-banner__thumb" />
                </span>
                <span>Nužni</span>
              </label>

              <label className="consent-banner__cookie">
                <input
                  type="checkbox"
                  className="consent-banner__input"
                  checked={analyticsChecked}
                  onChange={event => setAnalyticsChecked(event.target.checked)}
                />
                <span className="consent-banner__track" aria-hidden>
                  <span className="consent-banner__thumb" />
                </span>
                <span>Analitika</span>
              </label>

              <label className="consent-banner__cookie">
                <input
                  type="checkbox"
                  className="consent-banner__input"
                  checked={marketingChecked}
                  onChange={event => setMarketingChecked(event.target.checked)}
                />
                <span className="consent-banner__track" aria-hidden>
                  <span className="consent-banner__thumb" />
                </span>
                <span>Marketing</span>
              </label>
            </div>
          )}

          <div className="consent-banner__actions">
            <button
              type="button"
              className="consent-banner__btn consent-banner__btn--ghost"
              onClick={() => saveConsent('necessary-only')}
              disabled={!canSave}
            >
              Samo nužni
            </button>
            <button
              type="button"
              className="consent-banner__btn consent-banner__btn--ghost"
              onClick={() => saveConsent('all')}
              disabled={!canSave}
            >
              Prihvati sve
            </button>
            <button
              type="button"
              className="consent-banner__btn consent-banner__btn--primary"
              onClick={() => saveConsent('selected')}
              disabled={!canSave}
            >
              Spremi
            </button>
          </div>

          {!isEditing ? (
            <p className="consent-banner__hint">
              Postavke možete kasnije promijeniti u podnožju stranice, u odjeljku Pravno →{' '}
              <span className="consent-banner__hint-mark">Uredi privole</span>.
            </p>
          ) : (
            <p className="consent-banner__hint">
              Zatvaranje bez spremanja zadržava dosadašnje postavke.
            </p>
          )}
        </div>
      </aside>
    </>
  )
}

export default ConsentBanner
