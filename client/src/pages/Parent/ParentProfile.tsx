import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { api } from '../../api'

import { ROUTES } from '../../constants/routes'

import type { ParentUser, Venue } from '../../types'



function initials(firstName: string, lastName: string) {

  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()

}



function ParentProfile() {

  const [parent, setParent] = useState<ParentUser | null>(null)

  const [venues, setVenues] = useState<Venue[]>([])



  useEffect(() => {

    ;(async () => {

      const [currentParent, allVenues] = await Promise.all([api.parents.getCurrent(), api.venues.list()])

      setParent(currentParent)

      setVenues(allVenues)

    })()

  }, [])



  if (!parent) {

    return (

      <div className="landing-page parent-profile-page">

        <section className="parent-profile">

          <div className="landing-container">

            <p className="parent-profile__loading">Učitavanje profila...</p>

          </div>

        </section>

      </div>

    )

  }



  const quickPicks = venues.filter(venue => parent.favoriteVenueSlugs.includes(venue.slug)).slice(0, 4)



  const reviewOverview = quickPicks

    .map(venue => ({

      id: venue.id,

      slug: venue.slug,

      name: venue.name,

      rating: venue.rating,

      reviewCount: venue.reviewCount,

    }))

    .sort((a, b) => b.rating - a.rating)



  return (

    <div className="landing-page parent-profile-page">

      <section className="parent-profile">

        <div className="landing-container">

          <header className="parent-profile__hero">

            <div className="parent-profile__avatar" aria-hidden>

              {initials(parent.firstName, parent.lastName)}

            </div>

            <div className="parent-profile__intro">

              <p className="parent-profile__eyebrow">Moj profil</p>

              <h1>

                {parent.firstName} {parent.lastName}

              </h1>

              <div className="parent-profile__meta">

                <span>{parent.email}</span>

                {parent.phone && <span>{parent.phone}</span>}

                {parent.city && <span>{parent.city}</span>}

              </div>

            </div>

            <div className="parent-profile__hero-actions">

              <Link to={ROUTES.parent.reservations} className="landing-btn landing-btn--primary">

                Moje rezervacije

              </Link>

              <Link to={ROUTES.book} className="landing-btn landing-btn--outline">

                Brzo rezerviraj

              </Link>

            </div>

          </header>



          <div className="parent-profile__grid">

            {parent.children.length > 0 && (

              <article className="parent-profile__card">

                <h2>Djeca</h2>

                <ul className="parent-profile__children">

                  {parent.children.map(child => (

                    <li key={child.id}>

                      <span className="parent-profile__child-name">{child.name}</span>

                      <span className="parent-profile__child-meta">

                        {child.birthYear}. god.

                        {child.interests.length > 0 && ` · ${child.interests.slice(0, 2).join(', ')}`}

                      </span>

                    </li>

                  ))}

                </ul>

              </article>

            )}



            <article className="parent-profile__card">

              <div className="parent-profile__card-head">

                <h2>Omiljene igraonice</h2>

                <Link to={ROUTES.venues} className="parent-profile__card-link">

                  Sve igraonice

                </Link>

              </div>

              {quickPicks.length === 0 ? (

                <p className="parent-profile__empty">Još nema spremljenih igraonica.</p>

              ) : (

                <ul className="parent-profile__venues">

                  {quickPicks.map(venue => (

                    <li key={venue.id}>

                      <Link to={`/igraonice/${venue.slug}`} className="parent-profile__venue">

                        <span className="parent-profile__venue-name">{venue.name}</span>

                        <span className="parent-profile__venue-meta">

                          {venue.city} · od {venue.priceFrom} €

                        </span>

                        <span className="parent-profile__venue-arrow" aria-hidden>

                          →

                        </span>

                      </Link>

                    </li>

                  ))}

                </ul>

              )}

            </article>



            <article className="parent-profile__card">

              <h2>Recenzije igraonica</h2>

              {reviewOverview.length === 0 ? (

                <p className="parent-profile__empty">Nema podataka za prikaz.</p>

              ) : (

                <ul className="parent-profile__reviews">

                  {reviewOverview.map(item => (

                    <li key={item.id}>

                      <Link to={`/igraonice/${item.slug}`} className="parent-profile__review">

                        <span className="parent-profile__review-name">{item.name}</span>

                        <span className="parent-profile__review-rating">

                          ★ {item.rating.toFixed(1)}

                          <span className="parent-profile__review-count">({item.reviewCount})</span>

                        </span>

                      </Link>

                    </li>

                  ))}

                </ul>

              )}

            </article>



            <article className="parent-profile__card parent-profile__card--messages">

              <h2>Poruke</h2>

              <p>Razgovarajte s igraonicom oko termina, dodataka i detalja rođendana.</p>

              <Link to={ROUTES.parent.messages} className="parent-profile__messages-btn">

                Otvori poruke

              </Link>

            </article>

          </div>

        </div>

      </section>

    </div>

  )

}



export default ParentProfile


