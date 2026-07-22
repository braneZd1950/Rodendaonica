import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { EmptyState, PageError, PageLoader } from '../../components/common/AsyncState'
import { ROUTES } from '../../constants/routes'
import { formatCurrencyEur } from '../../lib/format'
import {
  ADDON_CATEGORY_LABELS,
  createEmptyAddon,
  createEmptyPackage,
  formatIncludedItems,
  parseIncludedItems,
} from '../../lib/venueCatalogForm'
import type { UpdateVenueCatalogInput, Venue, VenueAddon, VenuePackage } from '../../types'

function BusinessVenueCatalog() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [catalog, setCatalog] = useState<UpdateVenueCatalogInput | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const loadVenues = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await api.businesses.listMyVenues()
      setVenues(list)
      setSelectedSlug(prev => prev ?? list[0]?.slug ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri učitavanju lokacija.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadVenues()
  }, [loadVenues])

  useEffect(() => {
    if (!selectedSlug) {
      setCatalog(null)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const data = await api.businesses.getVenueCatalog(selectedSlug)
        if (!cancelled) setCatalog(data ? structuredClone(data) : null)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Greška pri učitavanju kataloga.')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [selectedSlug])

  function updatePackage(id: string, patch: Partial<VenuePackage>) {
    setCatalog(prev => {
      if (!prev) return prev
      return {
        ...prev,
        packages: prev.packages.map(pkg => (pkg.id === id ? { ...pkg, ...patch } : pkg)),
      }
    })
  }

  function updateAddon(id: string, patch: Partial<VenueAddon>) {
    setCatalog(prev => {
      if (!prev) return prev
      return {
        ...prev,
        addons: prev.addons.map(addon => (addon.id === id ? { ...addon, ...patch } : addon)),
      }
    })
  }

  function addPackage() {
    setCatalog(prev => {
      if (!prev) return prev
      const sortOrder = prev.packages.length + 1
      return { ...prev, packages: [...prev.packages, createEmptyPackage(sortOrder)] }
    })
  }

  function removePackage(id: string) {
    setCatalog(prev => {
      if (!prev) return prev
      return { ...prev, packages: prev.packages.filter(pkg => pkg.id !== id) }
    })
  }

  function addAddon() {
    setCatalog(prev => {
      if (!prev) return prev
      const sortOrder = prev.addons.length + 1
      return { ...prev, addons: [...prev.addons, createEmptyAddon(sortOrder)] }
    })
  }

  function removeAddon(id: string) {
    setCatalog(prev => {
      if (!prev) return prev
      return { ...prev, addons: prev.addons.filter(addon => addon.id !== id) }
    })
  }

  async function handleSave() {
    if (!selectedSlug || !catalog) return

    const invalidPackage = catalog.packages.find(pkg => !pkg.name.trim() || pkg.basePriceEur < 0)
    if (invalidPackage) {
      setError('Svaki paket mora imati naziv i nenegativnu cijenu.')
      return
    }

    setSaving(true)
    setError(null)
    setSaveMessage(null)

    try {
      const updated = await api.businesses.updateVenueCatalog(selectedSlug, catalog)
      setCatalog(structuredClone(updated))
      setSaveMessage('Katalog je spremljen.')
      await loadVenues()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Spremanje nije uspjelo.')
    } finally {
      setSaving(false)
    }
  }

  const selectedVenue = venues.find(venue => venue.slug === selectedSlug)
  const activePackages = catalog?.packages.filter(pkg => pkg.active) ?? []
  const previewPriceFrom =
    activePackages.length > 0
      ? Math.min(...activePackages.map(pkg => pkg.basePriceEur))
      : selectedVenue?.priceFrom

  if (loading) {
    return (
      <div className="landing-page biz-catalog-page">
        <section className="biz-catalog">
          <div className="landing-container">
            <PageLoader message="Učitavanje kataloga..." />
          </div>
        </section>
      </div>
    )
  }

  if (venues.length === 0) {
    return (
      <div className="landing-page biz-catalog-page">
        <section className="biz-catalog">
          <div className="landing-container">
            <header className="biz-catalog__hero">
              <div>
                <p className="biz-catalog__eyebrow">Ponuda</p>
                <h1>Katalog paketa i dodataka</h1>
              </div>
            </header>
            <EmptyState
              icon="📦"
              title="Nema povezane lokacije"
              description="Vaš račun još nema igraonicu u katalogu. Osvježite stranicu ili kontaktirajte podršku."
              action={{ label: 'Postavke računa', to: ROUTES.business.settings }}
            />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="landing-page biz-catalog-page">
      <section className="biz-catalog">
        <div className="landing-container">
          <header className="biz-catalog__hero">
            <div>
              <p className="biz-catalog__eyebrow">Ponuda</p>
              <h1>Katalog paketa i dodataka</h1>
              <p>Uredite što roditelji vide pri rezervaciji — paketi, cijene i dodatne usluge.</p>
            </div>
            {selectedVenue && (
              <div className="biz-catalog__preview-pill">
                <span>Javno: od {formatCurrencyEur(previewPriceFrom ?? 0)}</span>
                <Link to={ROUTES.venueDetail(selectedVenue.slug)} target="_blank" rel="noreferrer">
                  Pregled profila ↗
                </Link>
              </div>
            )}
          </header>

          {venues.length > 1 && (
            <div className="biz-catalog__venue-tabs">
              {venues.map(venue => (
                <button
                  key={venue.slug}
                  type="button"
                  className={`biz-catalog__venue-tab ${selectedSlug === venue.slug ? 'biz-catalog__venue-tab--active' : ''}`}
                  onClick={() => setSelectedSlug(venue.slug)}
                >
                  {venue.name}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="biz-catalog__alert biz-catalog__alert--error" role="alert">
              {error}
            </div>
          )}
          {saveMessage && (
            <div className="biz-catalog__alert biz-catalog__alert--success" role="status">
              {saveMessage}
            </div>
          )}

          {!catalog ? (
            <PageError message="Katalog nije dostupan." onRetry={loadVenues} />
          ) : (
            <div className="biz-catalog__layout">
              <div className="biz-catalog__main">
                <article className="biz-catalog__card">
                  <h2>Opis lokacije</h2>
                  <textarea
                    rows={4}
                    value={catalog.description}
                    onChange={event => setCatalog({ ...catalog, description: event.target.value })}
                    placeholder="Opišite prostor, program i što roditelji mogu očekivati…"
                  />
                </article>

                <article className="biz-catalog__card">
                  <header className="biz-catalog__card-head">
                    <div>
                      <h2>Paketi rođendana</h2>
                      <p>Osnovne ponude s trajanjem i cijenom.</p>
                    </div>
                    <button type="button" className="biz-catalog__add-btn" onClick={addPackage}>
                      + Paket
                    </button>
                  </header>

                  <div className="biz-catalog__items">
                    {catalog.packages.map(pkg => (
                      <div key={pkg.id} className="biz-catalog__item">
                        <div className="biz-catalog__item-head">
                          <label className="biz-catalog__toggle">
                            <input
                              type="checkbox"
                              checked={pkg.active}
                              onChange={event => updatePackage(pkg.id, { active: event.target.checked })}
                            />
                            <span>Aktivan</span>
                          </label>
                          <button
                            type="button"
                            className="biz-catalog__remove"
                            onClick={() => removePackage(pkg.id)}
                            aria-label="Ukloni paket"
                          >
                            Ukloni
                          </button>
                        </div>
                        <div className="biz-catalog__grid">
                          <label>
                            Naziv
                            <input
                              value={pkg.name}
                              onChange={event => updatePackage(pkg.id, { name: event.target.value })}
                              placeholder="npr. Standard (2h)"
                            />
                          </label>
                          <label>
                            Cijena (€)
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={pkg.basePriceEur}
                              onChange={event =>
                                updatePackage(pkg.id, { basePriceEur: Number(event.target.value) })
                              }
                            />
                          </label>
                          <label>
                            Trajanje (h)
                            <input
                              type="number"
                              min={1}
                              max={8}
                              value={pkg.durationHours}
                              onChange={event =>
                                updatePackage(pkg.id, { durationHours: Number(event.target.value) })
                              }
                            />
                          </label>
                          <label>
                            Max. djece
                            <input
                              type="number"
                              min={1}
                              value={pkg.maxGuests ?? ''}
                              onChange={event =>
                                updatePackage(pkg.id, {
                                  maxGuests: event.target.value ? Number(event.target.value) : undefined,
                                })
                              }
                            />
                          </label>
                        </div>
                        <label>
                          Opis
                          <textarea
                            rows={2}
                            value={pkg.description}
                            onChange={event => updatePackage(pkg.id, { description: event.target.value })}
                          />
                        </label>
                        <label>
                          Uključeno (jedna stavka po retku)
                          <textarea
                            rows={3}
                            value={formatIncludedItems(pkg.includedItems)}
                            onChange={event =>
                              updatePackage(pkg.id, {
                                includedItems: parseIncludedItems(event.target.value),
                              })
                            }
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="biz-catalog__card">
                  <header className="biz-catalog__card-head">
                    <div>
                      <h2>Dodatne usluge</h2>
                      <p>Torta, mađioničar, fotograf i ostalo.</p>
                    </div>
                    <button type="button" className="biz-catalog__add-btn" onClick={addAddon}>
                      + Dodatak
                    </button>
                  </header>

                  <div className="biz-catalog__items">
                    {catalog.addons.map(addon => (
                      <div key={addon.id} className="biz-catalog__item biz-catalog__item--compact">
                        <div className="biz-catalog__item-head">
                          <label className="biz-catalog__toggle">
                            <input
                              type="checkbox"
                              checked={addon.active}
                              onChange={event => updateAddon(addon.id, { active: event.target.checked })}
                            />
                            <span>Aktivan</span>
                          </label>
                          <button
                            type="button"
                            className="biz-catalog__remove"
                            onClick={() => removeAddon(addon.id)}
                          >
                            Ukloni
                          </button>
                        </div>
                        <div className="biz-catalog__grid biz-catalog__grid--addon">
                          <label>
                            Naziv
                            <input
                              value={addon.name}
                              onChange={event => updateAddon(addon.id, { name: event.target.value })}
                            />
                          </label>
                          <label>
                            Kategorija
                            <select
                              value={addon.category}
                              onChange={event =>
                                updateAddon(addon.id, {
                                  category: event.target.value as VenueAddon['category'],
                                })
                              }
                            >
                              {Object.entries(ADDON_CATEGORY_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label>
                            Cijena (€)
                            <input
                              type="number"
                              min={0}
                              value={addon.priceEur}
                              onChange={event =>
                                updateAddon(addon.id, { priceEur: Number(event.target.value) })
                              }
                            />
                          </label>
                        </div>
                        <label>
                          Opis
                          <input
                            value={addon.description}
                            onChange={event => updateAddon(addon.id, { description: event.target.value })}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <aside className="biz-catalog__aside">
                <article className="biz-catalog__card biz-catalog__card--sticky">
                  <h2>Pregled za roditelje</h2>
                  <p className="biz-catalog__aside-hint">
                    Aktivni paketi i dodaci odmah se prikazuju na profilu igraonice i u rezervacijskom
                    wizardu.
                  </p>
                  <ul className="biz-catalog__preview-list">
                    {activePackages.length === 0 ? (
                      <li>Nema aktivnih paketa</li>
                    ) : (
                      activePackages.map(pkg => (
                        <li key={pkg.id}>
                          <strong>{pkg.name || 'Bez naziva'}</strong>
                          <span>{formatCurrencyEur(pkg.basePriceEur)} · {pkg.durationHours}h</span>
                        </li>
                      ))
                    )}
                  </ul>
                  <div className="biz-catalog__actions">
                    <button
                      type="button"
                      className="landing-btn landing-btn--primary"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Spremanje…' : 'Spremi katalog'}
                    </button>
                    <Link to={ROUTES.business.settings} className="landing-btn landing-btn--outline">
                      Natrag na postavke
                    </Link>
                  </div>
                </article>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default BusinessVenueCatalog
