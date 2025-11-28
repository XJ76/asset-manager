"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useAuthContext } from "@/contexts/auth-context"
import { LayoutDashboardIcon, PackageIcon } from "@/components/icons"

const userMenuItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon className="h-4 w-4" /> },
  { label: "My Assets", href: "/dashboard/assets", icon: <PackageIcon className="h-4 w-4" /> },
]

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return (
    <DashboardLayout title="User Dashboard" sidebarItems={userMenuItems}>
      {children}
    </DashboardLayout>
  )
}
