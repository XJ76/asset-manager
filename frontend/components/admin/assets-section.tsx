"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { TrashIcon, PackageIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { useAssets } from "@/hooks/use-assets"
import { useCategories } from "@/hooks/use-categories"
import { useDepartments } from "@/hooks/use-departments"
import type { Asset } from "@/types"

export function AssetsSection() {
  const { assets, deleteAsset } = useAssets()
  const { categories } = useCategories()
  const { departments } = useDepartments()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || "Unknown"
  const getDepartmentName = (id: string) => departments.find((d) => d.id === id)?.name || "Unknown"

  const columns = [
    {
      key: "name" as keyof Asset,
      label: "Asset",
      render: (item: Asset) => <AssetCell name={item.name} category={getCategoryName(item.categoryId)} />,
    },
    {
      key: "departmentId",
      label: "Department",
      render: (item: Asset) => <Badge variant="outline">{getDepartmentName(item.departmentId)}</Badge>,
    },
    {
      key: "cost",
      label: "Cost",
      render: (item: Asset) => <span className="font-semibold">${item.cost.toLocaleString()}</span>,
    },
    {
      key: "datePurchased",
      label: "Purchased",
      render: (item: Asset) => new Date(item.datePurchased).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "",
      render: (item: Asset) => (
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

  const handleDelete = async () => {
    if (deleteId) {
      await deleteAsset(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div>
      <PageHeader title="Assets" description="View and manage all organization assets" />
      <DataTable data={assets} columns={columns} emptyMessage="No assets found" />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Asset"
        description="Are you sure you want to delete this asset? This action cannot be undone."
        variant="destructive"
      />
    </div>
  )
}

function AssetCell({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <PackageIcon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{category}</p>
      </div>
    </div>
  )
}
