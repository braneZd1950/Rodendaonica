import { Link } from 'react-router-dom'
import { PageError, PageLoader } from '../../components/common/AsyncState'
import { APP_CONFIG } from '../../config/app'
import { ROUTES } from '../../constants/routes'
import { useAsyncData } from '../../hooks/useAsyncData'
import { api } from '../../api'
import { formatPlanTier } from '../../lib/format'

function BusinessSettings() {
  const { data: business, loading, error, reload } = useAsyncData(() => api.businesses.getCurrent(), [])

  if (loading) {
    return (
      <div className="landing-page">
        <section className="business-dashboard">
          <div className="landing-container">
            <PageLoader message="Učitavanje postavki..." />
          </div>
        </section>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="landing-page">
        <section className="business-dashboard">
          <div className="landing-container">
            <PageError message={error ?? 'Podaci igraonice nisu dostupni.'} onRetry={reload} />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="landing-page">
      <section className="business-dashboard">
        <div className="landing-container">
          <div className="business-page-head">
            <h1>Postavke igraonice</h1>
            <p>Upravljajte podacima računa, pretplatom i ponudom paketa za roditelje.</p>
          </div>

          <div className="business-settings">
            <article className="business-card">
              <h2>Podaci tvrtke</h2>
              <dl className="business-settings__list">
                <div>
                  <dt>Naziv</dt>
                  <dd>{business.companyName}</dd>
                </div>
                <div>
                  <dt>OIB</dt>
                  <dd>{business.oib}</dd>
                </div>
                <div>
                  <dt>Kontakt osoba</dt>
                  <dd>{business.contactName}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{business.email}</dd>
                </div>
                <div>
                  <dt>Telefon</dt>
                  <dd>{business.phone}</dd>
                </div>
                <div>
                  <dt>Grad</dt>
                  <dd>{business.city}</dd>
                </div>
              </dl>
            </article>

            <article className="business-card">
              <h2>Pretplata</h2>
              <p className="business-settings__plan">
                Aktivni plan: <strong>{formatPlanTier(business.plan)}</strong>
              </p>
              <p className="business-settings__hint">
                Za promjenu paketa ili dodatne lokacije kontaktirajte{' '}
                <a href={`mailto:${APP_CONFIG.supportEmail}`}>{APP_CONFIG.supportEmail}</a>.
              </p>
              <Link to={ROUTES.pricing} className="landing-btn landing-btn--outline">
                Usporedi pakete
              </Link>
            </article>

            <article className="business-card">
              <h2>Katalog ponude</h2>
              <p className="business-settings__hint">
                Uredite opis, pakete rođendana i dodatke koje roditelji vide pri rezervaciji.
              </p>
              <Link to={ROUTES.business.catalog} className="landing-btn landing-btn--primary">
                Uredi katalog
              </Link>
            </article>

            <article className="business-card">
              <h2>Brze veze</h2>
              <div className="business-summary-card__actions">
                <Link to={ROUTES.business.dashboard}>Dashboard</Link>
                <Link to={ROUTES.business.catalog}>Katalog</Link>
                <Link to={ROUTES.business.calendar}>Kalendar</Link>
                <Link to={ROUTES.business.reservations}>Rezervacije</Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BusinessSettings
