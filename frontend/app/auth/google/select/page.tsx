"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/stores/auth-store"
import { organizationsApi } from "@/lib/api/organizations"
import { apiClient } from "@/lib/api/client"
import type { Organization } from "@/types"
import { LogoIcon } from "@/components/icons"
import { PageLoader } from "@/components/shared/loading-spinner"

function SelectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, setUser } = useAuthStore()
  
  const [step, setStep] = useState<"role" | "org">("role")
  const [role, setRole] = useState<"admin" | "user" | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState("")
  const [orgName, setOrgName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const tempToken = searchParams.get("token")
  const errorParam = searchParams.get("error")

  useEffect(() => {
    if (errorParam) {
      setError(errorParam)
    }
    if (tempToken && role === "user") {
      loadOrganizations()
    }
  }, [tempToken, role])

  const loadOrganizations = async () => {
    try {
      const orgs = await organizationsApi.getAll()
      setOrganizations(orgs)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleRoleSelect = (selectedRole: "admin" | "user") => {
    setRole(selectedRole)
    if (selectedRole === "admin") {
      setStep("org")
    } else {
      setStep("org")
      loadOrganizations()
    }
  }

  const handleComplete = async () => {
    if (!tempToken) {
      setError("Invalid session")
      return
    }

    if (role === "admin" && !orgName.trim()) {
      setError("Please enter organization name")
      return
    }

    if (role === "user" && !selectedOrgId) {
      setError("Please select an organization")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.post("/auth/google/complete", {
        tempToken,
        role,
        organizationId: role === "user" ? selectedOrgId : undefined,
        organizationName: role === "admin" ? orgName.trim() : undefined,
      })

      const { token, user } = response.data
      setToken(token)
      setUser(user)

      if (user.status === "pending") {
        router.push("/pending-approval")
      } else {
        router.push(user.role === "admin" ? "/admin" : "/dashboard")
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to complete authentication")
    } finally {
      setIsLoading(false)
    }
  }

  if (errorParam && errorParam === "user_not_found") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account Not Found</CardTitle>
            <CardDescription>
              No account found with this Google email. Please sign up first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/signup")} className="w-full">
              Go to Sign Up
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3">
            <LogoIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle>Complete Your Sign In</CardTitle>
          <CardDescription>
            {step === "role" 
              ? "Select your role to continue"
              : role === "admin"
              ? "Create or select your organization"
              : "Select the organization you want to join"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          {step === "role" && (
            <div className="space-y-3">
              <Button
                onClick={() => handleRoleSelect("admin")}
                className="w-full h-12"
                variant="outline"
              >
                I'm an Admin (Create Organization)
              </Button>
              <Button
                onClick={() => handleRoleSelect("user")}
                className="w-full h-12"
                variant="outline"
              >
                I'm a User (Join Organization)
              </Button>
            </div>
          )}

          {step === "org" && role === "admin" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  placeholder="Acme Corporation"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setStep("role")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!orgName || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Creating..." : "Create & Continue"}
                </Button>
              </div>
            </div>
          )}

          {step === "org" && role === "user" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Organization</Label>
                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setStep("role")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!selectedOrgId || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Joining..." : "Join & Continue"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

export default function GoogleAuthSelectPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </main>
    }>
      <SelectContent />
    </Suspense>
  )
}

