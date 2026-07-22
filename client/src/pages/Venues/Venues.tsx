import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../../api'
import type { Venue } from '../../types'
import { VENUE_CITIES } from '../../types/venue'
import {
  countActiveVenueFilters,
  defaultVenueFilters,
  filterVenues,
  sortVenues,
  VenueCard,
  VenuesEmptyState,
  VenuesHero,
  VenuesLoadingGrid,
  VenuesSpotlight,
  VenuesToolbar,
  type VenueFiltersState,
} from '../../components/landing/VenueListing'

const SCROLL_HIDE_AFTER = 120
const SCROLL_CLOSE_DELTA = 14

function Venues() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<VenueFiltersState>(defaultVenueFilters)
  const [draftFilters, setDraftFilters] = useState<VenueFiltersState>(defaultVenueFilters)
  const [sort, setSort] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [toolbarHidden, setToolbarHidden] = useState(false)
  const [filtersRevealed, setFiltersRevealed] = useState(false)
  const lastScrollY = useRef(0)

  const activeFilterCount = useMemo(() => countActiveVenueFilters(filters), [filters])

  useEffect(() => {
    api.venues
      .list()
      .then(data => {
        setVenues(data)
        setError(null)
      })
      .catch(() => setError('Nije moguće učitati igraonice. Provjerite je li server pokrenut.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      const delta = y - lastScrollY.current

      if (y < SCROLL_HIDE_AFTER) {
        setToolbarHidden(false)
        setFiltersRevealed(false)
      } else if (delta > SCROLL_CLOSE_DELTA) {
        setToolbarHidden(true)
        setFiltersRevealed(false)
        setFiltersOpen(false)
      }

      lastScrollY.current = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!filtersRevealed) return undefined

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setFiltersRevealed(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [filtersRevealed])

  const filtered = useMemo(() => filterVenues(venues, filters), [venues, filters])
  const sorted = useMemo(() => sortVenues(filtered, sort), [filtered, sort])

  const heroStats = useMemo(() => {
    const cities = new Set(venues.map(v => v.city))
    const minPrice = venues.length ? Math.min(...venues.map(v => v.priceFrom)) : null
    return { totalVenues: venues.length, cityCount: cities.size, minPrice }
  }, [venues])

  function handleFilterChange(patch: Partial<VenueFiltersState>) {
    setFilters(prev => ({ ...prev, ...patch }))
    setDraftFilters(prev => ({ ...prev, ...patch }))
  }

  function handleDraftChange(patch: Partial<VenueFiltersState>) {
    setDraftFilters(prev => ({ ...prev, ...patch }))
  }

  function handleApplyFilters() {
    setFilters(draftFilters)
    setFiltersOpen(false)
  }

  function handleCancelFilters() {
    setDraftFilters(filters)
    setFiltersOpen(false)
  }

  function handleReset() {
    setFilters(defaultVenueFilters)
    setDraftFilters(defaultVenueFilters)
    setSort('featured')
  }

  return (
    <div className="landing-page landing-page--venues">
      <VenuesHero
        totalVenues={heroStats.totalVenues}
        cityCount={heroStats.cityCount}
        minPrice={heroStats.minPrice}
      />

      <div className="venues-page">
        {toolbarHidden && filtersRevealed && (
          <button
            type="button"
            className="venues-filters-backdrop"
            aria-label="Zatvori filtere"
            onClick={() => setFiltersRevealed(false)}
          />
        )}

        {toolbarHidden && !filtersRevealed && (
          <button
            type="button"
            className="venues-filters-trigger"
            onClick={() => setFiltersRevealed(true)}
            aria-expanded={false}
          >
            <span className="venues-filters-trigger__icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M7 12h10M10 18h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Pretraga
            {activeFilterCount > 0 && (
              <span className="venues-filters-trigger__badge">{activeFilterCount}</span>
            )}
          </button>
        )}

        <div
          className={[
            'venues-page__toolbar-wrap',
            toolbarHidden && !filtersRevealed ? 'venues-page__toolbar-wrap--collapsed' : '',
            toolbarHidden && filtersRevealed ? 'venues-page__toolbar-wrap--floating' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="landing-container">
            <div className="venues-discovery">
              {toolbarHidden && filtersRevealed && (
                <div className="venues-discovery__floating-head">
                  <span>Pretraga i filteri</span>
                  <button
                    type="button"
                    className="venues-discovery__close"
                    onClick={() => setFiltersRevealed(false)}
                  >
                    Sakrij
                  </button>
                </div>
              )}
              <VenuesToolbar
                filters={filters}
                draftFilters={draftFilters}
                cities={[...VENUE_CITIES]}
                sort={sort}
                resultCount={sorted.length}
                filtersOpen={filtersOpen}
                onFilterChange={handleFilterChange}
                onDraftChange={handleDraftChange}
                onApplyFilters={handleApplyFilters}
                onCancelFilters={handleCancelFilters}
                onSortChange={setSort}
                onReset={handleReset}
                onToggleFilters={() => {
                  setFiltersOpen(prev => {
                    const next = !prev
                    if (next) setDraftFilters(filters)
                    return next
                  })
                }}
              />
            </div>
          </div>
        </div>

        {!loading && !error && sorted.length > 0 && filters.city === '' && filters.query === '' && (
          <VenuesSpotlight venues={sorted} />
        )}

        <div className="landing-container venues-page__results">
          {loading ? (
            <VenuesLoadingGrid />
          ) : error ? (
            <p className="venues-error" role="alert">
              {error}
            </p>
          ) : sorted.length === 0 ? (
            <VenuesEmptyState onReset={handleReset} />
          ) : (
            <div className="venue-grid">
              {sorted.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Venues
