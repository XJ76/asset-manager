"use client"

import { UserStats } from "@/components/user/user-stats"
import { MyAssetsPreview } from "@/components/user/my-assets-preview"
import { useAssets } from "@/hooks/use-assets"
import { useAuthContext } from "@/contexts/auth-context"

export default function UserDashboardPage() {
  const { user } = useAuthContext()
  const { assets } = useAssets(user?.id)

  const myAssets = assets.filter((a) => a.createdBy === user?.id)
  const totalValue = myAssets.reduce((sum, a) => sum + a.cost, 0)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">Here's an overview of your assets.</p>
      </div>
      <UserStats myAssetsCount={myAssets.length} totalValue={totalValue} />
      <MyAssetsPreview assets={myAssets.slice(0, 4)} />
    </div>
  )
}
