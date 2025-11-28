"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LogoIcon } from "@/components/icons"

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface SidebarProps {
  items: SidebarItem[]
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-sidebar h-screen flex flex-col border-r border-sidebar-border">
      <SidebarHeader />
      <nav className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <SidebarLink key={item.href} item={item} isActive={pathname === item.href} />
          ))}
        </div>
      </nav>
      <SidebarFooter />
    </aside>
  )
}

function SidebarHeader() {
  return (
    <div className="p-4 border-b border-sidebar-border">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
          <LogoIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-sidebar-foreground">Asset Manager</h1>
          <p className="text-xs text-sidebar-muted">Enterprise Edition</p>
        </div>
      </div>
    </div>
  )
}

function SidebarLink({ item, isActive }: { item: SidebarItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-sidebar-accent text-sidebar-primary"
          : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
      )}
    >
      <span className={cn("transition-colors", isActive && "text-sidebar-primary")}>{item.icon}</span>
      {item.label}
    </Link>
  )
}

function SidebarFooter() {
  return (
    <div className="p-4 border-t border-sidebar-border">
      <p className="text-xs text-sidebar-muted">v1.0.0</p>
    </div>
  )
}
