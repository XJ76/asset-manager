import type { User, UserRole } from "./index"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  name: string
}

export interface CreateOrgSignup extends SignupCredentials {
  organizationName: string
}

export interface JoinOrgSignup extends SignupCredentials {
  organizationId: string
}
