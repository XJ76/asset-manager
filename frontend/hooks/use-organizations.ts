"use client"

import { useState, useCallback, useRef } from "react"
import { organizationsApi } from "@/lib/api/organizations"
import type { CreateOrgSignup } from "@/types/auth"
import type { Organization } from "@/types"

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fetchingRef = useRef(false)

  const fetchOrganizations = useCallback(async () => {
    if (fetchingRef.current) return // Prevent multiple simultaneous fetches
    fetchingRef.current = true
    setIsLoading(true)
    try {
      const orgs = await organizationsApi.getAll()
      setOrganizations(orgs)
    } catch (error) {
      console.error("Failed to fetch organizations:", error)
      setOrganizations([])
    } finally {
      setIsLoading(false)
      fetchingRef.current = false
    }
  }, [])

  const createOrganization = async (data: CreateOrgSignup) => {
    const response = await organizationsApi.create(data)
    return response.organization
  }

  return { organizations, isLoading, fetchOrganizations, createOrganization }
}
