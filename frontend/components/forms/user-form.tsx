"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserFormData } from "@/types/forms"

interface UserFormProps {
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
}

export function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField
        label="Full Name"
        id="name"
        value={formData.name}
        onChange={(v) => setFormData({ ...formData, name: v })}
        placeholder="John Doe"
      />
      <FormField
        label="Email"
        id="email"
        type="email"
        value={formData.email}
        onChange={(v) => setFormData({ ...formData, email: v })}
        placeholder="john@example.com"
      />
      <FormField
        label="Password"
        id="password"
        type="password"
        value={formData.password}
        onChange={(v) => setFormData({ ...formData, password: v })}
        placeholder="Create a password"
      />
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium">Role</Label>
        <Select value={formData.role} onValueChange={(v: "admin" | "user") => setFormData({ ...formData, role: v })}>
          <SelectTrigger className="h-11 bg-muted/30 border-border/60 focus:bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-border/60">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 bg-transparent">
          Cancel
        </Button>
        <Button type="submit" className="px-6 gradient-primary hover:opacity-90">
          Create User
        </Button>
      </div>
    </form>
  )
}

function FormField({
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
