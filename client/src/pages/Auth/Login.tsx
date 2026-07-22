import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import AuthToggle from '../../components/auth/AuthToggle'
import GoogleAuthButton from '../../components/auth/GoogleAuthButton'
import PasswordToggle from '../../components/auth/PasswordToggle'
import { authService } from '../../services/auth/authService'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

function validateForm(form: LoginForm): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!form.email.trim()) {
    errors.email = 'Email je obavezan'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email adresa nije ispravna'
  }

  if (!form.password) {
    errors.password = 'Lozinka je obavezna'
  }

  return errors
}

function LoginLogoMark() {
  return (
    <span className="auth-card__logo-mark-sm" aria-hidden>
      <svg viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="loginCardLogo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6c5ce7" />
            <stop offset="0.5" stopColor="#ff6b9d" />
            <stop offset="1" stopColor="#ffd166" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#loginCardLogo)" />
        <path
          d="M12 26c0-4.4 3.6-8 8-8s8 3.6 8 8M16 14a4 4 0 1 1 8 0"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const demo = authService.getDemoCredentials()

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)

    try {
      const result = await authService.login({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      })
      navigate(result.account.role === 'parent' ? '/profil' : '/dashboard')
    } catch (error) {
      setServerError('Pogrešan email ili lozinka. Pokušajte ponovo.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoogleLogin() {
    console.log('Google login — TODO: povežite OAuth')
  }

  return (
    <AuthShell page="login">
      <div className="auth-card__header">
        <Link to="/" className="auth-card__logo-mobile">
          <LoginLogoMark />
          <span>Rođendaonica</span>
        </Link>
        <h1 className="auth-card__title">Dobrodošli natrag</h1>
        <p className="auth-card__subtitle">
          Nemate račun?{' '}
          <Link to="/registracija" state={{ authDirection: 'forward' }} className="auth-card__link">
            Registrirajte se
          </Link>
        </p>
      </div>

      <GoogleAuthButton onClick={handleGoogleLogin} disabled={isLoading} />

      <div className="auth-separator">
        <span>ili email</span>
      </div>

      {serverError && (
        <div className="auth-error-banner" role="alert">
          {serverError}
        </div>
      )}

      {demo && (
        <div className="auth-demo">
          <p className="auth-demo__label">Demo prijava (development):</p>
          <div className="auth-demo__actions">
            <button
              type="button"
              className="auth-demo__btn"
              onClick={() => setForm(prev => ({ ...prev, email: demo.parent.email, password: demo.parent.password }))}
            >
              Učitaj roditelja
            </button>
            <button
              type="button"
              className="auth-demo__btn"
              onClick={() => setForm(prev => ({ ...prev, email: demo.business.email, password: demo.business.password }))}
            >
              Učitaj igraonicu
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="email">
            Email adresa
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`auth-form__input ${errors.email ? 'auth-form__input--error' : ''}`}
            placeholder="ana@email.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            autoFocus
          />
          {errors.email && <span className="auth-form__error">{errors.email}</span>}
        </div>

        <div className="auth-form__group">
          <div className="auth-form__label-row">
            <label className="auth-form__label" htmlFor="password">
              Lozinka
            </label>
            <Link to="/zaboravljena-lozinka" className="auth-card__link auth-card__link--small">
              Zaboravili ste lozinku?
            </Link>
          </div>
          <div className="auth-form__input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
              placeholder="Unesite lozinku"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <PasswordToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          {errors.password && <span className="auth-form__error">{errors.password}</span>}
        </div>

        <div className="auth-form__group auth-form__group--toggle">
          <AuthToggle name="rememberMe" checked={form.rememberMe} onChange={handleChange}>
            Zapamti me na ovom uređaju
          </AuthToggle>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? <span className="auth-submit-btn__spinner" /> : 'Prijavi se'}
        </button>
      </form>
    </AuthShell>
  )
}

export default Login
