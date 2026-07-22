import { CtaBand, FeatureGrid, PageHero, Section, FaqList } from '../../components/landing/LandingUi'

function ForParents() {
  return (
    <div className="landing-page">
      <PageHero
        tone="parent"
        eyebrow="Za roditelje"
        title="Organizirajte rođendan s povjerenjem"
        subtitle="Usporedite igraonice, provjerite dostupnost i rezervirajte termin — bez gubljenja vremena na pozive i nejasne ponude."
        primaryAction={{ label: 'Pregledaj igraonice', to: '/igraonice' }}
        secondaryAction={{ label: 'Rezerviraj termin', to: '/rezerviraj' }}
      />

      <Section eyebrow="Prednosti" title="Zašto roditelji biraju Rođendaonicu">
        <FeatureGrid
          items={[
            {
              title: 'Jasne cijene i paketi',
              text: 'Vidite što je uključeno u cijenu prije nego što rezervirate — animator, torta, dekoracije.',
              tone: 'parent',
            },
            {
              title: 'Provjerene recenzije',
              text: 'Ocjene i komentari od roditelja koji su stvarno održali događaj na toj lokaciji.',
              tone: 'parent',
            },
            {
              title: 'Sigurna online uplata',
              text: 'Akontacija karticom uz potvrdu na email. Manje nesporazuma oko termina.',
              tone: 'parent',
            },
            {
              title: 'Sve na jednom mjestu',
              text: 'Povijest rezervacija, kontakt igraonice i podsjetnici — bez raštrkanih poruka.',
              tone: 'parent',
            },
            {
              title: 'Filteri koji štede vrijeme',
              text: 'Grad, kapacitet, dob djece i budžet — pronađite odgovarajuću igraonicu za 15 minuta.',
              tone: 'parent',
            },
            {
              title: 'Podrška',
              text: 'Pomoć pri tehničkim pitanjima i eskalacija ako partner ne odgovori na vrijeme.',
              tone: 'parent',
            },
          ]}
        />
      </Section>

      <Section eyebrow="FAQ" title="Česta pitanja roditelja" variant="muted">
        <FaqList
          items={[
            {
              question: 'Moram li se registrirati za pretragu?',
              answer: 'Pretragu možete pregledavati odmah. Za rezervaciju i plaćanje potreban je besplatni račun.',
            },
            {
              question: 'Mogu li rezervirati više djece / veći broj gostiju?',
              answer: 'Kapacitet je naveden na profilu svake igraonice. Pri rezervaciji unesite očekivani broj gostiju.',
            },
            {
              question: 'Što ako trebam promijeniti termin?',
              answer: 'Kontaktirajte igraonicu putem platforme. Promjene ovise o njihovoj politici otkazivanja.',
            },
          ]}
        />
      </Section>

      <CtaBand
        title="Pronađite idealnu igraonicu"
        text="Besplatna registracija. Prva rezervacija u nekoliko koraka."
        primary={{ label: 'Kreiraj račun', to: '/registracija' }}
        secondary={{ label: 'Već imam račun', to: '/prijava' }}
      />
    </div>
  )
}

export default ForParents
