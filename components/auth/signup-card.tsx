"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SignupModeSelector } from "./signup-mode-selector"
import { CreateOrgForm } from "./create-org-form"
import { JoinOrgForm } from "./join-org-form"
import { LogoIcon, ArrowLeftIcon } from "@/components/icons"
import Link from "next/link"

type SignupMode = "create-org" | "join-org"

interface SignupCardProps {
  onCreateOrg: (data: { name: string; email: string; password: string; orgName: string }) => void
  onJoinOrg: (data: { name: string; email: string; password: string; orgId: string }) => void
  onGoogleSignUp: () => void
  isLoading: boolean
}

export function SignupCard({ onCreateOrg, onJoinOrg, onGoogleSignUp, isLoading }: SignupCardProps) {
  const [mode, setMode] = useState<SignupMode | null>(null)

  return (
    <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3">
          <LogoIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-sm text-muted-foreground">Get started with Asset Manager</p>
      </CardHeader>
      <CardContent className="pt-4">
        {mode === null ? (
          <div className="space-y-6">
            <SignupModeSelector selected={mode} onSelect={setMode} />
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setMode(null)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </button>
            {mode === "create-org" ? (
              <CreateOrgForm onSubmit={onCreateOrg} onGoogleSignUp={onGoogleSignUp} isLoading={isLoading} />
            ) : (
              <JoinOrgForm onSubmit={onJoinOrg} onGoogleSignUp={onGoogleSignUp} isLoading={isLoading} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
