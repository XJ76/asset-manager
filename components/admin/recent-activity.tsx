import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PackageIcon, CalendarIcon } from "@/components/icons"
import type { Asset } from "@/types"

interface RecentActivityProps {
  assets: Asset[]
}

export function RecentActivity({ assets }: RecentActivityProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Recent Assets</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {assets.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
        ) : (
          <div className="flex flex-col gap-3">
            {assets.map((asset) => (
              <ActivityItem key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityItem({ asset }: { asset: Asset }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <PackageIcon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{asset.name}</p>
        <p className="text-xs text-muted-foreground">{asset.category}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-medium text-foreground">${asset.cost.toLocaleString()}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="w-3 h-3" />
          {new Date(asset.datePurchased).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
