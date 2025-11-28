"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "./login-form"
import { LogoIcon } from "@/components/icons"
import type { UserRole } from "@/types"

interface LoginCardProps {
  onSubmit: (email: string, password: string, role: UserRole) => void
  onGoogleSignIn?: () => void
  isLoading?: boolean
}

export function LoginCard({ onSubmit, onGoogleSignIn, isLoading }: LoginCardProps) {
  return (
    <Card className="w-full shadow-premium border-border/50 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-2 pt-8">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
          <LogoIcon className="w-7 h-7 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to your Asset Manager account</CardDescription>
      </CardHeader>
      <CardContent className="pb-8 pt-4">
        <LoginForm onSubmit={onSubmit} onGoogleSignIn={onGoogleSignIn} isLoading={isLoading} />
      </CardContent>
    </Card>
  )
}
