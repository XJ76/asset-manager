"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "@/components/icons"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="relative max-w-xs">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-10 bg-muted/30 border-border/60 focus:bg-background transition-colors"
      />
    </div>
  )
}
