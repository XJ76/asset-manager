"use client"

import { useState, useEffect, useMemo } from "react"
import { useOrganizations } from "@/hooks/use-organizations"
import { SearchIcon, BuildingIcon } from "@/components/icons"

interface OrgSelectorProps {
  selectedId: string
  onSelect: (orgId: string) => void
}

export function OrgSelector({ selectedId, onSelect }: OrgSelectorProps) {
  const { organizations, isLoading, fetchOrganizations } = useOrganizations()
  const [search, setSearch] = useState("")
  const [hasFetched, setHasFetched] = useState(false)

  useEffect(() => {
    if (!hasFetched) {
      fetchOrganizations()
      setHasFetched(true)
    }
  }, [hasFetched, fetchOrganizations])

  const filtered = useMemo(() => {
    if (!organizations || organizations.length === 0) return []
    if (!search.trim()) return organizations
    return organizations.filter((org) => org.name.toLowerCase().includes(search.toLowerCase()))
  }, [organizations, search])

  return (
    <div className="space-y-3">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2 min-h-[100px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading organizations...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            {search ? "No organizations match your search" : "No organizations available"}
          </p>
        ) : (
          filtered.map((org) => (
            <OrgItem 
              key={org.id} 
              name={org.name} 
              isSelected={selectedId === org.id} 
              onClick={() => {
                onSelect(org.id)
              }} 
            />
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
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
        isSelected 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <BuildingIcon className="w-4 h-4" />
      </div>
      <span className="font-medium text-sm text-left flex-1">{name}</span>
      {isSelected && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
      )}
    </button>
  )
}
