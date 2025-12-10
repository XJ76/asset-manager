"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { PackageIcon, ShieldCheckIcon } from "@/components/icons"
import { warrantyApi } from "@/lib/api/warranty"
import { useToast } from "@/hooks/use-toast"
import type { WarrantyRegistration } from "@/types"

export function WarrantyCentreSection() {
  const { toast } = useToast()
  const [registrations, setRegistrations] = useState<WarrantyRegistration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    setIsLoading(true)
    try {
      const result = await warrantyApi.getAll()
      setRegistrations(result.registrations)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch warranty registrations'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    {
      key: "assetName",
      label: "Asset",
      render: (item: WarrantyRegistration) => (
        <AssetCell name={item.assetName} />
      ),
    },
    {
      key: "registeredByName",
      label: "Registered By",
      render: (item: WarrantyRegistration) => (
        <span className="font-medium">{item.registeredByName}</span>
      ),
    },
    {
      key: "cost",
      label: "Cost",
      render: (item: WarrantyRegistration) => (
        <span className="font-semibold">
          {item.cost ? `$${item.cost.toLocaleString()}` : "—"}
        </span>
      ),
    },
    {
      key: "datePurchased",
      label: "Date Purchased",
      render: (item: WarrantyRegistration) => (
        <span>
          {item.datePurchased ? new Date(item.datePurchased).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "registeredAt",
      label: "Registered At",
      render: (item: WarrantyRegistration) => (
        <span className="text-muted-foreground">
          {new Date(item.registeredAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: () => (
        <Badge className="bg-green-500 hover:bg-green-600">
          <ShieldCheckIcon className="w-3 h-3 mr-1" />
          Registered
        </Badge>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Warranty Centre"
          description="View all assets registered for warranty"
        />
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Warranty Centre"
        description="View all assets registered for warranty"
      />
      <DataTable
        data={registrations.map((reg) => ({ ...reg, id: String(reg.id) }))}
        columns={columns}
        emptyMessage="No warranty registrations found"
      />
    </div>
  )
}

function AssetCell({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <PackageIcon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="font-medium">{name}</p>
      </div>
    </div>
  )
}

