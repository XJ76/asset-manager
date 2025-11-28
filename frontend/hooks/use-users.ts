"use client"

import { useEffect } from "react"
import { useUsersStore } from "@/stores/users-store"

export function useUsers() {
  const { users, isLoading, error, fetchUsers, approveUser, rejectUser } = useUsersStore()

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return { users, isLoading, error, fetchUsers, approveUser, rejectUser }
}
