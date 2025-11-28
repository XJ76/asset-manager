"use client"

import { useState, useEffect } from "react"
import { useOrganizations } from "@/hooks/use-organizations"
import { SearchIcon, BuildingIcon } from "@/components/icons"

interface OrgSelectorProps {
  selectedId: string
  onSelect: (orgId: string) => void
}

export function OrgSelector({ selectedId, onSelect }: OrgSelectorProps) {
  const { organizations, isLoading, fetchOrganizations } = useOrganizations()
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const filtered = (organizations || []).filter((org) => org.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground py-4">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">No organizations found</p>
        ) : (
          filtered.map((org) => (
            <OrgItem key={org.id} name={org.name} isSelected={selectedId === org.id} onClick={() => onSelect(org.id)} />
          ))
        )}
      </div>
    </div>
  )
}

function OrgItem({ name, isSelected, onClick }: { name: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
      >
        <BuildingIcon className="w-4 h-4" />
      </div>
      <span className="font-medium text-sm">{name}</span>
    </button>
  )
}
