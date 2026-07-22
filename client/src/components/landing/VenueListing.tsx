import { useMemo, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Venue } from '../../types'
import { LandingButton } from './LandingUi'

function venueInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

const cardGradients = [
  'linear-gradient(135deg, #6c5ce7 0%, #a992ee 55%, #ff6b9d 100%)',
  'linear-gradient(135deg, #ff6b9d 0%, #ff9dc5 50%, #ffd166 100%)',
  'linear-gradient(135deg, #0984e3 0%, #74b9ff 55%, #6c5ce7 100%)',
  'linear-gradient(135deg, #00bfa6 0%, #55efc4 50%, #0984e3 100%)',
  'linear-gradient(135deg, #5a4bd1 0%, #6c5ce7 45%, #ff6b9d 100%)',
  'linear-gradient(135deg, #e6b800 0%, #ffd166 55%, #ff6b9d 100%)',
]

const CITY_EMOJI: Record<string, string> = {
  Zagreb: '🏛️',
  Split: '🌊',
  Rijeka: '⚓',
  Osijek: '🌾',
  Zadar: '🌅',
}

function SearchIcon() {
  return (
    <svg className="venues-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

export function VenuesHero({
  totalVenues,
  cityCount,
  minPrice,
}: {
  totalVenues: number
  cityCount: number
  minPrice: number | null
}) {
  return (
    <section className="venues-hero">
      <div className="venues-hero__blobs" aria-hidden>
        <span className="venues-hero__blob venues-hero__blob--1" />
        <span className="venues-hero__blob venues-hero__blob--2" />
        <span className="venues-hero__blob venues-hero__blob--3" />
      </div>

      <div className="landing-container venues-hero__inner">
        <div className="venues-hero__copy">
          <span className="venues-hero__eyebrow">Marketplace</span>
          <h1 className="venues-hero__title">
            Pronađite savršenu
            <span>igraonicu za rođendan</span>
          </h1>
          <p className="venues-hero__subtitle">
            Usporedite cijene, provjerite dostupnost i rezervirajte termin online — bez poziva i
            nejasnih ponuda.
          </p>
          <div className="venues-hero__actions">
            <LandingButton to="/rezerviraj">Rezerviraj termin</LandingButton>
            <LandingButton to="/kako-funkcionira" variant="outline">
              Kako funkcionira
            </LandingButton>
          </div>
        </div>

        <div className="venues-hero__stats">
          <div className="venues-hero__stat">
            <strong>{totalVenues || '—'}</strong>
            <span>provjerenih lokacija</span>
          </div>
          <div className="venues-hero__stat">
            <strong>{cityCount || '—'}</strong>
            <span>gradova u ponudi</span>
          </div>
          <div className="venues-hero__stat">
            <strong>{minPrice != null ? `od ${minPrice} €` : '—'}</strong>
            <span>po događaju</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function VenueCard({ venue }: { venue: Venue }) {
  const gradient = cardGradients[(Number(venue.id) - 1) % cardGradients.length]

  return (
    <article className="venue-card">
      <Link to={`/igraonice/${venue.slug}`} className="venue-card__media">
        <div className="venue-card__media-bg" style={{ background: gradient }} aria-hidden />
        <span className="venue-card__confetti venue-card__confetti--1" aria-hidden />
        <span className="venue-card__confetti venue-card__confetti--2" aria-hidden />
        <span className="venue-card__confetti venue-card__confetti--3" aria-hidden />
        <span className="venue-card__initials" aria-hidden>
          {venueInitials(venue.name)}
        </span>
        {venue.featured && <span className="venue-card__badge">Istaknuto</span>}
        <span className="venue-card__rating-pill">
          <StarIcon />
          {venue.rating.toFixed(1)}
        </span>
        <span className="venue-card__price">od {venue.priceFrom} €</span>
      </Link>

      <div className="venue-card__body">
        <div className="venue-card__meta">
          <span className="venue-card__location">
            {CITY_EMOJI[venue.city] ?? '📍'} {venue.city}, {venue.district}
          </span>
          <span className="venue-card__reviews">({venue.reviewCount} recenzija)</span>
        </div>

        <h3 className="venue-card__name">
          <Link to={`/igraonice/${venue.slug}`}>{venue.name}</Link>
        </h3>

        <ul className="venue-card__tags">
          {venue.tags.slice(0, 3).map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <ul className="venue-card__specs">
          <li>👥 do {venue.capacity}</li>
          <li>🎂 {venue.ageFrom}–{venue.ageTo} god.</li>
          {venue.privateParty && <li>🔒 Privatni</li>}
        </ul>

        <div className="venue-card__footer">
          <Link to={`/igraonice/${venue.slug}`} className="venue-card__cta">
            Provjeri dostupnost
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

function VenueSpotlightCard({ venue }: { venue: Venue }) {
  const gradient = cardGradients[(Number(venue.id) - 1) % cardGradients.length]

  return (
    <Link to={`/igraonice/${venue.slug}`} className="venue-spotlight-card">
      <div className="venue-spotlight-card__visual">
        <div className="venue-spotlight-card__bg" style={{ background: gradient }} aria-hidden />
        <div className="venue-spotlight-card__shine" aria-hidden />
        <span className="venue-spotlight-card__badge">Top izbor</span>
      </div>
      <div className="venue-spotlight-card__body">
        <h3 className="venue-spotlight-card__name">{venue.name}</h3>
        <div className="venue-spotlight-card__meta">
          <span className="venue-spotlight-card__rating">
            <StarIcon />
            {venue.rating.toFixed(1)}
          </span>
          <span>·</span>
          <span>
            {venue.city} · od {venue.priceFrom} €
          </span>
        </div>
      </div>
    </Link>
  )
}

export function VenuesSpotlight({ venues }: { venues: Venue[] }) {
  const featured = venues.filter(v => v.featured).slice(0, 4)
  if (!featured.length) return null

  return (
    <section className="venues-spotlight" aria-label="Istaknute igraonice">
      <div className="landing-container">
        <header className="venues-spotlight__head">
          <div>
            <h2 className="venues-spotlight__title">Istaknuti izbori</h2>
            <p className="venues-spotlight__hint">Najpopularnije lokacije s najboljim ocjenama</p>
          </div>
        </header>
        <div className="venues-spotlight__track">
          {featured.map(venue => (
            <VenueSpotlightCard key={venue.id} venue={venue} />
          ))}
        </div>
      </div>
    </section>
  )
}

export interface VenueFiltersState {
  query: string
  city: string
  maxPrice: number
  minCapacity: number
  privateOnly: boolean
}

export const defaultVenueFilters: VenueFiltersState = {
  query: '',
  city: '',
  maxPrice: 300,
  minCapacity: 0,
  privateOnly: false,
}

const sortOptions = [
  { value: 'featured', label: 'Preporučeno' },
  { value: 'price-asc', label: 'Cijena ↑' },
  { value: 'price-desc', label: 'Cijena ↓' },
  { value: 'rating', label: 'Ocjena' },
] as const

interface VenuesToolbarProps {
  filters: VenueFiltersState
  draftFilters: VenueFiltersState
  cities: readonly string[]
  sort: string
  resultCount: number
  filtersOpen: boolean
  onFilterChange: (patch: Partial<VenueFiltersState>) => void
  onDraftChange: (patch: Partial<VenueFiltersState>) => void
  onApplyFilters: () => void
  onCancelFilters: () => void
  onSortChange: (value: string) => void
  onReset: () => void
  onToggleFilters: () => void
}

export function VenuesToolbar({
  filters,
  draftFilters,
  cities,
  sort,
  resultCount,
  filtersOpen,
  onFilterChange,
  onDraftChange,
  onApplyFilters,
  onCancelFilters,
  onSortChange,
  onReset,
  onToggleFilters,
}: VenuesToolbarProps) {
  const activeChips = useMemo(() => getActiveFilterChips(filters), [filters])
  const hasActiveFilters = activeChips.length > 0

  return (
    <div className="venues-toolbar">
      <div className="venues-toolbar__primary">
        <label className="venues-search">
          <SearchIcon />
          <input
            type="search"
            className="venues-search__input"
            placeholder="Pretraži igraonicu ili grad..."
            value={filters.query}
            onChange={e => onFilterChange({ query: e.target.value })}
          />
        </label>

        <button
          type="button"
          className={`venues-toolbar__filters-btn ${filtersOpen ? 'venues-toolbar__filters-btn--active' : ''}`}
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
        >
          <FilterIcon />
          Filteri
          {hasActiveFilters && <span className="venues-toolbar__filters-dot" aria-hidden />}
        </button>
      </div>

      <div className="venues-chips" role="group" aria-label="Grad">
        <button
          type="button"
          className={`venues-chip ${filters.city === '' ? 'venues-chip--active' : ''}`}
          onClick={() => onFilterChange({ city: '' })}
        >
          <span className="venues-chip__emoji" aria-hidden>
            🗺️
          </span>
          Svi gradovi
        </button>
        {cities.map(city => (
          <button
            key={city}
            type="button"
            className={`venues-chip ${filters.city === city ? 'venues-chip--active' : ''}`}
            onClick={() => onFilterChange({ city: filters.city === city ? '' : city })}
          >
            <span className="venues-chip__emoji" aria-hidden>
              {CITY_EMOJI[city] ?? '📍'}
            </span>
            {city}
          </button>
        ))}
      </div>

      <div className={`venues-advanced ${filtersOpen ? 'venues-advanced--open' : ''}`}>
        <div className="venues-advanced__shell">
          <div className="venues-advanced__grid">
          <div className="venues-advanced__field">
            <div className="venues-advanced__label-row">
              <span>Maksimalna cijena</span>
              <strong>do {draftFilters.maxPrice} €</strong>
            </div>
            <input
              type="range"
              className="venues-range"
              min={120}
              max={300}
              step={10}
              value={draftFilters.maxPrice}
              onChange={e => onDraftChange({ maxPrice: Number(e.target.value) })}
              style={{ '--range-pct': `${((draftFilters.maxPrice - 120) / 180) * 100}%` } as CSSProperties}
            />
          </div>

          <div className="venues-advanced__field">
            <span className="venues-advanced__label">Minimalni kapacitet</span>
            <div className="venues-capacity">
              {[0, 15, 20, 25].map(value => (
                <button
                  key={value}
                  type="button"
                  className={`venues-capacity__btn ${draftFilters.minCapacity === value ? 'venues-capacity__btn--active' : ''}`}
                  onClick={() => onDraftChange({ minCapacity: value })}
                >
                  {value === 0 ? 'Bilo koji' : `${value}+`}
                </button>
              ))}
            </div>
          </div>

          <div className="venues-advanced__field venues-advanced__field--toggle">
            <span className="venues-advanced__label">Tip događaja</span>
            <button
              type="button"
              role="switch"
              aria-checked={draftFilters.privateOnly}
              className={`venues-toggle ${draftFilters.privateOnly ? 'venues-toggle--on' : ''}`}
              onClick={() => onDraftChange({ privateOnly: !draftFilters.privateOnly })}
            >
              <span className="venues-toggle__track">
                <span className="venues-toggle__thumb" />
              </span>
              <span>Samo privatni rođendani</span>
            </button>
          </div>
        </div>

        <div className="venues-advanced__actions">
          <button type="button" className="venues-advanced__apply" onClick={onApplyFilters}>
            Primijeni
          </button>
          <button type="button" className="venues-advanced__cancel" onClick={onCancelFilters}>
            Odustani
          </button>
          {hasActiveFilters && (
            <button type="button" className="venues-advanced__reset" onClick={onReset}>
              Poništi sve filtere
            </button>
          )}
        </div>
        </div>
      </div>

      <div className="venues-toolbar__secondary">
        <div className="venues-toolbar__count">
          <strong>{resultCount}</strong>
          <span>{resultCount === 1 ? 'igraonica' : 'igraonica'}</span>
        </div>

        <div className="venues-sort" role="group" aria-label="Sortiranje">
          {sortOptions.map(option => (
            <button
              key={option.value}
              type="button"
              className={`venues-sort__btn ${sort === option.value ? 'venues-sort__btn--active' : ''}`}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {activeChips.length > 0 && (
        <ul className="venues-active-filters">
          {activeChips.map(chip => (
            <li key={chip.key}>
              <button
                type="button"
                className="venues-active-filters__chip"
                onClick={() => onFilterChange(chip.clearPatch)}
              >
                {chip.label}
                <span aria-hidden>×</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function countActiveVenueFilters(filters: VenueFiltersState): number {
  return getActiveFilterChips(filters).length
}

function getActiveFilterChips(filters: VenueFiltersState) {
  const chips: { key: string; label: string; clearPatch: Partial<VenueFiltersState> }[] = []

  if (filters.query.trim()) {
    chips.push({ key: 'query', label: `"${filters.query.trim()}"`, clearPatch: { query: '' } })
  }
  if (filters.city) {
    chips.push({ key: 'city', label: filters.city, clearPatch: { city: '' } })
  }
  if (filters.maxPrice < defaultVenueFilters.maxPrice) {
    chips.push({
      key: 'price',
      label: `Do ${filters.maxPrice} €`,
      clearPatch: { maxPrice: defaultVenueFilters.maxPrice },
    })
  }
  if (filters.minCapacity > 0) {
    chips.push({
      key: 'capacity',
      label: `${filters.minCapacity}+ djece`,
      clearPatch: { minCapacity: 0 },
    })
  }
  if (filters.privateOnly) {
    chips.push({ key: 'private', label: 'Privatni rođendani', clearPatch: { privateOnly: false } })
  }

  return chips
}

export function filterVenues(venues: Venue[], filters: VenueFiltersState): Venue[] {
  const q = filters.query.trim().toLowerCase()

  return venues.filter(venue => {
    if (q && !venue.name.toLowerCase().includes(q) && !venue.city.toLowerCase().includes(q)) {
      return false
    }
    if (filters.city && venue.city !== filters.city) return false
    if (venue.priceFrom > filters.maxPrice) return false
    if (filters.minCapacity && venue.capacity < filters.minCapacity) return false
    if (filters.privateOnly && !venue.privateParty) return false
    return true
  })
}

export function sortVenues(venues: Venue[], sort: string): Venue[] {
  const list = [...venues]
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.priceFrom - b.priceFrom)
    case 'price-desc':
      return list.sort((a, b) => b.priceFrom - a.priceFrom)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating)
    default:
      return list.sort((a, b) => Number(b.featured) - Number(a.featured))
  }
}

export function VenuesLoadingGrid() {
  return (
    <div className="venues-skeleton-grid" aria-busy="true" aria-label="Učitavanje igraonica">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="venues-skeleton-card">
          <div className="venues-skeleton-card__media" />
          <div className="venues-skeleton-card__body">
            <div className="venues-skeleton-card__line venues-skeleton-card__line--short" />
            <div className="venues-skeleton-card__line venues-skeleton-card__line--title" />
            <div className="venues-skeleton-card__line" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function VenuesEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="venues-empty">
      <div className="venues-empty__art" aria-hidden>
        <span className="venues-empty__balloon venues-empty__balloon--1" />
        <span className="venues-empty__balloon venues-empty__balloon--2" />
        <span className="venues-empty__balloon venues-empty__balloon--3" />
      </div>
      <p className="venues-empty__title">Nema rezultata za ovu pretragu</p>
      <p className="venues-empty__text">
        Pokušajte odabrati drugi grad, povećati budžet ili ukloniti neke filtere — možda je savršena
        igraonica samo jedan klik dalje.
      </p>
      <button type="button" className="landing-btn landing-btn--primary" onClick={onReset}>
        Poništi filtere
      </button>
    </div>
  )
}
