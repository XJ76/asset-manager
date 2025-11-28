"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ShieldIcon, UserIcon } from "@/components/icons"
import type { UserRole } from "@/types"

interface RoleSelectorProps {
  value: UserRole
  onChange: (role: UserRole) => void
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">Sign in as</Label>
      <div className="grid grid-cols-2 gap-3">
        <RoleButton
          label="User"
          icon={<UserIcon className="w-4 h-4" />}
          isActive={value === "user"}
          onClick={() => onChange("user")}
        />
        <RoleButton
          label="Admin"
          icon={<ShieldIcon className="w-4 h-4" />}
          isActive={value === "admin"}
          onClick={() => onChange("admin")}
        />
      </div>
    </div>
  )
}

interface RoleButtonProps {
  label: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
}

function RoleButton({ label, icon, isActive, onClick }: RoleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 py-3 px-4 rounded-lg border text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
          : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50 hover:border-border",
      )}
    >
      {icon}
      {label}
    </button>
  )
}
