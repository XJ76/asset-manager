"use client"

import { useRouter } from "next/navigation"
import { LoginCard } from "@/components/auth/login-card"
import { useAuthContext } from "@/contexts/auth-context"
import type { UserRole } from "@/types"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuthContext()

  const handleLogin = async (email: string, password: string, role: UserRole) => {
    const user = await login({ email, password, role })
    if (user) {
      if (user.status === "pending") {
        router.push("/pending-approval")
      } else {
        router.push(user.role === "admin" ? "/admin" : "/dashboard")
      }
    }
  }

  const handleGoogleSignIn = async () => {
    // TODO: Integrate with your Google OAuth provider
    console.log("Google sign-in clicked - integrate your OAuth here")
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginCard onSubmit={handleLogin} onGoogleSignIn={handleGoogleSignIn} isLoading={isLoading} />
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
