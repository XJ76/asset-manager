"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RoleSelector } from "./role-selector"
import { GoogleIcon } from "@/components/icons"
import type { UserRole } from "@/types"

interface LoginFormProps {
  onSubmit: (email: string, password: string, role: UserRole) => void
  onGoogleSignIn?: () => void
  isLoading?: boolean
}

export function LoginForm({ onSubmit, onGoogleSignIn, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("user")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(email, password, role)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Button
        type="button"
        variant="outline"
        onClick={onGoogleSignIn}
        disabled={isLoading}
        className="h-11 w-full gap-3 border-border/60 bg-background hover:bg-muted/50 transition-colors font-medium"
      >
        <GoogleIcon className="h-5 w-5" />
        Continue with Google
      </Button>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 h-px bg-border/60" />
        <span className="text-xs text-muted-foreground uppercase tracking-wider">or continue with email</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 px-4 bg-muted/50 border-border/60 focus:bg-background transition-colors"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="h-11 px-4 bg-muted/50 border-border/60 focus:bg-background transition-colors"
          required
        />
      </div>
      <RoleSelector value={role} onChange={setRole} />
      <Button
        type="submit"
        className="mt-3 h-11 text-sm font-medium gradient-primary hover:opacity-90 transition-opacity shadow-md"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
