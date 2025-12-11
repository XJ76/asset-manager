"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageLoader } from "@/components/shared/loading-spinner"
import { useAuthContext } from "@/contexts/auth-context"
import { LayoutDashboardIcon, UsersIcon, FolderIcon, BuildingIcon, PackageIcon } from "@/components/icons"

const adminMenuItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboardIcon className="h-4 w-4" /> },
  { label: "Users", href: "/admin/users", icon: <UsersIcon className="h-4 w-4" /> },
  { label: "Categories", href: "/admin/categories", icon: <FolderIcon className="h-4 w-4" /> },
  { label: "Departments", href: "/admin/departments", icon: <BuildingIcon className="h-4 w-4" /> },
  { label: "All Assets", href: "/admin/assets", icon: <PackageIcon className="h-4 w-4" /> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) return <PageLoader />
  if (!isAuthenticated || user?.role !== "admin") return null

  return (
    <DashboardLayout title="Admin Dashboard" sidebarItems={adminMenuItems}>
      {children}
    </DashboardLayout>
  )
}
