"use client"

import { useState } from "react"
import { DataTable } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { Modal } from "@/components/shared/modal"
import { AssetForm } from "@/components/forms/asset-form"
import { AssetDetailModal } from "@/components/shared/asset-detail-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PackageIcon, EyeIcon } from "@/components/icons"
import { useAssets } from "@/hooks/use-assets"
import { useCategories } from "@/hooks/use-categories"
import { useDepartments } from "@/hooks/use-departments"
import { useAuthContext } from "@/contexts/auth-context"
import type { Asset } from "@/types"

export function MyAssetsSection() {
  const { user } = useAuthContext()
  const { assets, createAsset, fetchAssets } = useAssets(user?.id)
  const { categories } = useCategories()
  const { departments } = useDepartments()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const myAssets = assets.filter((a) => a.createdBy === user?.id)
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
          onClick={() => {
            setSelectedAsset(item)
            setIsDetailModalOpen(true)
          }}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <EyeIcon className="h-4 w-4 mr-1" />
          View
        </Button>
      ),
    },
  ]

  const handleCreate = async (data: Parameters<typeof createAsset>[0]) => {
    await createAsset(data)
    setIsModalOpen(false)
  }

  const handleWarrantyRegistered = async () => {
    await fetchAssets()
  }

  return (
    <div>
      <PageHeader
        title="My Assets"
        description="View and manage your personal assets"
        actionLabel="Add Asset"
        onAction={() => setIsModalOpen(true)}
      />
      <DataTable data={myAssets} columns={columns} emptyMessage="You haven't created any assets yet" />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Asset"
        description="Add a new asset to your inventory"
      >
        <AssetForm
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          categories={categories}
          departments={departments}
        />
      </Modal>
      <AssetDetailModal
        asset={selectedAsset}
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedAsset(null)
        }}
        onWarrantyRegistered={handleWarrantyRegistered}
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
