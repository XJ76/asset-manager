"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OrgSelector } from "./org-selector"
import { GoogleIcon } from "@/components/icons"

interface JoinOrgFormProps {
  onSubmit: (data: { name: string; email: string; password: string; orgId: string }) => void
  onGoogleSignUp: () => void
  isLoading: boolean
}

export function JoinOrgForm({ onSubmit, onGoogleSignUp, isLoading }: JoinOrgFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedOrgId, setSelectedOrgId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrgId) return
    onSubmit({ name, email, password, orgId: selectedOrgId })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button type="button" variant="outline" className="w-full h-11 gap-2 bg-transparent" onClick={onGoogleSignUp}>
        <GoogleIcon className="w-5 h-5" />
        Sign up with Google
      </Button>
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with email</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="space-y-2">
        <Label>Select Organization</Label>
        <OrgSelector selectedId={selectedOrgId} onSelect={setSelectedOrgId} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full h-11" disabled={isLoading || !selectedOrgId}>
        {isLoading ? "Sending Request..." : "Request to Join"}
      </Button>
    </form>
  )
}
