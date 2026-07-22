import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface PageLoaderProps {
  message?: string
}

export function PageLoader({ message = 'Učitavanje...' }: PageLoaderProps) {
  return (
    <div className="app-state app-state--loading" role="status" aria-live="polite">
      <span className="app-state__spinner" aria-hidden />
      <p className="app-state__desc">{message}</p>
    </div>
  )
}

interface PageErrorProps {
  message: string
  onRetry?: () => void
}

export function PageError({ message, onRetry }: PageErrorProps) {
  return (
    <div className="app-state app-state--error" role="alert">
      <div className="app-state__panel">
        <span className="app-state__icon app-state__icon--error" aria-hidden>
          !
        </span>
        <h2 className="app-state__title">Greška</h2>
        <p className="app-state__desc">{message}</p>
        {onRetry && (
          <div className="app-state__actions">
            <button type="button" className="landing-btn landing-btn--primary" onClick={onRetry}>
              Pokušaj ponovo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
  action?: { label: string; to: string }
  children?: ReactNode
}

export function EmptyState({ title, description, icon = '📭', action, children }: EmptyStateProps) {
  const hasActions = Boolean(children || action)

  return (
    <div className="app-state app-state--empty" role="status">
      <div className="app-state__panel">
        <span className="app-state__icon" aria-hidden>
          {icon}
        </span>
        <h2 className="app-state__title">{title}</h2>
        {description && <p className="app-state__desc">{description}</p>}
        {hasActions && (
          <div className="app-state__actions">
            {children}
            {action && (
              <Link to={action.to} className="landing-btn landing-btn--primary">
                {action.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
