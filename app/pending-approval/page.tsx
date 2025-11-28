"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClockIcon, MailIcon } from "@/components/icons"
import Link from "next/link"

export default function PendingApprovalPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
              <ClockIcon className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Awaiting Approval</h1>
            <p className="text-muted-foreground mb-6">
              Your request to join the organization has been submitted. An admin will review your request shortly.
            </p>
            <div className="p-4 rounded-xl bg-muted/50 mb-6">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MailIcon className="w-4 h-4" />
                <span>You'll receive an email once approved</span>
              </div>
            </div>
            <Link href="/login">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
