"use client"

import { useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { Modal } from "@/components/shared/modal"
import { CategoryForm } from "@/components/forms/category-form"
import { FolderIcon } from "@/components/icons"
import { useCategories } from "@/hooks/use-categories"
import type { Category } from "@/types"

export function CategoriesSection() {
  const { categories, createCategory } = useCategories()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const columns = [
    {
      key: "name" as keyof Category,
      label: "Category",
      render: (item: Category) => <CategoryCell name={item.name} />,
    },
    {
      key: "description" as keyof Category,
      label: "Description",
      render: (item: Category) => <span className="text-muted-foreground">{item.description || "—"}</span>,
    },
  ]

  const handleCreate = async (data: Parameters<typeof createCategory>[0]) => {
    await createCategory(data)
    setIsModalOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize assets by type and classification"
        actionLabel="Add Category"
        onAction={() => setIsModalOpen(true)}
      />
      <DataTable data={categories} columns={columns} emptyMessage="No categories found" />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Category"
        description="Add a new asset category"
      >
        <CategoryForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  )
}

function CategoryCell({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
        <FolderIcon className="w-4 h-4 text-emerald-600" />
      </div>
      <span className="font-medium">{name}</span>
    </div>
  )
}
