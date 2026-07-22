import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuthPageTransition } from '../../hooks/useAuthPageTransition'

interface AuthShellProps {
  page: 'login' | 'register'
  children: ReactNode
}

const showcaseCopy = {
  login: {
    badge: 'Dobrodošli natrag',
    title: 'Rezervirajte rođendan u nekoliko klikova',
    text: 'Pronađite igraonicu, odaberite termin i platite akontaciju — sve na jednom mjestu.',
  },
  register: {
    badge: 'Pridružite se platformi',
    title: 'Za roditelje i igraonice, jedna platforma',
    text: 'Registrirajte se kao roditelj ili kao igraonica i počnite koristiti Rođendaonicu odmah.',
  },
}

function AuthShell({ page, children }: AuthShellProps) {
  const copy = showcaseCopy[page]
  const transition = useAuthPageTransition(page)

  const transitionClass =
    transition === 'forward'
      ? 'auth-page--enter-forward'
      : transition === 'back'
        ? 'auth-page--enter-back'
        : 'auth-page--enter-fade'

  return (
    <div className={`auth-page ${transitionClass}`} key={page}>
      <div className="auth-page__orb auth-page__orb--1" aria-hidden />
      <div className="auth-page__orb auth-page__orb--2" aria-hidden />
      <div className="auth-page__orb auth-page__orb--3" aria-hidden />

      <div className="auth-page__layout">
        <aside className="auth-showcase" aria-label="O platformi">
          <Link to="/" className="auth-showcase__brand">
            <span className="auth-showcase__logo-mark" aria-hidden>
              <svg viewBox="0 0 40 40" fill="none">
                <defs>
                  <linearGradient id="authLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#6c5ce7" />
                    <stop offset="0.5" stopColor="#ff6b9d" />
                    <stop offset="1" stopColor="#ffd166" />
                  </linearGradient>
                </defs>
                <rect width="40" height="40" rx="12" fill="url(#authLogoGrad)" />
                <path
                  d="M12 26c0-4.4 3.6-8 8-8s8 3.6 8 8M16 14a4 4 0 1 1 8 0"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="28" cy="12" r="3" fill="#ffd166" />
              </svg>
            </span>
            <span className="auth-showcase__brand-name">Rođendaonica</span>
          </Link>

          <span className="auth-showcase__badge">{copy.badge}</span>
          <h2 className="auth-showcase__title">{copy.title}</h2>
          <p className="auth-showcase__text">{copy.text}</p>

          <ul className="auth-showcase__features">
            <li>
              <Link to="/za-roditelje" className="auth-showcase__feature auth-showcase__feature--parent">
                <span className="auth-showcase__feature-mark" aria-hidden />
                <span>
                  <strong>Za roditelje</strong>
                  <small>Pregled, rezervacija i recenzije</small>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/za-igraonice" className="auth-showcase__feature auth-showcase__feature--business">
                <span className="auth-showcase__feature-mark" aria-hidden />
                <span>
                  <strong>Za igraonice</strong>
                  <small>Kalendar, paketi i uplate</small>
                </span>
              </Link>
            </li>
          </ul>
        </aside>

        <div className="auth-card">{children}</div>
      </div>
    </div>
  )
}

export default AuthShell
