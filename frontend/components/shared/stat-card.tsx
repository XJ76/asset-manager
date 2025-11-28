import type React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  variant?: "default" | "primary" | "success" | "warning"
}

export function StatCard({ title, value, icon, trend, variant = "default" }: StatCardProps) {
  const iconBgClass = {
    default: "bg-muted",
    primary: "bg-primary/10",
    success: "bg-emerald-500/10",
    warning: "bg-amber-500/10",
  }[variant]

  const iconTextClass = {
    default: "text-muted-foreground",
    primary: "text-primary",
    success: "text-emerald-600",
    warning: "text-amber-600",
  }[variant]

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <span className="text-2xl font-semibold tracking-tight text-foreground">{value}</span>
          {trend && <TrendBadge value={trend.value} isPositive={trend.isPositive} />}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconBgClass, iconTextClass)}>{icon}</div>
      </div>
    </div>
  )
}

function TrendBadge({ value, isPositive }: { value: number; isPositive: boolean }) {
  return (
    <span className={cn("text-xs font-medium mt-1", isPositive ? "text-emerald-600" : "text-red-500")}>
      {isPositive ? "+" : ""}
      {value}% from last month
    </span>
  )
}
