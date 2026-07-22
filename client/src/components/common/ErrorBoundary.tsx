import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes'
import { logger } from '../../lib/logger'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('Neuhvaćena greška u React stablu', { error, info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-state app-state--error">
          <div className="app-state__panel">
            <span className="app-state__icon app-state__icon--error" aria-hidden>
              !
            </span>
            <h2 className="app-state__title">Nešto nije u redu</h2>
            <p className="app-state__desc">
              Došlo je do neočekivane greške. Osvježite stranicu ili se vratite na početnu.
            </p>
            <div className="app-state__actions">
              <button type="button" className="landing-btn landing-btn--primary" onClick={() => window.location.reload()}>
                Osvježi stranicu
              </button>
              <Link to={ROUTES.home} className="landing-btn landing-btn--outline">
                Početna
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
