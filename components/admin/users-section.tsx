"use client"

import { useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { Modal } from "@/components/shared/modal"
import { UserForm } from "@/components/forms/user-form"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUsers } from "@/hooks/use-users"
import type { User } from "@/types"

export function UsersSection() {
  const { users, createUser } = useUsers()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns = [
    {
      key: "name" as keyof User,
      label: "User",
      render: (item: User) => <UserCell user={item} />,
    },
    { key: "email" as keyof User, label: "Email" },
    {
      key: "role" as keyof User,
      label: "Role",
      render: (item: User) => <RoleBadge role={item.role} />,
    },
  ]

  const handleCreate = async (data: Parameters<typeof createUser>[0]) => {
    await createUser(data)
    setIsModalOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage system users and their permissions"
        actionLabel="Add User"
        onAction={() => setIsModalOpen(true)}
      />
      <DataTable data={users} columns={columns} emptyMessage="No users found" />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create User"
        description="Add a new user to the system"
      >
        <UserForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

function UserCell({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8 border border-border/60">
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{initials}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{user.name}</span>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin"
  return (
    <Badge
      variant={isAdmin ? "default" : "secondary"}
      className={isAdmin ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </Badge>
  )
}
