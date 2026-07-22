import { PageHero } from '../../components/landing/LandingUi'

function Terms() {
  return (
    <div className="landing-page">
      <PageHero
        eyebrow="Pravno"
        title="Uvjeti korištenja"
        subtitle="Opći uvjeti korištenja platforme Rođendaonica. Dokument je informativan do finalne pravne revizije."
        compact
      />

      <div className="landing-container landing-legal">
        <p className="landing-legal__updated">Zadnje ažuriranje: svibanj 2026.</p>

        <h2>1. Opće odredbe</h2>
        <p>
          Rođendaonica je platforma koja povezuje roditelje i pružatelje usluga (igraonice, rođendaonice).
          Korištenjem platforme prihvaćate ove uvjete.
        </p>

        <h2>2. Registracija</h2>
        <p>
          Korisnik je odgovoran za točnost unesenih podataka. Račun je osoban i ne smije se dijeliti s
          trećim stranama bez odobrenja.
        </p>

        <h2>3. Rezervacije i plaćanja</h2>
        <p>
          Ugovor o usluzi sklapa se između roditelja i igraonice. Platforma posreduje u rezervaciji i
          naplati akontacije prema prikazanim uvjetima partnera.
        </p>

        <h2>4. Otkazivanje</h2>
        <p>
          Politika otkazivanja i povrata definirana je na profilu svake igraonice i prikazana prije
          potvrde rezervacije.
        </p>

        <h2>5. Odgovornost</h2>
        <p>
          Platforma ne snosi odgovornost za kvalitetu usluge igraonice, ali nastoji osigurati moderaciju
          profila i recenzija.
        </p>

        <h2>6. Kontakt</h2>
        <p>
          Za pitanja:{' '}
          <a href="mailto:podrska@rodendaonica.hr">podrska@rodendaonica.hr</a>
        </p>
      </div>
    </div>
  )
}

export default Terms
