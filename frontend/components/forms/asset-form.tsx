"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AssetFormData } from "@/types/forms"
import type { Category, Department } from "@/types"

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => void
  onCancel: () => void
  categories: Category[]
  departments: Department[]
}

export function AssetForm({ onSubmit, onCancel, categories, departments }: AssetFormProps) {
  const [formData, setFormData] = useState<AssetFormData>({
    name: "",
    categoryId: "",
    departmentId: "",
    datePurchased: "",
    cost: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (key: keyof AssetFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormInput
        label="Asset Name"
        id="name"
        value={formData.name}
        onChange={(v) => updateField("name", v)}
        placeholder="Enter asset name"
      />
      <SelectField
        label="Category"
        value={formData.categoryId}
        options={categories}
        onChange={(v) => updateField("categoryId", v)}
      />
      <SelectField
        label="Department"
        value={formData.departmentId}
        options={departments}
        onChange={(v) => updateField("departmentId", v)}
      />
      <FormInput
        label="Date Purchased"
        id="datePurchased"
        type="date"
        value={formData.datePurchased}
        onChange={(v) => updateField("datePurchased", v)}
      />
      <FormInput
        label="Cost ($)"
        id="cost"
        type="number"
        value={String(formData.cost)}
        onChange={(v) => updateField("cost", Number.parseFloat(v) || 0)}
        placeholder="0.00"
      />
      <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-border/60">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="px-6 gradient-primary hover:opacity-90">
          Create Asset
        </Button>
      </div>
    </form>
  )
}

function FormInput({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 bg-muted/30 border-border/60 focus:bg-background transition-colors"
        required
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { id: string; name: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 bg-muted/30 border-border/60 focus:bg-background">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
