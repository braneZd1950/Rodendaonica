import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import type { Venue } from '../../types'
import {
  CtaBand,
  FaqList,
  HomeHero,
  Section,
  StepsGrid,
} from '../../components/landing/LandingUi'
import { VenueCard } from '../../components/landing/VenueListing'

const faq = [
  {
    question: 'Je li korištenje platforme besplatno za roditelje?',
    answer:
      'Da. Registracija i pretraga igraonica su besplatne. Plaćate samo akontaciju ili puni iznos prema uvjetima odabrane igraonice.',
  },
  {
    question: 'Kako igraonice primaju rezervacije?',
    answer:
      'Nakon registracije dobivate pristup dashboardu s kalendarom, obavijestima o novim upitima i pregledom uplata.',
  },
  {
    question: 'Mogu li otkazati rezervaciju?',
    answer:
      'Pravila otkazivanja definira svaka igraonica. Uvjeti su vidljivi prije potvrde rezervacije.',
  },
]

function Home() {
  const [venues, setVenues] = useState<Venue[]>([])

  useEffect(() => {
    api.venues.list().then(setVenues)
  }, [])

  const featured = venues.filter(v => v.featured)

  return (
    <div className="landing-page">
      <HomeHero
        stats={[
          { value: '120+', label: 'Igraonica u bazi' },
          { value: '4.8', label: 'Prosječna ocjena' },
          { value: '15 min', label: 'Prosječno do rezervacije' },
          { value: '24/7', label: 'Dostupna pretraga' },
        ]}
      />

      <Section
        eyebrow="Proces"
        title="Kako funkcionira"
        subtitle="Tri koraka od ideje do potvrđenog termina."
      >
        <StepsGrid
          steps={[
            {
              title: 'Pretražite i usporedite',
              text: 'Filtrirajte po gradu, cijeni, kapacitetu i dobi djece.',
            },
            {
              title: 'Odaberite termin',
              text: 'Pogledajte slobodne termine i paket usluga koji vam odgovara.',
            },
            {
              title: 'Platite akontaciju',
              text: 'Sigurna online uplata i potvrda rezervacije na email.',
            },
          ]}
        />
      </Section>

      <Section
        eyebrow="Preporuka"
        title="Istaknute igraonice"
        subtitle="Popularni odabiri roditelja u vašem gradu."
        variant="muted"
      >
        <div className="venue-grid">
          {featured.map(venue => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
        <p className="landing-section__cta-row">
          <Link to="/igraonice" className="landing-btn landing-btn--outline">
            Vidi sve igraonice
          </Link>
        </p>
      </Section>

      <Section eyebrow="Korisnici" title="Jedna platforma, dvije uloge">
        <div className="landing-split">
          <div className="landing-split__panel landing-split__panel--parent">
            <h3>Za roditelje</h3>
            <p>Organizirajte rođendan bez desetina telefonskih poziva i nejasnih cijena.</p>
            <ul>
              <li>Transparentni paketi i cijene</li>
              <li>Recenzije stvarnih korisnika</li>
              <li>Online plaćanje akontacije</li>
            </ul>
            <Link to="/za-roditelje" className="landing-btn landing-btn--primary">
              Saznaj više
            </Link>
          </div>
          <div className="landing-split__panel landing-split__panel--business">
            <h3>Za igraonice</h3>
            <p>Povećajte popunjenost termina i smanjite administrativni posao.</p>
            <ul>
              <li>Kalendar i upravljanje rezervacijama</li>
              <li>Pregled prihoda i statistika</li>
              <li>Bez početne pretplate u MVP fazi</li>
            </ul>
            <Link to="/za-igraonice" className="landing-btn landing-btn--secondary">
              Pridruži se platformi
            </Link>
          </div>
        </div>
      </Section>

      <Section eyebrow="Podrška" title="Česta pitanja" variant="muted">
        <FaqList items={faq} />
      </Section>

      <CtaBand
        title="Spremni za rezervaciju?"
        text="Kreirajte besplatni račun i rezervirajte prvi termin u nekoliko minuta."
        primary={{ label: 'Rezerviraj termin', to: '/rezerviraj' }}
        secondary={{ label: 'Registracija', to: '/registracija' }}
      />
    </div>
  )
}

export default Home
