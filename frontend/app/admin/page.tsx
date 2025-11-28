"use client"

import { AdminStats } from "@/components/admin/admin-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"
import { useUsers } from "@/hooks/use-users"
import { useCategories } from "@/hooks/use-categories"
import { useDepartments } from "@/hooks/use-departments"
import { useAssets } from "@/hooks/use-assets"

export default function AdminDashboardPage() {
  const { users } = useUsers()
  const { categories } = useCategories()
  const { departments } = useDepartments()
  const { assets } = useAssets()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your assets.</p>
      </div>
      <AdminStats
        usersCount={users.length}
        categoriesCount={categories.length}
        departmentsCount={departments.length}
        assetsCount={assets.length}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity assets={assets.slice(0, 5)} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
