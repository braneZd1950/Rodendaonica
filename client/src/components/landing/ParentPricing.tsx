import { Link } from 'react-router-dom'
import { LandingButton } from './LandingUi'

const freeItems = [
  {
    title: 'Pretraga i usporedba',
    text: 'Pregledajte igraonice po gradu, cijeni, kapacitetu i recenzijama — bez ograničenja.',
  },
  {
    title: 'Besplatna registracija',
    text: 'Račun za roditelje ne nosi mjesečnu naknadu niti skrivene troškove platforme.',
  },
  {
    title: 'Profil i povijest',
    text: 'Spremite omiljene lokacije, pratite rezervacije i primajte potvrde na email.',
  },
  {
    title: 'Recenzije nakon događaja',
    text: 'Podijelite iskustvo kako biste pomogli drugim roditeljima u odluci.',
  },
]

const paidItems = [
  {
    title: 'Cijena paketa igraonice',
    text: 'Svaka lokacija objavljuje jasne pakete (npr. 2h rođendan, animator, torta). Cijena je vidljiva prije rezervacije.',
  },
  {
    title: 'Online akontacija',
    text: 'Pri potvrdi rezervacije plaćate dio iznosa karticom — obično 20–40% ovisno o uvjetima partnera.',
  },
  {
    title: 'Ostatak iznosa',
    text: 'Preostali iznos podmirujete izravno s igraonicom na dan događaja ili prema njihovim pravilima.',
  },
  {
    title: 'Dodatne usluge',
    text: 'Ako naručite dodatke (npr. fotograf, posebna torta), to se dogovara s igraonicom i prikazuje u sažetku.',
  },
]

const flowSteps = [
  {
    step: '01',
    title: 'Odaberite paket',
    text: 'Na profilu igraonice vidite što je uključeno i ukupnu cijenu termina.',
  },
  {
    step: '02',
    title: 'Platite akontaciju',
    text: 'Sigurna online uplata potvrđuje termin. Iznos akontacije prikazan je prije plaćanja.',
  },
  {
    step: '03',
    title: 'Potvrda i podsjetnik',
    text: 'Primite email s detaljima. Igraonica vidi rezervaciju u svom kalendaru.',
  },
]

const parentFaq = [
  {
    question: 'Zašto ne plaćam platformi mjesečnu pretplatu?',
    answer:
      'Rođendaonica je besplatna za roditelje. Naš prihod dolazi od suradnje s igraonicama koje koriste platformu za rezervacije — vi plaćate samo uslugu rođendana, ne i pristup pretrazi.',
  },
  {
    question: 'Kolika je akontacija i mogu li je dobiti natrag?',
    answer:
      'Visina akontacije postavlja svaka igraonica i prikazuje se prije potvrde. Uvjeti otkazivanja i povrata definirani su na profilu partnera i u potvrdi rezervacije.',
  },
  {
    question: 'Postoje li dodatne naknade platforme na moj račun?',
    answer:
      'Ne naplaćujemo naknadu za registraciju, pretragu ili slanje upita. Na checkoutu vidite točno što plaćate igraonici i koliko ide kao akontacija.',
  },
  {
    question: 'Kako znam da je cijena konačna?',
    answer:
      'Paket i uključene usluge navedeni su na profilu igraonice. Ako trebate prilagodbu (više djece, dodatni sat), to se dogovara prije plaćanja i evidentira u sažetku.',
  },
]

export function ParentPricingOverview() {
  return (
    <div className="pricing-parent">
      <div className="pricing-parent__intro">
        <div className="pricing-parent__badge">Za roditelje</div>
        <h2 className="pricing-parent__headline">
          Platforma je besplatna — plaćate samo rođendan u igraonici
        </h2>
        <p className="pricing-parent__lead">
          Bez mjesečne članarine i bez skrivenih naknada za korištenje Rođendaonice. Trošak događaja
          određuje igraonica; vi unaprijed znate paket, akontaciju i što je uključeno u cijenu.
        </p>
        <div className="pricing-parent__intro-actions">
          <LandingButton to="/registracija">Kreiraj besplatni račun</LandingButton>
          <LandingButton to="/igraonice" variant="outline">
            Pregledaj igraonice
          </LandingButton>
        </div>
      </div>

      <div className="pricing-parent__highlight">
        <div className="pricing-parent__price-block">
          <span className="pricing-parent__price-label">Pretplata na platformu</span>
          <p className="pricing-parent__price">0 €</p>
          <p className="pricing-parent__price-note">mjesečno · bez ugovorne obveze</p>
        </div>
        <ul className="pricing-parent__highlights">
          <li>Neograničena pretraga</li>
          <li>Online rezervacija i akontacija</li>
          <li>Povijest i potvrde na email</li>
          <li>Podrška na hrvatskom</li>
        </ul>
      </div>

      <div className="pricing-parent__split">
        <div className="pricing-parent__panel pricing-parent__panel--free">
          <h3>Što je besplatno</h3>
          <p className="pricing-parent__panel-desc">
            Sve što vam treba za pronalazak i organizaciju — bez plaćanja platformi.
          </p>
          <ul className="pricing-parent__list">
            {freeItems.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pricing-parent__panel pricing-parent__panel--paid">
          <h3>Što plaćate igraonici</h3>
          <p className="pricing-parent__panel-desc">
            Cijena rođendana dolazi od odabranog paketa i uvjeta partnera — uvijek prije potvrde.
          </p>
          <ul className="pricing-parent__list">
            {paidItems.map(item => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pricing-parent__flow">
        <h3 className="pricing-parent__flow-title">Kako izgleda plaćanje</h3>
        <ol className="pricing-parent__flow-steps">
          {flowSteps.map(item => (
            <li key={item.step}>
              <span className="pricing-parent__flow-num">{item.step}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <aside className="pricing-parent__example" aria-label="Primjer izračuna">
        <div className="pricing-parent__example-head">
          <span>Primjer</span>
          <strong>Rođendanski paket od 280 €</strong>
        </div>
        <dl className="pricing-parent__example-rows">
          <div>
            <dt>Ukupna cijena paketa</dt>
            <dd>280 €</dd>
          </div>
          <div>
            <dt>Akontacija online (30%)</dt>
            <dd>84 €</dd>
          </div>
          <div className="pricing-parent__example-total">
            <dt>Ostatak (prema uvjetima igraonice)</dt>
            <dd>196 €</dd>
          </div>
        </dl>
        <p className="pricing-parent__example-note">
          Stvarni postotak akontacije i rok plaćanja ostatka definira svaka igraonica. Sve je
          prikazano u sažetku prije nego potvrdite rezervaciju.
        </p>
      </aside>
    </div>
  )
}

export function ParentPricingFaq() {
  return (
    <div className="pricing-parent-faq">
      {parentFaq.map(item => (
        <details key={item.question} className="pricing-parent-faq__item">
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

export function BusinessPricingTeaser() {
  return (
    <div className="pricing-business-teaser">
      <p>
        Vlasnik ste igraonice? Fiksna mjesečna pretplata od 25 € — bez provizije po svakoj rezervaciji.
        Pogledajte pakete Osnovna, Proširena i Premium.
      </p>
      <Link to="/cijene#partneri" className="landing-btn landing-btn--outline">
        Paketi pretplate
      </Link>
    </div>
  )
}
