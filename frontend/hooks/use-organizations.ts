"use client"

import { useState, useEffect } from "react"
import { organizationsApi } from "@/lib/api/organizations"
import type { CreateOrgSignup } from "@/types/auth"
import type { Organization } from "@/types"

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrganizations = async () => {
    setIsLoading(true)
    try {
      const orgs = await organizationsApi.getAll()
      setOrganizations(orgs)
    } catch (error) {
      console.error("Failed to fetch organizations:", error)
      setOrganizations([])
    } finally {
      setIsLoading(false)
    }
  }

  const createOrganization = async (data: CreateOrgSignup) => {
    const response = await organizationsApi.create(data)
    return response.organization
  }

  return { organizations, isLoading, fetchOrganizations, createOrganization }
}
