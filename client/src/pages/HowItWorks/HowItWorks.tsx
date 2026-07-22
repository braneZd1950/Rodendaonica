import { CtaBand, FaqList, PageHero, Section, StepsGrid } from '../../components/landing/LandingUi'

function HowItWorks() {
  return (
    <div className="landing-page">
      <PageHero
        eyebrow="Proces"
        title="Kako Rođendaonica funkcionira"
        subtitle="Jasan proces za roditelje i igraonice — od pretrage do potvrđene rezervacije i uplate."
        primaryAction={{ label: 'Pronađi igraonicu', to: '/igraonice' }}
        secondaryAction={{ label: 'Cijene', to: '/cijene' }}
      />

      <Section eyebrow="Roditelji" title="Za roditelje">
        <StepsGrid
          steps={[
            {
              title: 'Registracija i profil',
              text: 'Kreirajte račun s emailom ili Googleom. Spremite podatke o djetetu za brže buduće rezervacije.',
            },
            {
              title: 'Odabir igraonice',
              text: 'Koristite filtere za grad, budžet i broj gostiju. Proučite recenzije i pakete usluga.',
            },
            {
              title: 'Rezervacija i uplata',
              text: 'Odaberite datum i termin. Platite akontaciju karticom i primite potvrdu na email.',
            },
            {
              title: 'Dan rođendana',
              text: 'Igraonica ima sve detalje rezervacije. Nakon događaja možete ostaviti recenziju.',
            },
          ]}
        />
      </Section>

      <Section eyebrow="Partneri" title="Za igraonice" variant="muted">
        <StepsGrid
          steps={[
            {
              title: 'Onboarding',
              text: 'Registrirajte poslovni profil, dodajte opis, slike i pakete (npr. 2h rođendan s animatorom).',
            },
            {
              title: 'Kalendar termina',
              text: 'Označite slobodne i zauzete termine. Postavite buffer između rezervacija.',
            },
            {
              title: 'Upravljanje rezervacijama',
              text: 'Instant booking ili ručna potvrda. Pregled gostiju, napomena i statusa uplate.',
            },
            {
              title: 'Izvještaji',
              text: 'Pregled zarade, popunjenosti i trendova — za bolje planiranje kapaciteta.',
            },
          ]}
        />
      </Section>

      <Section eyebrow="Sigurnost" title="Sigurnost i transparentnost">
        <FaqList
          items={[
            {
              question: 'Tko definira cijene?',
              answer: 'Svaka igraonica postavlja vlastite pakete i cijene. Na platformi su uvijek jasno prikazani prije rezervacije.',
            },
            {
              question: 'Kako funkcionira plaćanje?',
              answer:
                'Roditelj plaća akontaciju online (Stripe / CorvusPay). Igraonica dobiva obavijest i potvrdu u dashboardu.',
            },
            {
              question: 'Što ako igraonica otkaže termin?',
              answer:
                'Politika otkazivanja i povrata definirana je u uvjetima igraonice. Platforma olakšava komunikaciju i evidenciju.',
            },
          ]}
        />
      </Section>

      <CtaBand
        title="Isprobajte proces uživo"
        text="Pregledajte dostupne igraonice ili se registrirajte kao partner."
        primary={{ label: 'Igraonice', to: '/igraonice' }}
        secondary={{ label: 'Za igraonice', to: '/za-igraonice' }}
      />
    </div>
  )
}

export default HowItWorks
