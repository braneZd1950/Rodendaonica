import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageError, PageLoader } from '../../components/common/AsyncState'
import { CtaBand, PageHero, Section } from '../../components/landing/LandingUi'
import { VenueCard } from '../../components/landing/VenueListing'
import { api } from '../../api'
import type { Venue } from '../../types'

function buildGalleryImages(seed: string, catalogImages?: string[]) {
  if (catalogImages?.length) return catalogImages
  return [
    `https://picsum.photos/seed/${seed}-1/1200/760`,
    `https://picsum.photos/seed/${seed}-2/1200/760`,
    `https://picsum.photos/seed/${seed}-3/1200/760`,
    `https://picsum.photos/seed/${seed}-4/1200/760`,
    `https://picsum.photos/seed/${seed}-5/1200/760`,
  ]
}

function VenueDetails() {
  const { slug } = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [similarVenues, setSimilarVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError('')

    Promise.all([api.venues.getBySlug(slug), api.venues.list()])
      .then(([detail, list]) => {
        if (cancelled) return
        setVenue(detail)
        if (!detail) {
          setSimilarVenues(list.slice(0, 3))
          return
        }
        setSimilarVenues(
          list
            .filter(item => item.slug !== detail.slug && (item.city === detail.city || item.featured))
            .slice(0, 3),
        )
      })
      .catch(err => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Greška pri učitavanju.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const galleryImages = useMemo(
    () => buildGalleryImages(slug ?? 'venue', venue?.images),
    [slug, venue?.images],
  )
  const marqueeImages = useMemo(() => [...galleryImages, ...galleryImages], [galleryImages])
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const packages = useMemo(
    () => (venue?.packages ?? []).filter(pkg => pkg.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [venue?.packages],
  )
  const addons = useMemo(
    () => (venue?.addons ?? []).filter(addon => addon.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [venue?.addons],
  )

  useEffect(() => {
    setActiveIndex(0)
    setModalOpen(false)
  }, [slug])

  useEffect(() => {
    if (!modalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false)
      if (event.key === 'ArrowLeft') {
        setActiveIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length)
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex(prev => (prev + 1) % galleryImages.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [galleryImages.length, modalOpen])

  if (loading) {
    return (
      <div className="landing-page">
        <div className="landing-container">
          <PageLoader message="Učitavanje igraonice..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="landing-page">
        <div className="landing-container">
          <PageError message={error} />
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="landing-page">
        <section className="venue-detail-empty">
          <div className="landing-container venue-detail-empty__inner">
            <h1>Igraonica nije pronađena</h1>
            <p>Provjerite naziv u linku ili pregledajte sve dostupne igraonice.</p>
            <div className="venue-detail-empty__actions">
              <Link to="/igraonice" className="landing-btn landing-btn--primary">
                Natrag na igraonice
              </Link>
              <Link to="/rezerviraj" className="landing-btn landing-btn--outline">
                Rezerviraj termin
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const description =
    venue.description?.trim() ||
    `${venue.name} je prostor u kvartu ${venue.district}, prilagođen djeci od ${venue.ageFrom} do ${venue.ageTo} godina. Paket počinje od ${venue.priceFrom} €, a kapacitet je do ${venue.capacity} djece.`

  return (
    <div className="landing-page landing-page--venue-detail">
      <PageHero
        eyebrow={`${venue.city} · ${venue.district}`}
        title={venue.name}
        subtitle={`Ocjena ${venue.rating.toFixed(1)} (${venue.reviewCount} recenzija) · Od ${venue.priceFrom} € po terminu`}
        primaryAction={{ label: 'Rezerviraj ovaj prostor', to: `/rezerviraj?igraonica=${venue.slug}` }}
        secondaryAction={{ label: 'Sve igraonice', to: '/igraonice' }}
        compact
      />

      <section className="venue-detail-overview">
        <div className="landing-container venue-detail-overview__grid">
          <article className="venue-detail-overview__main">
            <h2>Zašto odabrati {venue.name}?</h2>
            <p>{description}</p>
            <ul className="venue-detail-overview__tags">
              {venue.tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <div className="venue-detail-overview__actions">
              <Link to={`/rezerviraj?igraonica=${venue.slug}`} className="landing-btn landing-btn--primary">
                Provjeri dostupnost
              </Link>
              <Link to="/rezerviraj" className="landing-btn landing-btn--outline">
                Usporedi s drugim prostorima
              </Link>
            </div>
          </article>

          <aside className="venue-detail-overview__aside">
            <h3>Brzi pregled</h3>
            <dl>
              <div>
                <dt>Grad</dt>
                <dd>{venue.city}</dd>
              </div>
              <div>
                <dt>Kvart</dt>
                <dd>{venue.district}</dd>
              </div>
              <div>
                <dt>Cijena od</dt>
                <dd>{venue.priceFrom} €</dd>
              </div>
              <div>
                <dt>Kapacitet</dt>
                <dd>do {venue.capacity} djece</dd>
              </div>
              <div>
                <dt>Dob djece</dt>
                <dd>
                  {venue.ageFrom}–{venue.ageTo} godina
                </dd>
              </div>
              <div>
                <dt>Privatni rođendan</dt>
                <dd>{venue.privateParty ? 'Da' : 'Po dogovoru'}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {(packages.length > 0 || addons.length > 0) && (
        <section className="venue-detail-catalog">
          <div className="landing-container venue-detail-catalog__grid">
            {packages.length > 0 && (
              <article>
                <h2>Paketi rođendana</h2>
                <ul className="venue-detail-catalog__list">
                  {packages.map(pkg => (
                    <li key={pkg.id} className="venue-detail-catalog__card">
                      <div className="venue-detail-catalog__card-head">
                        <h3>{pkg.name}</h3>
                        <strong>{pkg.basePriceEur} €</strong>
                      </div>
                      <p>{pkg.description}</p>
                      <small>
                        {pkg.durationHours}h
                        {pkg.maxGuests ? ` · do ${pkg.maxGuests} djece` : ''}
                      </small>
                      {pkg.includedItems.length > 0 && (
                        <ul className="venue-detail-catalog__included">
                          {pkg.includedItems.map(item => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {addons.length > 0 && (
              <article>
                <h2>Dodaci</h2>
                <ul className="venue-detail-catalog__list venue-detail-catalog__list--addons">
                  {addons.map(addon => (
                    <li key={addon.id} className="venue-detail-catalog__card venue-detail-catalog__card--addon">
                      <div className="venue-detail-catalog__card-head">
                        <h3>{addon.name}</h3>
                        <strong>+{addon.priceEur} €</strong>
                      </div>
                      <p>{addon.description}</p>
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </div>
        </section>
      )}

      <section className="venue-gallery" aria-label="Galerija prostora">
        <div className="landing-container">
          <div className="venue-gallery__header">
            <h2>Galerija prostora</h2>
            <button
              type="button"
              className="venue-gallery__open-modal"
              onClick={() => setModalOpen(true)}
            >
              Otvori sve fotografije
            </button>
          </div>

          <div className="venue-gallery__track-wrap">
            <div className="venue-gallery__track venue-gallery__track--marquee">
              {marqueeImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className="venue-gallery__slide"
                  onClick={() => {
                    setActiveIndex(index % galleryImages.length)
                    setModalOpen(true)
                  }}
                >
                  <img
                    src={image}
                    alt={`${venue.name} - fotografija ${(index % galleryImages.length) + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Slične opcije"
        title={`Još igraonica ${venue.city === '' ? '' : `u ${venue.city}`} koje biste mogli pogledati`}
        subtitle="Usporedite više prostora prije konačne rezervacije."
        variant="muted"
      >
        <div className="venue-grid">
          {similarVenues.map(item => (
            <VenueCard key={item.id} venue={item} />
          ))}
        </div>
      </Section>

      <CtaBand
        title="Spremni za potvrdu termina?"
        text="Odaberite datum, broj djece i paket. Potvrda stiže odmah na email."
        primary={{ label: 'Rezerviraj sada', to: `/rezerviraj?igraonica=${venue.slug}` }}
        secondary={{ label: 'Pregled svih igraonica', to: '/igraonice' }}
      />

      {modalOpen && (
        <div
          className="venue-gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Galerija fotografija igraonice"
          onClick={() => setModalOpen(false)}
        >
          <div className="venue-gallery-modal__inner" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="venue-gallery-modal__close"
              onClick={() => setModalOpen(false)}
              aria-label="Zatvori galeriju"
            >
              ×
            </button>

            <button
              type="button"
              className="venue-gallery-modal__nav venue-gallery-modal__nav--prev"
              onClick={() => setActiveIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length)}
              aria-label="Prethodna fotografija"
            >
              ‹
            </button>

            <img
              src={galleryImages[activeIndex]}
              alt={`${venue.name} - velika fotografija ${activeIndex + 1}`}
              className="venue-gallery-modal__image"
            />

            <button
              type="button"
              className="venue-gallery-modal__nav venue-gallery-modal__nav--next"
              onClick={() => setActiveIndex(prev => (prev + 1) % galleryImages.length)}
              aria-label="Sljedeća fotografija"
            >
              ›
            </button>

            <p className="venue-gallery-modal__counter">
              {activeIndex + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default VenueDetails
