import { PageHeader } from "@/components/shared/page-header"
import { PendingUsersSection } from "@/components/admin/pending-users-section"

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="User Approvals" description="Review and approve pending user requests" />
      <PendingUsersSection />
    </div>
  )
}
