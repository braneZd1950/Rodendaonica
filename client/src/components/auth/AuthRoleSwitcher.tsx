export type AuthUserRole = 'parent' | 'business'

interface AuthRoleSwitcherProps {
  role: AuthUserRole
  onChange: (role: AuthUserRole) => void
}

function AuthRoleSwitcher({ role, onChange }: AuthRoleSwitcherProps) {
  return (
    <div
      className={`auth-role-switcher auth-role-switcher--${role}`}
      role="group"
      aria-label="Tip korisnika"
    >
      <span className="auth-role-switcher__slider" aria-hidden />

      <button
        type="button"
        className={`auth-role-switcher__btn ${role === 'parent' ? 'auth-role-switcher__btn--active' : ''}`}
        onClick={() => onChange('parent')}
        aria-pressed={role === 'parent'}
      >
        Roditelj
      </button>

      <button
        type="button"
        className={`auth-role-switcher__btn ${role === 'business' ? 'auth-role-switcher__btn--active' : ''}`}
        onClick={() => onChange('business')}
        aria-pressed={role === 'business'}
      >
        Igraonica
      </button>
    </div>
  )
}

export default AuthRoleSwitcher
