import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

type HeaderVariant = 'public' | 'parent' | 'business' | 'admin'

interface HeaderProps {
  variant?: HeaderVariant
}

type NavKind = 'default' | 'ghost' | 'cta' | 'audience-parent' | 'audience-business'

interface NavItem {
  to: string
  label: string
  kind?: NavKind
}

const navConfig: Record<HeaderVariant, { left: NavItem[]; right: NavItem[] }> = {
  public: {
    left: [
      { to: '/igraonice', label: 'Igraonice' },
      { to: '/kako-funkcionira', label: 'Kako funkcionira' },
      { to: '/cijene', label: 'Cijene' },
    ],
    right: [
      { to: '/za-roditelje', label: 'Roditelji', kind: 'audience-parent' },
      { to: '/za-igraonice', label: 'Igraonice', kind: 'audience-business' },
      { to: '/prijava', label: 'Prijava', kind: 'ghost' },
      { to: '/rezerviraj', label: 'Rezerviraj termin', kind: 'cta' },
    ],
  },
  parent: {
    left: [
      { to: '/igraonice', label: 'Igraonice' },
      { to: '/rezervacije', label: 'Moje rezervacije' },
      { to: '/poruke', label: 'Poruke' },
    ],
    right: [
      { to: '/profil', label: 'Profil' },
      { to: '/odjava', label: 'Odjava', kind: 'ghost' },
    ],
  },
  business: {
    left: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/kalendar', label: 'Kalendar' },
      { to: '/poslovne-rezervacije', label: 'Rezervacije' },
      { to: '/poslovne-poruke', label: 'Poruke' },
      { to: '/recenzije', label: 'Recenzije' },
      { to: '/postavke-igraonice/katalog', label: 'Katalog' },
    ],
    right: [
      { to: '/postavke-igraonice', label: 'Postavke' },
      { to: '/odjava', label: 'Odjava', kind: 'ghost' },
    ],
  },
  admin: {
    left: [
      { to: '/admin', label: 'Pregled' },
      { to: '/admin/igraonice', label: 'Igraonice' },
      { to: '/admin/korisnici', label: 'Korisnici' },
    ],
    right: [{ to: '/odjava', label: 'Odjava', kind: 'ghost' }],
  },
}

function linkClassName(kind: NavKind | undefined, isActive: boolean, isMobile: boolean) {
  const classes = ['header__link']

  if (isActive) classes.push('header__link--active')
  if (kind === 'ghost') classes.push('header__link--ghost')
  if (kind === 'cta') classes.push(isMobile ? 'header__mobile-cta' : 'header__cta')
  if (kind === 'audience-parent') classes.push('header__link--audience-parent')
  if (kind === 'audience-business') classes.push('header__link--audience-business')
  if (!kind || kind === 'default') classes.push('header__link--default')

  return classes.join(' ')
}

function Header({ variant = 'public' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = navConfig[variant]

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  function renderNavItems(items: NavItem[], isMobile = false) {
    return items.map(item => (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => isMobile && setMenuOpen(false)}
        className={({ isActive }) => linkClassName(item.kind, isActive, isMobile)}
      >
        {item.label}
      </NavLink>
    ))
  }

  return (
    <header className={`header header--${variant} ${menuOpen ? 'header--open' : ''}`}>
      <div className="header__backdrop" aria-hidden />
      <div className="header__glow" aria-hidden />

      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setMenuOpen(false)}>
          <span className="header__logo-mark" aria-hidden>
            <svg viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6c5ce7" />
                  <stop offset="0.5" stopColor="#ff6b9d" />
                  <stop offset="1" stopColor="#ffd166" />
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="12" fill="url(#logoGrad)" />
              <path
                d="M12 26c0-4.4 3.6-8 8-8s8 3.6 8 8M16 14a4 4 0 1 1 8 0"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="28" cy="12" r="3" fill="#ffd166" />
            </svg>
          </span>
          <span className="header__logo-text">
            <span className="header__logo-main">Rođendaonica</span>
            <span className="header__logo-sub">Rezervacije igraonica</span>
          </span>
        </Link>

        <nav className="header__nav header__nav--center" aria-label="Glavna navigacija">
          {renderNavItems(navItems.left)}
        </nav>

        <div className="header__actions">
          <nav className="header__nav header__nav--right" aria-label="Korisničke akcije">
            {renderNavItems(navItems.right)}
          </nav>

          <button
            type="button"
            className={`header__hamburger ${menuOpen ? 'header__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`header__mobile-overlay ${menuOpen ? 'header__mobile-overlay--open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <div className={`header__mobile-drawer ${menuOpen ? 'header__mobile-drawer--open' : ''}`}>
        {variant === 'public' && (
          <div className="header__mobile-audience">
            <Link
              to="/za-roditelje"
              className="header__audience-card header__audience-card--parent"
              onClick={() => setMenuOpen(false)}
            >
              <span className="header__audience-card-mark" aria-hidden />
              <span className="header__audience-card-text">
                <strong>Za roditelje</strong>
                <small>Pronađite i rezervirajte termin</small>
              </span>
            </Link>
            <Link
              to="/za-igraonice"
              className="header__audience-card header__audience-card--business"
              onClick={() => setMenuOpen(false)}
            >
              <span className="header__audience-card-mark" aria-hidden />
              <span className="header__audience-card-text">
                <strong>Za igraonice</strong>
                <small>Upravljajte rezervacijama</small>
              </span>
            </Link>
          </div>
        )}

        <div className="header__mobile-section">
          <span className="header__mobile-label">Izbornik</span>
          {renderNavItems(navItems.left, true)}
        </div>

        {variant === 'public' ? (
          <div className="header__mobile-section">
            <span className="header__mobile-label">Račun</span>
            {renderNavItems(
              navItems.right.filter(i => i.kind !== 'audience-parent' && i.kind !== 'audience-business'),
              true,
            )}
          </div>
        ) : (
          <div className="header__mobile-section">
            <span className="header__mobile-label">Račun</span>
            {renderNavItems(navItems.right, true)}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
