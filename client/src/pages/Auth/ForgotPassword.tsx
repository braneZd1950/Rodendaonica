import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import AuthShell from '../../components/auth/AuthShell'
import { getErrorMessage } from '../../lib/errors'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Unesite ispravnu email adresu')
      return
    }
    setError('')
    setLoading(true)
    try {
      if (api.auth.requestPasswordReset) {
        await api.auth.requestPasswordReset(email.trim())
      }
      setSent(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell page="login">
      <div className="auth-card__header">
        <h1 className="auth-card__title">Zaboravljena lozinka</h1>
        <p className="auth-card__subtitle">
          <Link to="/prijava" state={{ authDirection: 'back' }} className="auth-card__link">
            Natrag na prijavu
          </Link>
        </p>
      </div>

      {sent ? (
        <div className="auth-success-banner" role="status">
          Ako račun postoji, poslali smo upute za reset lozinke na {email}.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {error && (
            <div className="auth-error-banner" role="alert">
              {error}
            </div>
          )}
          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="email">
              Email adresa
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`auth-form__input ${error ? 'auth-form__input--error' : ''}`}
              placeholder="ana@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Slanje...' : 'Pošalji link za reset'}
          </button>
        </form>
      )}
    </AuthShell>
  )
}

export default ForgotPassword
