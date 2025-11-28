"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { DepartmentFormData } from "@/types/forms"

interface DepartmentFormProps {
  onSubmit: (data: DepartmentFormData) => void
  onCancel: () => void
  initialData?: DepartmentFormData
}

export function DepartmentForm({ onSubmit, onCancel, initialData }: DepartmentFormProps) {
  const [formData, setFormData] = useState<DepartmentFormData>(
    initialData || { name: "", description: "" }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Department Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Engineering, Marketing"
          className="h-11 bg-muted/30 border-border/60 focus:bg-background transition-colors"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this department"
          className="bg-muted/30 border-border/60 focus:bg-background transition-colors resize-none"
          rows={3}
        />
      </div>
      <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-border/60">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="px-6 gradient-primary hover:opacity-90">
          {initialData ? "Update Department" : "Create Department"}
        </Button>
      </div>
    </form>
  )
}
