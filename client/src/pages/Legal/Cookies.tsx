import { PageHero } from '../../components/landing/LandingUi'

function Cookies() {
  return (
    <div className="landing-page">
      <PageHero
        eyebrow="Pravno"
        title="Politika kolačića"
        subtitle="Objašnjenje koje kolačiće koristimo, zašto ih koristimo i kako možete upravljati privolama."
        compact
      />

      <div className="landing-container landing-legal">
        <p className="landing-legal__updated">Zadnje ažuriranje: svibanj 2026.</p>

        <h2>1. Što su kolačići</h2>
        <p>
          Kolačići su male tekstualne datoteke koje se spremaju na vaš uređaj kada posjetite web
          stranicu. Pomažu u stabilnom radu stranice, sigurnosti i poboljšanju korisničkog iskustva.
        </p>

        <h2>2. Vrste kolačića koje koristimo</h2>
        <ul>
          <li>Nužni kolačići — potrebni za osnovne funkcije aplikacije i sigurnost sesije.</li>
          <li>Analitički kolačići — pomažu razumjeti korištenje stranice i poboljšati UX.</li>
          <li>Marketinški kolačići — koriste se za relevantne kampanje i mjerenje učinkovitosti.</li>
        </ul>

        <h2>3. Pravna osnova</h2>
        <p>
          Nužni kolačići obrađuju se temeljem legitimnog interesa, dok se analitički i marketinški
          kolačići aktiviraju samo uz vašu privolu.
        </p>

        <h2>4. Upravljanje postavkama</h2>
        <p>
          Postavke možete definirati kroz banner privole pri prvom posjetu. Kasnije ih možete
          promijeniti u podnožju stranice, u odjeljku Pravno, poveznicom «Uredi privole». Također ih
          možete prilagoditi u postavkama preglednika, gdje možete blokirati ili obrisati kolačiće.
        </p>

        <h2>5. Kontakt</h2>
        <p>
          Za pitanja o kolačićima i obradi podataka kontaktirajte nas na{' '}
          <a href="mailto:privatnost@rodendaonica.hr">privatnost@rodendaonica.hr</a>.
        </p>
      </div>
    </div>
  )
}

export default Cookies
