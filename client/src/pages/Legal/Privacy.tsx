import { PageHero } from '../../components/landing/LandingUi'

function Privacy() {
  return (
    <div className="landing-page">
      <PageHero
        eyebrow="Pravno"
        title="Politika privatnosti"
        subtitle="Kako prikupljamo, koristimo i štitimo vaše osobne podatke u skladu s GDPR-om."
        compact
      />

      <div className="landing-container landing-legal">
        <p className="landing-legal__updated">Zadnje ažuriranje: svibanj 2026.</p>

        <h2>1. Voditelj obrade</h2>
        <p>
          Rođendaonica d.o.o. (placeholder) — kontakt:{' '}
          <a href="mailto:privatnost@rodendaonica.hr">privatnost@rodendaonica.hr</a>
        </p>

        <h2>2. Koje podatke prikupljamo</h2>
        <ul>
          <li>Identifikacijski podaci (ime, email, telefon)</li>
          <li>Podaci o rezervacijama i plaćanjima</li>
          <li>Tehnički podaci (IP, uređaj, kolačići)</li>
        </ul>

        <h2>3. Svrha obrade</h2>
        <p>
          Podatke koristimo za pružanje usluge rezervacije, komunikaciju s korisnicima, sigurnost platforme
          i zakonske obveze.
        </p>

        <h2>4. Dijeljenje podataka</h2>
        <p>
          Podatke dijelimo s igraonicama u svrhu realizacije rezervacije te s procesorima plaćanja (npr.
          Stripe) prema ugovorima o obradi.
        </p>

        <h2>5. Vaša prava</h2>
        <p>
          Imate pravo na pristup, ispravak, brisanje, ograničenje obrade i prigovor. Zahtjev pošaljite na{' '}
          <a href="mailto:privatnost@rodendaonica.hr">privatnost@rodendaonica.hr</a>.
        </p>

        <h2>6. Kolačići</h2>
        <p>
          Koristimo nužne, analitičke i marketinške kolačiće prema vašim privolama. Detalje i vrste
          kolačića pogledajte u <a href="/kolacici">Politici kolačića</a>.
        </p>
      </div>
    </div>
  )
}

export default Privacy
