"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/shared/modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { warrantyApi } from "@/lib/api/warranty"
import { useAuthContext } from "@/contexts/auth-context"
import type { Asset } from "@/types"
import { useCategories } from "@/hooks/use-categories"
import { useDepartments } from "@/hooks/use-departments"
import { ShieldCheckIcon, ShieldIcon } from "@/components/icons"

interface AssetDetailModalProps {
  asset: Asset | null
  open: boolean
  onClose: () => void
  onWarrantyRegistered?: () => void
}

export function AssetDetailModal({ asset, open, onClose, onWarrantyRegistered }: AssetDetailModalProps) {
  const { user } = useAuthContext()
  const { toast } = useToast()
  const { categories } = useCategories()
  const { departments } = useDepartments()
  const [isRegistering, setIsRegistering] = useState(false)
  const [warrantyStatus, setWarrantyStatus] = useState<boolean | null>(null)
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  useEffect(() => {
    if (asset && open) {
      checkWarrantyStatus()
    }
  }, [asset, open])

  const checkWarrantyStatus = async () => {
    if (!asset) return
    
    setIsCheckingStatus(true)
    try {
      const result = await warrantyApi.checkStatus(asset.id)
      setWarrantyStatus(result.registered)
    } catch (error) {
      console.error('Error checking warranty status:', error)
      setWarrantyStatus(false)
    } finally {
      setIsCheckingStatus(false)
    }
  }

  const handleRegisterWarranty = async () => {
    if (!asset || !user) return

    setIsRegistering(true)
    try {
      await warrantyApi.register({
        assetId: asset.id,
        assetName: asset.name,
        categoryId: asset.categoryId,
        departmentId: asset.departmentId,
        datePurchased: asset.datePurchased instanceof Date 
          ? asset.datePurchased.toISOString().split('T')[0]
          : new Date(asset.datePurchased).toISOString().split('T')[0],
        cost: asset.cost,
        registeredBy: user.id,
        registeredByName: user.name,
        organizationId: user.organizationId,
      })

      setWarrantyStatus(true)
      toast({
        title: "Success",
        description: "Asset registered for warranty successfully",
      })
      
      onWarrantyRegistered?.()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register warranty'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (!asset) return null

  const categoryName = categories.find((c) => c.id === asset.categoryId)?.name || "Unknown"
  const departmentName = departments.find((d) => d.id === asset.departmentId)?.name || "Unknown"

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Asset Details"
      description="View asset information and register for warranty"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Asset Name</label>
            <p className="text-lg font-semibold mt-1">{asset.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <p className="text-lg mt-1">{categoryName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Department</label>
            <p className="text-lg mt-1">{departmentName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Cost</label>
            <p className="text-lg font-semibold mt-1">${asset.cost.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Date Purchased</label>
            <p className="text-lg mt-1">
              {new Date(asset.datePurchased).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Warranty Status</label>
            <div className="mt-1">
              {isCheckingStatus ? (
                <Badge variant="outline">Checking...</Badge>
              ) : warrantyStatus ? (
                <Badge className="bg-green-500 hover:bg-green-600">
                  <ShieldCheckIcon className="w-3 h-3 mr-1" />
                  Warranty Registered
                </Badge>
              ) : (
                <Badge variant="outline">
                  <ShieldIcon className="w-3 h-3 mr-1" />
                  Not Registered
                </Badge>
              )}
            </div>
          </div>
        </div>

        {!warrantyStatus && (
          <div className="pt-4 border-t">
            <Button
              onClick={handleRegisterWarranty}
              disabled={isRegistering}
              className="w-full"
              size="lg"
            >
              {isRegistering ? "Registering..." : "Register Warranty"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

