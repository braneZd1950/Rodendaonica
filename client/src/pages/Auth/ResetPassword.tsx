import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../api'
import AuthShell from '../../components/auth/AuthShell'
import { ROUTES } from '../../constants/routes'
import { getErrorMessage } from '../../lib/errors'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!token) {
      setError('Link za reset nije valjan. Zatražite novi.')
      return
    }
    if (password.length < 8) {
      setError('Lozinka mora imati najmanje 8 znakova.')
      return
    }
    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.')
      return
    }

    setError('')
    setLoading(true)
    try {
      if (!api.auth.resetPassword) {
        throw new Error('Reset lozinke nije dostupan u ovom načinu rada.')
      }
      await api.auth.resetPassword(token, password)
      setDone(true)
      setTimeout(() => navigate(ROUTES.login), 2000)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthShell page="login">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Reset lozinke</h1>
        </div>
        <div className="auth-error-banner" role="alert">
          Link za reset nije valjan ili je istekao.
        </div>
        <p className="auth-card__subtitle">
          <Link to={ROUTES.forgotPassword} className="auth-card__link">
            Zatražite novi link
          </Link>
        </p>
      </AuthShell>
    )
  }

  return (
    <AuthShell page="login">
      <div className="auth-card__header">
        <h1 className="auth-card__title">Nova lozinka</h1>
        <p className="auth-card__subtitle">
          <Link to={ROUTES.login} state={{ authDirection: 'back' }} className="auth-card__link">
            Natrag na prijavu
          </Link>
        </p>
      </div>

      {done ? (
        <div className="auth-success-banner" role="status">
          Lozinka je promijenjena. Preusmjeravamo vas na prijavu...
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {error && (
            <div className="auth-error-banner" role="alert">
              {error}
            </div>
          )}
          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="password">
              Nova lozinka
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`auth-form__input ${error ? 'auth-form__input--error' : ''}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              autoFocus
              minLength={8}
            />
          </div>
          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="confirmPassword">
              Ponovi lozinku
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`auth-form__input ${error ? 'auth-form__input--error' : ''}`}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Spremanje...' : 'Spremi novu lozinku'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}

export default ResetPassword
