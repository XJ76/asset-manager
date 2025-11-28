"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuthStore } from "@/stores/auth-store"
import type { LoginCredentials } from "@/types/auth"

interface AuthContextType {
  user: ReturnType<typeof useAuthStore>['user']
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore()
  
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
