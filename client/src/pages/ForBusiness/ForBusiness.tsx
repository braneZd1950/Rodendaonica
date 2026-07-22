import { Link } from 'react-router-dom'
import { CtaBand, FeatureGrid, PageHero, Section, FaqList } from '../../components/landing/LandingUi'

function ForBusiness() {
  return (
    <div className="landing-page">
      <PageHero
        tone="business"
        eyebrow="Za igraonice"
        title="Više rezervacija, manje administracije"
        subtitle="Digitalizirajte kalendar, prihvatite online akontacije i privucite nove klijente bez velikog početnog ulaganja."
        primaryAction={{ label: 'Registriraj igraonicu', to: '/registracija' }}
        secondaryAction={{ label: 'Cijene za partnere', to: '/cijene' }}
      />

      <Section eyebrow="Alati" title="Alati za rast vašeg poslovanja">
        <FeatureGrid
          items={[
            {
              title: 'Dashboard i kalendar',
              text: 'Pregled dnevnih i tjednih termina, statusa rezervacija i popunjenosti kapaciteta.',
              tone: 'business',
            },
            {
              title: 'Upravljanje paketima',
              text: 'Kreirajte pakete po trajanju, broju djece i uključenim uslugama.',
              tone: 'business',
            },
            {
              title: 'Online akontacije',
              text: 'Manje nepojavljivanja gostiju uz plaćenu akontaciju pri rezervaciji.',
              tone: 'business',
            },
            {
              title: 'Profil koji prodaje',
              text: 'Fotografije, opis, lokacija i recenzije — sve na jednoj profesionalnoj stranici.',
              tone: 'business',
            },
            {
              title: 'Obavijesti u realnom vremenu',
              text: 'Email obavijest za svaki novi upit ili potvrđenu rezervaciju.',
              tone: 'business',
            },
            {
              title: 'Izvještaji',
              text: 'Pregled prihoda, broja događaja i sezonskih trendova za bolje planiranje.',
              tone: 'business',
            },
          ]}
        />
      </Section>

      <Section
        eyebrow="Suradnja"
        title="Fiksna pretplata. Nula provizije."
        subtitle="Predvidljiv trošak za igraonicu — roditelji platformu koriste besplatno."
        variant="muted"
      >
        <div className="biz-collab">
          <div className="biz-collab__highlight">
            <span className="biz-collab__highlight-value">0%</span>
            <div className="biz-collab__highlight-copy">
              <strong>Bez provizije po rezervaciji</strong>
              <p>
                Naplaćujemo samo mjesečnu pretplatu. Što više termina popunite, to je model
                povoljniji za vas.
              </p>
            </div>
          </div>

          <ol className="biz-collab__tiers" aria-label="Pretplatnički paketi">
            <li className="biz-collab__tier">
              <span className="biz-collab__tier-name">Osnovna</span>
              <span className="biz-collab__tier-price">
                25 €<small>/mj</small>
              </span>
              <span className="biz-collab__tier-note">Digitalne rezervacije</span>
            </li>
            <li className="biz-collab__tier biz-collab__tier--featured">
              <span className="biz-collab__tier-badge">Najčešći izbor</span>
              <span className="biz-collab__tier-name">Proširena</span>
              <span className="biz-collab__tier-price">
                35 €<small>/mj</small>
              </span>
              <span className="biz-collab__tier-note">Više alata i vidljivosti</span>
            </li>
            <li className="biz-collab__tier">
              <span className="biz-collab__tier-name">Premium</span>
              <span className="biz-collab__tier-price">
                50 €<small>/mj</small>
              </span>
              <span className="biz-collab__tier-note">Prioritet i više lokacija</span>
            </li>
          </ol>

          <div className="biz-collab__footer">
            <p>Roditelji i dalje koriste pretragu i rezervacije bez naknade.</p>
            <Link to="/cijene" className="landing-btn landing-btn--outline">
              Usporedite pakete
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Section>

      <Section eyebrow="FAQ" title="Pitanja vlasnika igraonica">
        <FaqList
          items={[
            {
              question: 'Koliko traje postavljanje profila?',
              answer: 'Osnovni profil možete objaviti u jednom danu. Preporučujemo kvalitetne fotografije i jasne pakete.',
            },
            {
              question: 'Mogu li ručno potvrđivati rezervacije?',
              answer: 'Da. Možete uključiti instant booking ili model gdje vi potvrđujete svaki upit.',
            },
            {
              question: 'Kako funkcionira pretplata?',
              answer:
                'Odaberete paket (Osnovna, Proširena ili Premium) i plaćate fiksni iznos mjesečno. Nema postotka od rezervacija — što više termina popunite, to je model povoljniji za vas.',
            },
            {
              question: 'Kada dobivam isplatu od akontacija?',
              answer: 'Isplate se planiraju prema ugovorenom ciklusu nakon održanog događaja (detalji u partnerskom ugovoru).',
            },
          ]}
        />
      </Section>

      <CtaBand
        title="Postanite partner"
        text="Pridružite se mreži igraonica koje već koriste digitalne rezervacije."
        primary={{ label: 'Registracija', to: '/registracija' }}
        secondary={{ label: 'Kako funkcionira', to: '/kako-funkcionira' }}
      />
    </div>
  )
}

export default ForBusiness
