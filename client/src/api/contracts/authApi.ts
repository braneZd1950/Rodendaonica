import type { AuthResult, AuthSession, DemoCredentials, LoginInput, RegisterInput } from '../../types'

export interface AuthApi {
  login(input: LoginInput): Promise<AuthResult>
  register(input: RegisterInput): Promise<AuthResult>
  requestPasswordReset?(email: string): Promise<void>
  resetPassword?(token: string, password: string): Promise<void>
  logout(): void
  getSession(): AuthSession | null
  getDemoCredentials?(): DemoCredentials
}
