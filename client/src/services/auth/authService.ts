import { api } from '../../api'
import { env } from '../../config/env'
import type { AuthSession, DemoCredentials, LoginInput, RegisterInput } from '../../types'

/**
 * Fasada za autentikaciju — UI ne poziva mock/http direktno.
 */
export const authService = {
  login: (input: LoginInput) => api.auth.login(input),
  register: (input: RegisterInput) => api.auth.register(input),
  logout: () => api.auth.logout(),
  getSession: (): AuthSession | null => api.auth.getSession(),
  getDemoCredentials: (): DemoCredentials | null =>
    env.isMock && api.auth.getDemoCredentials ? api.auth.getDemoCredentials() : null,
}
