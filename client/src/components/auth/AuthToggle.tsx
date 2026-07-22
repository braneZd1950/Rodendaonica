import type { ChangeEvent, ReactNode } from 'react'

interface AuthToggleProps {
  name: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  children: ReactNode
  id?: string
}

function AuthToggle({ name, checked, onChange, children, id }: AuthToggleProps) {
  const inputId = id ?? name

  return (
    <label className="auth-toggle" htmlFor={inputId}>
      <input
        id={inputId}
        name={name}
        type="checkbox"
        className="auth-toggle__input"
        checked={checked}
        onChange={onChange}
      />
      <span className="auth-toggle__track" aria-hidden>
        <span className="auth-toggle__thumb" />
      </span>
      <span className="auth-toggle__text">{children}</span>
    </label>
  )
}

export default AuthToggle
