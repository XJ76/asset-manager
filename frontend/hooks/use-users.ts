"use client"

import { useState, useCallback } from "react"
import type { User } from "@/types"
import type { UserFormData } from "@/types/forms"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    // TODO: Replace with actual API call
    setIsLoading(false)
  }, [])

  const createUser = useCallback(async (data: UserFormData) => {
    // TODO: Replace with actual API call
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: new Date(),
    }
    setUsers((prev) => [...prev, newUser])
    return newUser
  }, [])

  return { users, isLoading, fetchUsers, createUser, setUsers }
}
