import { Link } from 'react-router-dom'
import { openConsentPreferences } from '../../lib/consent'

function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-container landing-footer__grid">
        <div className="landing-footer__brand">
          <Link to="/" className="landing-footer__logo">
            Rođendaonica
          </Link>
          <p>Platforma za rezervacije rođendana u igraonicama i rođendaonicama diljem Hrvatske.</p>
          <p className="landing-footer__contact">
            <a href="mailto:podrska@rodendaonica.hr">podrska@rodendaonica.hr</a>
          </p>
        </div>

        <div>
          <h3>Platforma</h3>
          <ul>
            <li><Link to="/igraonice">Igraonice</Link></li>
            <li><Link to="/kako-funkcionira">Kako funkcionira</Link></li>
            <li><Link to="/cijene">Cijene</Link></li>
            <li><Link to="/rezerviraj">Rezerviraj termin</Link></li>
          </ul>
        </div>

        <div>
          <h3>Korisnici</h3>
          <ul>
            <li><Link to="/za-roditelje">Za roditelje</Link></li>
            <li><Link to="/za-igraonice">Za igraonice</Link></li>
            <li><Link to="/registracija">Registracija</Link></li>
            <li><Link to="/prijava">Prijava</Link></li>
          </ul>
        </div>

        <div>
          <h3>Pravno</h3>
          <ul>
            <li><Link to="/uvjeti">Uvjeti korištenja</Link></li>
            <li><Link to="/privatnost">Politika privatnosti</Link></li>
            <li><Link to="/kolacici">Politika kolačića</Link></li>
            <li>
              <button
                type="button"
                className="landing-footer__consent-btn"
                onClick={openConsentPreferences}
                aria-label="Uredi postavke privole i kolačića"
              >
                Uredi privole
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="landing-container landing-footer__bottom">
        <span>© {new Date().getFullYear()} Rođendaonica. Sva prava pridržana.</span>
        <span>Rezervacije igraonica · Hrvatska</span>
      </div>
    </footer>
  )
}

export default Footer
