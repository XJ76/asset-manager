"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "@/components/icons"

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function PageHeader({ title, description, actionLabel, onAction }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gradient-primary hover:opacity-90 shadow-md">
          <PlusIcon className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
