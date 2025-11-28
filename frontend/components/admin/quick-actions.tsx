"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, FolderIcon, BuildingIcon, ChevronRightIcon } from "@/components/icons"

export function QuickActions() {
  const actions = [
    { label: "Add New User", href: "/admin/users", icon: UsersIcon, color: "bg-primary/10 text-primary" },
    {
      label: "Create Category",
      href: "/admin/categories",
      icon: FolderIcon,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Add Department",
      href: "/admin/departments",
      icon: BuildingIcon,
      color: "bg-amber-500/10 text-amber-600",
    },
  ]

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2">
          {actions.map((action) => (
            <ActionLink key={action.href} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface ActionLinkProps {
  action: {
    label: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    color: string
  }
}

function ActionLink({ action }: ActionLinkProps) {
  const Icon = action.icon
  return (
    <Link
      href={action.href}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">{action.label}</span>
      <ChevronRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </Link>
  )
}
