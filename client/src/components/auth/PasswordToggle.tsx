interface PasswordToggleProps {
  visible: boolean
  onToggle: () => void
}

function PasswordToggle({ visible, onToggle }: PasswordToggleProps) {
  return (
    <button
      type="button"
      className="auth-form__toggle-password"
      onClick={onToggle}
      aria-label={visible ? 'Sakrij lozinku' : 'Prikaži lozinku'}
    >
      {visible ? (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M3 10s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4 4l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden>
          <path
            d="M3 10s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )}
    </button>
  )
}

export default PasswordToggle
