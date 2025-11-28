"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { PageLoader } from "@/components/shared/loading-spinner"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setToken, setUser } = useAuthStore()

  useEffect(() => {
    const token = searchParams.get("token")
    const userParam = searchParams.get("user")

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam))
        setToken(token)
        setUser(user)

        if (user.status === "pending") {
          router.push("/pending-approval")
        } else {
          router.push(user.role === "admin" ? "/admin" : "/dashboard")
        }
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push("/login?error=invalid_response")
      }
    } else {
      router.push("/login?error=missing_data")
    }
  }, [searchParams, router, setToken, setUser])

  return <PageLoader />
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CallbackContent />
    </Suspense>
  )
}

