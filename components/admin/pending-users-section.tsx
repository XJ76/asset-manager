"use client"

import { useState, useEffect } from "react"
import { usePendingUsers } from "@/hooks/use-pending-users"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, XCircleIcon, UserIcon, ClockIcon } from "@/components/icons"
import { EmptyState } from "@/components/shared/empty-state"

export function PendingUsersSection() {
  const { pendingUsers, isLoading, fetchPendingUsers, approveUser, rejectUser } = usePendingUsers()
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingUsers()
  }, [fetchPendingUsers])

  const handleApprove = async (userId: string) => {
    setProcessingId(userId)
    await approveUser(userId)
    setProcessingId(null)
  }

  const handleReject = async (userId: string) => {
    setProcessingId(userId)
    await rejectUser(userId)
    setProcessingId(null)
  }

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-muted rounded-xl" />
  }

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-amber-500" />
          Pending Approvals
          {pendingUsers.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-600 rounded-full">
              {pendingUsers.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingUsers.length === 0 ? (
          <EmptyState
            icon={<CheckCircleIcon className="w-8 h-8" />}
            title="No pending requests"
            description="All user requests have been reviewed"
          />
        ) : (
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <PendingUserCard
                key={user.id}
                user={user}
                isProcessing={processingId === user.id}
                onApprove={() => handleApprove(user.id)}
                onReject={() => handleReject(user.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface PendingUserCardProps {
  user: { id: string; name: string; email: string; createdAt: Date }
  isProcessing: boolean
  onApprove: () => void
  onReject: () => void
}

function PendingUserCard({ user, isProcessing, onApprove, onReject }: PendingUserCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={onReject}
          disabled={isProcessing}
        >
          <XCircleIcon className="w-5 h-5" />
        </Button>
        <Button size="sm" className="h-8 gap-1" onClick={onApprove} disabled={isProcessing}>
          <CheckCircleIcon className="w-4 h-4" />
          Approve
        </Button>
      </div>
    </div>
  )
}
