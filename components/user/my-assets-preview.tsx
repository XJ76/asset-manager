import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PackageIcon, PlusIcon } from "@/components/icons"
import type { Asset } from "@/types"

interface MyAssetsPreviewProps {
  assets: Asset[]
}

export function MyAssetsPreview({ assets }: MyAssetsPreviewProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">My Assets</CardTitle>
        <Link href="/dashboard/assets">
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            <PlusIcon className="w-3 h-3 mr-1" />
            Add Asset
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        {assets.length === 0 ? (
          <EmptyAssetsState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assets.map((asset) => (
              <AssetPreviewCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AssetPreviewCard({ asset }: { asset: Asset }) {
  return (
    <div className="p-4 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <PackageIcon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{asset.name}</p>
          <p className="text-xs text-muted-foreground">{asset.category}</p>
          <p className="text-sm font-semibold text-foreground mt-1">${asset.cost.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

function EmptyAssetsState() {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-3">
        <PackageIcon className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No assets yet</p>
      <p className="text-xs text-muted-foreground mt-1">Create your first asset to get started</p>
    </div>
  )
}
