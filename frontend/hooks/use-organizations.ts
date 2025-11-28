"use client"

import { useState, useCallback } from "react"
import type { Organization } from "@/types"

// Mock data for UI development
const mockOrganizations: Organization[] = [
  { id: "1", name: "Acme Corporation", slug: "acme-corp", createdBy: "1", createdAt: new Date() },
  { id: "2", name: "TechStart Inc", slug: "techstart", createdBy: "2", createdAt: new Date() },
  { id: "3", name: "Global Enterprises", slug: "global-ent", createdBy: "3", createdAt: new Date() },
]

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations)
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true)
    // TODO: Replace with actual API call
    await new Promise((r) => setTimeout(r, 500))
    setOrganizations(mockOrganizations)
    setIsLoading(false)
  }, [])

  const createOrganization = useCallback(async (name: string) => {
    // TODO: Replace with actual API call
    const newOrg: Organization = {
      id: crypto.randomUUID(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      createdBy: "current-user",
      createdAt: new Date(),
    }
    setOrganizations((prev) => [...prev, newOrg])
    return newOrg
  }, [])

  return { organizations, isLoading, fetchOrganizations, createOrganization }
}
