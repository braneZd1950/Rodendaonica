import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export type AuthTransitionKind = 'fade' | 'forward' | 'back'

const AUTH_PREV_PATH_KEY = 'rodendaonica-auth-prev-path'

function resolveTransition(
  pathname: string,
  state: { authDirection?: 'forward' | 'back' } | null,
  previousPath: string | null,
): AuthTransitionKind {
  if (state?.authDirection === 'forward') return 'forward'
  if (state?.authDirection === 'back') return 'back'

  if (!previousPath) return 'fade'

  const fromLogin = previousPath.includes('prijava')
  const fromRegister = previousPath.includes('registracija')
  const toLogin = pathname.includes('prijava')
  const toRegister = pathname.includes('registracija')

  if (fromLogin && toRegister) return 'forward'
  if (fromRegister && toLogin) return 'back'

  return 'fade'
}

export function useAuthPageTransition(page: 'login' | 'register'): AuthTransitionKind {
  const location = useLocation()
  const [transition, setTransition] = useState<AuthTransitionKind>('fade')

  useEffect(() => {
    const previousPath = sessionStorage.getItem(AUTH_PREV_PATH_KEY)
    const state = location.state as { authDirection?: 'forward' | 'back' } | null

    setTransition(resolveTransition(location.pathname, state, previousPath))
    sessionStorage.setItem(AUTH_PREV_PATH_KEY, location.pathname)
  }, [location.pathname, location.state, page])

  return transition
}
