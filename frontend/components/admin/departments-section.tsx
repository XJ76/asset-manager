"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { Modal } from "@/components/shared/modal"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DepartmentForm } from "@/components/forms/department-form"
import { BuildingIcon, TrashIcon } from "@/components/icons"
import { useDepartments } from "@/hooks/use-departments"
import type { Department } from "@/types"

export function DepartmentsSection() {
  const { departments, createDepartment, deleteDepartment } = useDepartments()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const columns = [
    {
      key: "name" as keyof Department,
      label: "Department",
      render: (item: Department) => <DepartmentCell name={item.name} />,
    },
    {
      key: "description" as keyof Department,
      label: "Description",
      render: (item: Department) => <span className="text-muted-foreground">{item.description || "—"}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (item: Department) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteId(item.id)}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const handleCreate = async (data: Parameters<typeof createDepartment>[0]) => {
    await createDepartment(data)
    setIsModalOpen(false)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteDepartment(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage organization departments and teams"
        actionLabel="Add Department"
        onAction={() => setIsModalOpen(true)}
      />
      <DataTable data={departments} columns={columns} emptyMessage="No departments found" />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Department"
        description="Add a new department"
      >
        <DepartmentForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
        variant="destructive"
      />
    </div>
  )
}

function DepartmentCell({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
        <BuildingIcon className="w-4 h-4 text-amber-600" />
      </div>
      <span className="font-medium">{name}</span>
    </div>
  )
}
