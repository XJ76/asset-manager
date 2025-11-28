import { StatCard } from "@/components/shared/stat-card"
import { UsersIcon, FolderIcon, BuildingIcon, PackageIcon } from "@/components/icons"

interface AdminStatsProps {
  usersCount: number
  categoriesCount: number
  departmentsCount: number
  assetsCount: number
}

export function AdminStats({ usersCount, categoriesCount, departmentsCount, assetsCount }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatCard
        title="Total Users"
        value={usersCount}
        icon={<UsersIcon className="h-5 w-5" />}
        variant="primary"
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard
        title="Categories"
        value={categoriesCount}
        icon={<FolderIcon className="h-5 w-5" />}
        variant="success"
      />
      <StatCard
        title="Departments"
        value={departmentsCount}
        icon={<BuildingIcon className="h-5 w-5" />}
        variant="warning"
      />
      <StatCard
        title="Total Assets"
        value={assetsCount}
        icon={<PackageIcon className="h-5 w-5" />}
        variant="default"
        trend={{ value: 8, isPositive: true }}
      />
    </div>
  )
}
