import { cn } from "@/lib/utils"

type Status = "active" | "inactive" | "pending"

interface BadgeStatusProps {
  status: Status
}

const statusStyles: Record<Status, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
}

export function BadgeStatus({ status }: BadgeStatusProps) {
  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", statusStyles[status])}>{status}</span>
  )
}
