"use client"

import { useState, useCallback } from "react"
import type { User } from "@/types"
import type { AuthState, LoginCredentials } from "@/types/auth"

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(initialState)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuth((prev) => ({ ...prev, isLoading: true }))
    // TODO: Replace with actual API call
    const mockUser: User = {
      id: crypto.randomUUID(),
      email: credentials.email,
      name: credentials.email.split("@")[0],
      role: credentials.role,
      status: "approved",
      organizationId: "1",
      createdAt: new Date(),
    }
    setAuth({ user: mockUser, isAuthenticated: true, isLoading: false })
    return mockUser
  }, [])

  const logout = useCallback(() => {
    setAuth(initialState)
  }, [])

  return { ...auth, login, logout }
}
