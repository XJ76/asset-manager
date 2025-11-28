"use client"

import { useState, useCallback } from "react"
import type { User } from "@/types"

// Mock pending users for UI development
const mockPendingUsers: User[] = [
  {
    id: "p1",
    email: "john@example.com",
    name: "John Doe",
    role: "user",
    status: "pending",
    organizationId: "1",
    createdAt: new Date(),
  },
  {
    id: "p2",
    email: "jane@example.com",
    name: "Jane Smith",
    role: "user",
    status: "pending",
    organizationId: "1",
    createdAt: new Date(),
  },
]

export function usePendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<User[]>(mockPendingUsers)
  const [isLoading, setIsLoading] = useState(false)

  const fetchPendingUsers = useCallback(async () => {
    setIsLoading(true)
    // TODO: Replace with actual API call
    await new Promise((r) => setTimeout(r, 500))
    setPendingUsers(mockPendingUsers)
    setIsLoading(false)
  }, [])

  const approveUser = useCallback(async (userId: string) => {
    // TODO: Replace with actual API call
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
  }, [])

  const rejectUser = useCallback(async (userId: string) => {
    // TODO: Replace with actual API call
    setPendingUsers((prev) => prev.filter((u) => u.id !== userId))
  }, [])

  return { pendingUsers, isLoading, fetchPendingUsers, approveUser, rejectUser }
}
