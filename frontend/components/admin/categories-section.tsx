"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { Modal } from "@/components/shared/modal"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { CategoryForm } from "@/components/forms/category-form"
import { FolderIcon, TrashIcon, PencilIcon } from "@/components/icons"
import { useCategories } from "@/hooks/use-categories"
import type { Category } from "@/types"
import type { CategoryFormData } from "@/types/forms"

export function CategoriesSection() {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
    {
      key: "actions",
      label: "",
      render: (item: Category) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingCategory(item)}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(item.id)}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const handleCreate = async (data: CategoryFormData) => {
    await createCategory(data)
    setIsModalOpen(false)
  }

  const handleUpdate = async (data: CategoryFormData) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data)
      setEditingCategory(null)
    }
  }

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCategory(deleteId)
      setDeleteId(null)
    }
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
      <Modal
        open={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Edit Category"
        description="Update category information"
      >
        <CategoryForm
          onSubmit={handleUpdate}
          onCancel={() => setEditingCategory(null)}
          initialData={editingCategory ? { name: editingCategory.name, description: editingCategory.description || "" } : undefined}
        />
      </Modal>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        variant="destructive"
      />
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
