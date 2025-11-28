import { StatCard } from "@/components/shared/stat-card"
import { PackageIcon, DollarIcon } from "@/components/icons"

interface UserStatsProps {
  myAssetsCount: number
  totalValue: number
}

export function UserStats({ myAssetsCount, totalValue }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
      <StatCard title="My Assets" value={myAssetsCount} icon={<PackageIcon className="h-5 w-5" />} variant="primary" />
      <StatCard
        title="Total Value"
        value={`$${totalValue.toLocaleString()}`}
        icon={<DollarIcon className="h-5 w-5" />}
        variant="success"
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  )
}
