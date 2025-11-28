"use client"

import type React from "react"

import { BuildingPlusIcon, UserPlusIcon } from "@/components/icons"

type SignupMode = "create-org" | "join-org"

interface SignupModeSelectorProps {
  selected: SignupMode | null
  onSelect: (mode: SignupMode) => void
}

export function SignupModeSelector({ selected, onSelect }: SignupModeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ModeCard
        mode="create-org"
        title="Create Organization"
        description="Start a new organization as admin"
        icon={<BuildingPlusIcon className="w-6 h-6" />}
        isSelected={selected === "create-org"}
        onClick={() => onSelect("create-org")}
      />
      <ModeCard
        mode="join-org"
        title="Join Organization"
        description="Request to join an existing org"
        icon={<UserPlusIcon className="w-6 h-6" />}
        isSelected={selected === "join-org"}
        onClick={() => onSelect("join-org")}
      />
    </div>
  )
}

interface ModeCardProps {
  mode: SignupMode
  title: string
  description: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

function ModeCard({ title, description, icon, isSelected, onClick }: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
        isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div className={`mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </button>
  )
}
