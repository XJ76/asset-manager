"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CategoryFormData } from "@/types/forms"

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => void
  onCancel: () => void
}

export function CategoryForm({ onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({ name: "", description: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Category Name
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Electronics, Furniture"
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
          placeholder="Brief description of this category"
          className="bg-muted/30 border-border/60 focus:bg-background transition-colors resize-none"
          rows={3}
        />
      </div>
      <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-border/60">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="px-6 gradient-primary hover:opacity-90">
          Create Category
        </Button>
      </div>
    </form>
  )
}
