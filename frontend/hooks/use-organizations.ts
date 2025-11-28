"use client"

import { organizationsApi } from "@/lib/api/organizations"
import type { CreateOrgSignup } from "@/types/auth"

export function useOrganizations() {
  const createOrganization = async (data: CreateOrgSignup) => {
    const response = await organizationsApi.create(data)
    return response.organization
  }

  return { createOrganization }
}
