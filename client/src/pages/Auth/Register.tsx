import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AuthShell from '../../components/auth/AuthShell'
import AuthRoleSwitcher, { type AuthUserRole } from '../../components/auth/AuthRoleSwitcher'
import AuthToggle from '../../components/auth/AuthToggle'
import GoogleAuthButton from '../../components/auth/GoogleAuthButton'
import PasswordToggle from '../../components/auth/PasswordToggle'
import { isValidOib, normalizeOib } from '../../lib/validateOib'
import { authService } from '../../services/auth/authService'

type UserRole = AuthUserRole

interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  businessName?: string
  oib?: string
  city?: string
  phone?: string
  agreeToTerms: boolean
}

const initialForm: RegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'parent',
  businessName: '',
  oib: '',
  city: '',
  phone: '',
  agreeToTerms: false,
}

function validateForm(form: RegisterForm): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!form.firstName.trim()) errors.firstName = 'Ime je obavezno'
  if (!form.lastName.trim()) errors.lastName = 'Prezime je obavezno'

  if (!form.email.trim()) {
    errors.email = 'Email je obavezan'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email adresa nije ispravna'
  }

  if (!form.password) {
    errors.password = 'Lozinka je obavezna'
  } else if (form.password.length < 8) {
    errors.password = 'Lozinka mora imati najmanje 8 znakova'
  } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(form.password)) {
    errors.password = 'Lozinka mora sadržavati veliko slovo i broj'
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Lozinke se ne podudaraju'
  }

  if (form.role === 'business') {
    if (!form.businessName?.trim()) errors.businessName = 'Naziv igraonice je obavezan'
    const oib = normalizeOib(form.oib ?? '')
    if (!oib) {
      errors.oib = 'OIB je obavezan'
    } else if (oib.length !== 11) {
      errors.oib = 'OIB mora imati 11 znamenki'
    } else if (!isValidOib(oib)) {
      errors.oib = 'OIB nije ispravan'
    }
    if (!form.city?.trim()) errors.city = 'Grad je obavezan'
    if (!form.phone?.trim()) errors.phone = 'Broj telefona je obavezan'
  }

  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'Morate prihvatiti uvjete korištenja'
  }

  return errors
}

function RegisterLogoMark() {
  return (
    <span className="auth-card__logo-mark-sm" aria-hidden>
      <svg viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="registerCardLogo" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6c5ce7" />
            <stop offset="0.5" stopColor="#ff6b9d" />
            <stop offset="1" stopColor="#ffd166" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="12" fill="url(#registerCardLogo)" />
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

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterForm>(initialForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleRoleChange(role: UserRole) {
    setForm(prev => ({ ...prev, role }))
    setErrors({})
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
      const result = await authService.register({
        role: form.role,
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        businessName: form.businessName,
        oib: form.role === 'business' ? normalizeOib(form.oib ?? '') : undefined,
        phone: form.role === 'business' ? form.phone : undefined,
        city: form.role === 'business' ? form.city : undefined,
      })
      navigate(result.account.role === 'parent' ? '/profil' : '/dashboard')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Greška pri registraciji. Pokušajte ponovo.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoogleRegister() {
    console.log('Google registracija — TODO: povežite OAuth')
  }

  return (
    <AuthShell page="register">
      <div className="auth-card__header">
        <Link to="/" className="auth-card__logo-mobile">
          <RegisterLogoMark />
          <span>Rođendaonica</span>
        </Link>
        <h1 className="auth-card__title">Kreirajte račun</h1>
        <p className="auth-card__subtitle">
          Već imate račun?{' '}
          <Link to="/prijava" state={{ authDirection: 'back' }} className="auth-card__link">
            Prijavite se
          </Link>
        </p>
      </div>

      <AuthRoleSwitcher role={form.role} onChange={handleRoleChange} />

      <GoogleAuthButton onClick={handleGoogleRegister} disabled={isLoading} />

      <div className="auth-separator">
        <span>ili email</span>
      </div>

      {serverError && (
        <div className="auth-error-banner" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="auth-form__row">
          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="firstName">
              Ime
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={`auth-form__input ${errors.firstName ? 'auth-form__input--error' : ''}`}
              placeholder="Ana"
              value={form.firstName}
              onChange={handleChange}
              autoComplete="given-name"
            />
            {errors.firstName && <span className="auth-form__error">{errors.firstName}</span>}
          </div>

          <div className="auth-form__group">
            <label className="auth-form__label" htmlFor="lastName">
              Prezime
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={`auth-form__input ${errors.lastName ? 'auth-form__input--error' : ''}`}
              placeholder="Anić"
              value={form.lastName}
              onChange={handleChange}
              autoComplete="family-name"
            />
            {errors.lastName && <span className="auth-form__error">{errors.lastName}</span>}
          </div>
        </div>

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
          />
          {errors.email && <span className="auth-form__error">{errors.email}</span>}
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="password">
            Lozinka
          </label>
          <div className="auth-form__input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`auth-form__input ${errors.password ? 'auth-form__input--error' : ''}`}
              placeholder="Najmanje 8 znakova"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <PasswordToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          {errors.password && <span className="auth-form__error">{errors.password}</span>}
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="confirmPassword">
            Potvrdi lozinku
          </label>
          <div className="auth-form__input-wrapper">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`auth-form__input ${errors.confirmPassword ? 'auth-form__input--error' : ''}`}
              placeholder="Ponovi lozinku"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <PasswordToggle
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
          {errors.confirmPassword && <span className="auth-form__error">{errors.confirmPassword}</span>}
        </div>

        {form.role === 'business' && (
          <div className="auth-form__business-fields auth-form__business-fields--enter">
            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="businessName">
                Naziv igraonice
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                className={`auth-form__input ${errors.businessName ? 'auth-form__input--error' : ''}`}
                placeholder="Igraonica Sunce"
                value={form.businessName}
                onChange={handleChange}
              />
              {errors.businessName && <span className="auth-form__error">{errors.businessName}</span>}
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="oib">
                OIB
              </label>
              <input
                id="oib"
                name="oib"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={`auth-form__input ${errors.oib ? 'auth-form__input--error' : ''}`}
                placeholder="12345678901"
                value={form.oib}
                onChange={handleChange}
                maxLength={11}
              />
              <p className="auth-form__hint">Potreban za izdavanje R1 računa pri naplati pretplate.</p>
              {errors.oib && <span className="auth-form__error">{errors.oib}</span>}
            </div>

            <div className="auth-form__row">
              <div className="auth-form__group">
                <label className="auth-form__label" htmlFor="city">
                  Grad
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className={`auth-form__input ${errors.city ? 'auth-form__input--error' : ''}`}
                  placeholder="Zagreb"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && <span className="auth-form__error">{errors.city}</span>}
              </div>

              <div className="auth-form__group">
                <label className="auth-form__label" htmlFor="phone">
                  Telefon
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`auth-form__input ${errors.phone ? 'auth-form__input--error' : ''}`}
                  placeholder="+385 91 234 5678"
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
                {errors.phone && <span className="auth-form__error">{errors.phone}</span>}
              </div>
            </div>
          </div>
        )}

        <div className="auth-form__group auth-form__group--toggle">
          <div className="auth-toggle-wrap">
            <AuthToggle name="agreeToTerms" checked={form.agreeToTerms} onChange={handleChange}>
              Prihvaćam uvjete korištenja
            </AuthToggle>
            <p className="auth-toggle__legal">
              Pročitajte{' '}
              <Link to="/uvjeti" className="auth-card__link" target="_blank" rel="noopener noreferrer">
                Uvjete korištenja
              </Link>{' '}
              i{' '}
              <Link to="/privatnost" className="auth-card__link" target="_blank" rel="noopener noreferrer">
                Politiku privatnosti
              </Link>
            </p>
          </div>
          {errors.agreeToTerms && <span className="auth-form__error">{errors.agreeToTerms}</span>}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="auth-submit-btn__spinner" />
          ) : form.role === 'parent' ? (
            'Kreiraj račun'
          ) : (
            'Registriraj igraonicu'
          )}
        </button>
      </form>
    </AuthShell>
  )
}

export default Register
